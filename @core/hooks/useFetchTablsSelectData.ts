import {useDataLocalizationAxiosSWR} from './useAxiosSWR';

export function useFetchSelectData(apiPath?: string, params?: any) {
  return useDataLocalizationAxiosSWR(apiPath ? [apiPath, params] : null);
}
