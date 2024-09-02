import axios from 'axios';
import https from 'https';

const WSO2_IDP_BASE_URL: string = process.env.NEXT_PUBLIC_IDP_BASE_URL
  ? process.env.NEXT_PUBLIC_IDP_BASE_URL
  : '';

const IDENTITY_SERVER_USERNAME: string = process.env
  .NEXT_PUBLIC_IDENTITY_SERVER_USERNAME
  ? process.env.NEXT_PUBLIC_IDENTITY_SERVER_USERNAME
  : 'admin';

const IDENTITY_SERVER_PASSWORD: string = process.env
  .NEXT_PUBLIC_IDENTITY_SERVER_PASSWORD
  ? process.env.NEXT_PUBLIC_IDENTITY_SERVER_PASSWORD
  : 'admin';

const agent = new https.Agent({
  rejectUnauthorized: false,
});
const API_TIMEOUT = 30000;
const SKIP_CERT_CHECK: boolean =
  typeof process.env.NEXT_PUBLIC_SKIP_CERT_CHECK !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_SKIP_CERT_CHECK
    : false;

export default async function handler(req: any, res: any) {
  try {
    const instance = axios.create({
      timeout: API_TIMEOUT,
      auth: {
        username: IDENTITY_SERVER_USERNAME,
        password: IDENTITY_SERVER_PASSWORD,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    let config: any = {};
    if (SKIP_CERT_CHECK) {
      config = {httpsAgent: agent};
    }

    const url = WSO2_IDP_BASE_URL + '/oauth2/introspect';

    console.log('oidc-token-introspect url->', url);

    let tokenResponse: any = await instance.post(
      url,
      `token=${req.body.token}`,
      config,
    );

    if (tokenResponse?.data?.active) {
      return res.status(200).json(tokenResponse?.data);
    } else {
      return res.status(401).json({message: 'TOKEN_VALIDATION_ERROR'});
    }
  } catch (e: any) {
    console.log('error->', e);
    return res.status(401).json({message: 'TOKEN_VALIDATION_ERROR'});
  }
}
