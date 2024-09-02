import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {
  COOKIE_KEY_APP_ACCESS_TOKEN,
  COOKIE_KEY_APP_ACCESS_TOKEN_RPL,
  COOKIE_KEY_AUTH_ACCESS_TOKEN,
  COOKIE_KEY_AUTH_ID_TOKEN,
  COOKIE_KEY_AUTH_REFRESH_TOKEN,
} from '../../shared/constants/AppConst';
import {
  API_BASE_URL,
  API_SSO_RENEW_ACCESS_TOKEN,
  APP_LEVEL_ACCESS_TOKEN,
} from '../common/apiRoutes';
import {erplDomain} from '../common/constants';
import {getSSOLoginUrl} from '../common/SSOConfig';
import {getCurrentDomain} from '../utilities/helpers';
import {
  clearAuthCookies,
  clearAuthRefreshCookies,
  getAppAccessTokenFromCookie,
  getAuthAccessTokenFromCookie,
  getAuthRefreshTokenFromCookie,
} from './cookieHelpers';
import {setBrowserCookie} from './cookieInstance';
import registerAxiosMockAdapter from './registerAxiosMockAdapter';

let retryAuthRefreshToken = 0;
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
});
axiosInstance.defaults.headers.common['Accept'] = 'application/json';
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const authAccessToken = getAuthAccessTokenFromCookie();

    if (!config.headers['Authorization']) {
      const appAccessTokenData = getAppAccessTokenFromCookie();

      config.headers[
        'Authorization'
      ] = `Bearer ${appAccessTokenData?.access_token}`;
    }

    //const userAccessToken = authAccessTokenData?.access_token;
    if (!config.headers['User-Token'] && authAccessToken) {
      config.headers['User-Token'] = `Bearer ${authAccessToken}`;
    }

    if (!config.headers['Domain']) {
      config.headers['Domain'] = getCurrentDomain();
    }


    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    // console.count('countSuccessRequest');
    return response;
  },
  async function (error) {
    //console.count('countFailedRequest');
    if (error?.response?.status === 401) {
      retryConfig.urls[error.config.url] =
        (retryConfig.urls[error.config.url] ?? 0) + 1;
      if (retryConfig.urls[error.config.url] > retryConfig.maxRetries) {
        return Promise.reject(error);
      }

      return await retryRefresh(error);
    }
    return Promise.reject(error);
  },
);

const retryConfig: any = {
  maxRetries: 3,
  urls: {},
};

/**
 * If any authorized request failed with an unauthorized response
 * then this method will keep all requests waiting until
 * new access token is retrieved
 * */
const retryRefresh = (
  (count = 0, waitingPromise: Promise<any> = Promise.resolve()) =>
  async (error: AxiosError): Promise<any> => {
    count++;
    const config = {...error.config, headers: {...error.config.headers}};
    //console.log('CONF >>', error.config);
    delete config.headers['Authorization'];
    const authAccessToken = getAuthAccessTokenFromCookie();
    if (authAccessToken) {
      config.headers['User-Token'] = `Bearer ${authAccessToken}`;
    }
    if (count > 1) {
      // USE FOR RETRY (ALL REQUEST EXCEPT FIRST REQUEST)
      return new Promise((resolve) => {
        waitingPromise.then(() => {
          resolve(axiosInstance.request(config));
        });
        // setTimeout(() => {
        //   resolve(axiosInstance.request(config));
        // }, 1000);
      });
    } else {
      const authRefreshToken = getAuthRefreshTokenFromCookie();
      if (authRefreshToken) {
        waitingPromise = refreshAuthAccessToken();
        await waitingPromise;
      } else {
        waitingPromise = refreshAppAccessToken();
        await waitingPromise;
      }
      count = 0;
      waitingPromise = Promise.resolve();
      // return Promise.reject();
      return axiosInstance.request(config); // USE FOR RETRY (FOR FIRST REQUEST)
    }
  }
)();

export function setDefaultAuthorizationHeader(accessToken?: string) {
  axiosInstance.defaults.headers.common['Authorization'] =
    'Bearer ' + accessToken || '';
}

export async function refreshAuthAccessToken() {
  if (retryAuthRefreshToken === 20) {
    clearAuthCookies();
    clearAuthRefreshCookies();
    window.location.href = getSSOLoginUrl();
  }
  retryAuthRefreshToken++;
  //console.log('refreshAuthAccessToken');
  const authRefreshToken = getAuthRefreshTokenFromCookie();

  let appAccessTokenData = getAppAccessTokenFromCookie();
  if (!appAccessTokenData) {
    await refreshAppAccessToken();
    //appAccessTokenData = getBrowserCookie(COOKIE_KEY_APP_ACCESS_TOKEN);
  }

  if (authRefreshToken) {
    try {
      let {
        data: {id_token, ...responseTokenData},
      } = await axios.post(API_SSO_RENEW_ACCESS_TOKEN, {
        refresh_token: authRefreshToken,
      });

      let expireDate = new Date();
      expireDate.setTime(
        new Date().getTime() + Number(responseTokenData?.expires_in) * 1000,
      );

      await setBrowserCookie(
        COOKIE_KEY_AUTH_ACCESS_TOKEN,
        responseTokenData?.access_token,
        {expires: expireDate},
      );
      await setBrowserCookie(
        COOKIE_KEY_AUTH_REFRESH_TOKEN,
        responseTokenData?.refresh_token,
      );
      await setBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN, id_token, {
        expires: expireDate,
      });

      setDefaultAuthorizationHeader(responseTokenData?.access_token);
      retryAuthRefreshToken = 0;
    } catch (e) {
      console.log('refreshAuthAccessToken-error', e);
      clearAuthCookies();
      clearAuthRefreshCookies();
    }
  } else {
    clearAuthCookies();
    clearAuthRefreshCookies();
  }
}

export async function refreshAppAccessToken() {
  try {
    let response = await getAppAccessToken({
      throwError: true,
    });

    const {data: tokenData}: any = response;

    let expireDate = new Date();
    expireDate.setTime(
      new Date().getTime() + Number(tokenData.expires_in) * 1000,
    );
    setBrowserCookie(COOKIE_KEY_APP_ACCESS_TOKEN, tokenData, {
      expires: expireDate,
    });
    setBrowserCookie(COOKIE_KEY_APP_ACCESS_TOKEN_RPL, tokenData, {
      expires: expireDate,
      domain: erplDomain(),
    });
    setDefaultAuthorizationHeader(tokenData?.access_token);
  } catch (e) {
    console.log(e);
  }
}

export async function getAppAccessToken({throwError = false} = {}) {
  try {
    return await axios.get(APP_LEVEL_ACCESS_TOKEN);
  } catch (e: any) {
    if (throwError) {
      throw e;
    }
  }
}

registerAxiosMockAdapter(axiosInstance);

export default axiosInstance;
