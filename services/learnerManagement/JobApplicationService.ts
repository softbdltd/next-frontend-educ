import {apiPost} from '../../@core/common/api';
import {API_LEARNER_APPLY_JOB} from '../../@core/common/apiRoutes';
import {catchBlockHandler} from '../../@core/utilities/helpers';

export const createJobApplication = async (data: any) => {
  try {
    let response: any = await apiPost(API_LEARNER_APPLY_JOB, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
