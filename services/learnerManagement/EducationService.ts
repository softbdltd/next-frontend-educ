import {YouthEducation} from './typing';
import {apiDelete, apiPost, apiPut} from '../../@core/common/api';
import {API_LEARNER_EDUCATION} from '../../@core/common/apiRoutes';
import {catchBlockHandler} from '../../@core/utilities/helpers';

export const createEducation = async (data: YouthEducation) => {
  try {
    let response: any = await apiPost(API_LEARNER_EDUCATION, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateEducation = async (
  educationId: number,
  data: YouthEducation,
) => {
  try {
    let response: any = await apiPut(
      API_LEARNER_EDUCATION + '/' + educationId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteEducation = async (educationId: number) => {
  try {
    let response: any = await apiDelete(
      API_LEARNER_EDUCATION + '/' + educationId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
