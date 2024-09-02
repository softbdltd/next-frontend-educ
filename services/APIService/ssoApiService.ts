import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const API_MANAGER_BASE_URL: string = process.env
  .NEXT_PUBLIC_API_MANAGER_BASE_URL
  ? process.env.NEXT_PUBLIC_API_MANAGER_BASE_URL
  : '';
const WSO2_APIM_CLIENT_KEY: string = process.env
  .NEXT_PUBLIC_WSO2_APIM_CLIENT_KEY
  ? process.env.NEXT_PUBLIC_WSO2_APIM_CLIENT_KEY
  : 'KEY';
const WSO2_APIM_CLIENT_SECRET: string = process.env
  .NEXT_PUBLIC_WSO2_APIM_CLIENT_SECRET
  ? process.env.NEXT_PUBLIC_WSO2_APIM_CLIENT_SECRET
  : 'key';

const SKIP_CERT_CHECK: boolean =
  typeof process.env.NEXT_PUBLIC_SKIP_CERT_CHECK !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_SKIP_CERT_CHECK
    : false;

const WSO2_IDP_BASE_URL: string = process.env.NEXT_PUBLIC_IDP_BASE_URL
  ? process.env.NEXT_PUBLIC_IDP_BASE_URL
  : '';
const WSO2_IDP_OPENID_KEY: string = process.env.NEXT_PUBLIC_IDP_OPENID_KEY
  ? process.env.NEXT_PUBLIC_IDP_OPENID_KEY
  : '';
const WSO2_IDP_OPENID_SECRET: string = process.env.NEXT_PUBLIC_IDP_OPENID_SECRET
  ? process.env.NEXT_PUBLIC_IDP_OPENID_SECRET
  : '';

const API_TIMEOUT = 30000;

export const apiGetAppAccessToken = async (req: any, res: any) => {
  try {

    let buff = Buffer.from(
      WSO2_APIM_CLIENT_KEY + ':' + WSO2_APIM_CLIENT_SECRET,
    );
    let base64data = buff.toString('base64');

    const instance = axios.create({
      timeout: API_TIMEOUT,
      headers: {
        Authorization: 'Basic ' + base64data,
        'Content-Type': 'application/json',
      },
    });

    let config: any = {};
    if (SKIP_CERT_CHECK) {
      config = {httpsAgent: agent};
    }

    const url = API_MANAGER_BASE_URL + '/oauth2/token';
    console.log('apiGetAppAccessToken url->', url);
    const tokenResponse: any = await instance.post(
      url,
      {
        grant_type: 'client_credentials',
      },
      config,
    );
    console.log('apiGetAppAccessToken response ->', tokenResponse?.data);

    return res.status(200).json(tokenResponse?.data);
  } catch (e: any) {
    console.log(e);
    return res
      .status(500)
      .json({message: 'Problem in generating api manager access token'});
  }
};

export const apiGetAuthorizedAccessToken = async (req: any, res: any) => {
  try {
    let buff = Buffer.from(WSO2_IDP_OPENID_KEY + ':' + WSO2_IDP_OPENID_SECRET);
    let base64data = buff.toString('base64');

    const instance = axios.create({
      timeout: API_TIMEOUT,
      headers: {
        Authorization: 'Basic ' + base64data,
        'Content-Type': 'application/json',
      },
    });

    let config: any = {};
    if (SKIP_CERT_CHECK) {
      config = {httpsAgent: agent};
    }

    const url =
      WSO2_IDP_BASE_URL +
      '/oauth2/token?grant_type=authorization_code&code=' +
      req.body.code +
      '&redirect_uri=' +
      req.body.redirect_uri;
    console.log('apiGetAuthorizedAccessToken url->', url);

    const tokenResponse: any = await instance.post(url, {}, config);

    console.log('apiGetAuthorizedAccessToken response ->', tokenResponse?.data);

    return res.status(200).json(tokenResponse?.data);
  } catch (e: any) {
    console.log(e);
    return res
      .status(500)
      .json({message: 'Problem in generating user level access token'});
  }
};

export const apiRenewAuthorizedAccessToken = async (req: any, res: any) => {
  try {
    let buff = Buffer.from(WSO2_IDP_OPENID_KEY + ':' + WSO2_IDP_OPENID_SECRET);
    let base64data = buff.toString('base64');

    const instance = axios.create({
      timeout: API_TIMEOUT,
      headers: {
        Authorization: 'Basic ' + base64data,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    let config: any = {};
    if (SKIP_CERT_CHECK) {
      config = {httpsAgent: agent};
    }

    const url =
      WSO2_IDP_BASE_URL +
      '/oauth2/token?grant_type=refresh_token&refresh_token=' +
      req.body.refresh_token;

    console.log('apiGetAuthorizedAccessToken url->', url);

    const tokenResponse: any = await instance.post(url, {}, config);

    console.log(
      'apiRenewAuthorizedAccessToken response ->',
      tokenResponse?.data,
    );

    return res.status(200).json(tokenResponse?.data);
  } catch (e: any) {
    console.log(e);
    return res
      .status(500)
      .json({message: 'Problem in getting api manager renew access token'});
  }
};
