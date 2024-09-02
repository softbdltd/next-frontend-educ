import {API_INSTITUTE_PROFILE, API_INSTITUTES, API_TRAINING_CENTER_PROFILE,} from '../../@core/common/apiRoutes';
import {useAxiosSWR,} from '../../@core/hooks/useAxiosSWR';

export function useFetchInstitute(instituteId: number | null) {
  return useAxiosSWR(instituteId ? API_INSTITUTES + '/' + instituteId : null);
}

export function useFetchInstituteProfile() {
  return useAxiosSWR(API_INSTITUTE_PROFILE);
}

export function useFetchTrainingCenterProfile() {
  return useAxiosSWR(API_TRAINING_CENTER_PROFILE);
}
