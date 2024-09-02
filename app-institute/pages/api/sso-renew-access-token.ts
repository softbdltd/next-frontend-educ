import {apiRenewAuthorizedAccessToken} from '../../../services/APIService/ssoApiService';

export default async function handler(req: any, res: any) {
  await apiRenewAuthorizedAccessToken(req, res);
}
