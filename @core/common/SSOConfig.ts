import {ParsedUrlQuery} from 'querystring';
import {
  COOKIE_KEY_AUTH_ID_TOKEN,
  COOKIE_KEY_AUTH_ID_TOKEN_RPL,
  COOKIE_KEY_CDAP_SESSION_STATE,
  COOKIE_KEY_SSO_SESSION_STATE,
  COOKIE_KEY_SSO_SESSION_STATE_RPL,
} from '../../shared/constants/AppConst';
import {getBrowserCookie} from '../libs/cookieInstance';
import {educDomain} from './constants';

interface TConfig {
  authUrl: string;
  logoutUrl: string;
  tokenUrl: string;
  clientKey: string;
  // clientSecret: string;
  callbackUrl: string;
}

const SSO_CONFIG: TConfig = {
  authUrl: process.env.NEXT_PUBLIC_IDP_BASE_URL,
  logoutUrl: process.env.NEXT_PUBLIC_IDP_BASE_URL + '/oidc/logout',
  tokenUrl: process.env.NEXT_PUBLIC_IDP_BASE_URL + '/oauth2/token',
  clientKey: process.env.NEXT_PUBLIC_IDP_OPENID_KEY,
  callbackUrl: '/callback',
};

export const getHostUrl = () => {
  return typeof window !== 'undefined' && window?.location?.origin
    ? window.location.origin
    : '';
};

export const paramsBuilder = (extraParams: any) => {
  let params = '';
  if (extraParams) {
    Object.keys(extraParams).forEach((key, index) => {
      if (index) {
        params += '&';
      }
      params += key + '=' + extraParams[key];
    });
  }

  return params;
};

export const getSSOLoginUrl = (extraParams?: ParsedUrlQuery) => {
  const redirectUrl = new URL(getHostUrl() + SSO_CONFIG.callbackUrl);
  if (extraParams) {
    redirectUrl.search = paramsBuilder(extraParams);
  }

  return (
    SSO_CONFIG.authUrl +
    '?response_type=code&client_id=' +
    SSO_CONFIG.clientKey +
    '&scope=openid&nonce=13e2312637dg136e1&' +
    'redirect_uri=' +
    encodeURI(redirectUrl.toString())
  );
};

export const getSSOLogoutUrl = () => {
  const idToken =
    getBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN) ||
    getBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN_RPL);
  const ssoSessionState =
    getBrowserCookie(COOKIE_KEY_SSO_SESSION_STATE) ||
    getBrowserCookie(COOKIE_KEY_SSO_SESSION_STATE_RPL);
  const cdapSessionState = getBrowserCookie(COOKIE_KEY_CDAP_SESSION_STATE);
  const sessionState = cdapSessionState ?? ssoSessionState;
  const params =
    typeof window !== 'undefined'
      ? '?redirected_from=' + window.location.href
      : '';

  const postLogoutRedirectUri = educDomain() + '/logout' + params;

  return (
    SSO_CONFIG.logoutUrl +
    '?id_token_hint=' +
    idToken +
    '&post_logout_redirect_uri=' +
    postLogoutRedirectUri +
    '&session_state=' +
    sessionState
  );
};
export default SSO_CONFIG;
