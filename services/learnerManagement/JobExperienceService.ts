import {apiDelete, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {
  API_LEARNER_JOB_EXPERIENCES,
  API_LEARNER_JOB_EXPERIENCES_APPRENTICESHIP,
} from '../../@core/common/apiRoutes';
import {YouthJobExperience} from './typing';

export const createJobExperience = async (data: YouthJobExperience) => {
  try {
    let response: any = await apiPost(API_LEARNER_JOB_EXPERIENCES, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createOrUpdateJobExperienceApprenticeship = async (
  apprenticeshipId: number,
  data: YouthJobExperience,
) => {
  try {
    let response: any = await apiPost(
      API_LEARNER_JOB_EXPERIENCES_APPRENTICESHIP + '/' + apprenticeshipId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateJobExperience = async (
  JobExperienceId: number,
  data: YouthJobExperience,
) => {
  try {
    let response: any = await apiPut(
      API_LEARNER_JOB_EXPERIENCES + '/' + JobExperienceId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteJobExperience = async (jobExperienceId: number) => {
  try {
    let response: any = await apiDelete(
      API_LEARNER_JOB_EXPERIENCES + '/' + jobExperienceId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
