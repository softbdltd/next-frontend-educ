import {apiGetAppAccessToken} from '../../../services/APIService/ssoApiService';

export default async function handler(req: any, res: any) {
  return await apiGetAppAccessToken(req, res);
}
