import {
  useAxiosSWR,
  useDataLocalizationAxiosSWR,
} from '../../@core/hooks/useAxiosSWR';
import {
  INSTITUTE_SERVICE_DASHBOARD_STATS_PATH,
  INSTITUTE_SERVICE_PUBLIC_DASHBOARD_STATS_PATH,
} from '../../@core/common/apiRoutes';

export function useFetchPublicDashboardStatistics() {
  return useAxiosSWR(INSTITUTE_SERVICE_PUBLIC_DASHBOARD_STATS_PATH);
}

// TSP_DASHBOARD_SERVICE_PATH
export function useFetchDashboardStatistics() {
  return useAxiosSWR(INSTITUTE_SERVICE_DASHBOARD_STATS_PATH);
}
