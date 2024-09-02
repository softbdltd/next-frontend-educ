import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {
  API_ASSIGN_CERTIFICATE_TEMPLATES,
  API_ASSIGN_EXAMS_TO_BATCH,
  API_ASSIGN_TRAINERS_TO_BATCH,
  API_BATCH_PUBLISH_RESULT,
  API_BATCHES,
  API_EXAMS,
  API_PROCESS_RESULT,
  API_LEARNER_BATCH_EXAMS_MARK_UPDATE,
  INSTITUTE_SERVICE_DASHBOARD_COURSE_EMPLOYMENT_STATUS_UPDATE,
} from '../../@core/common/apiRoutes';
import {IBatch} from '../../shared/Interface/institute.interface';

/**
 * @deprecated
 */
export const getAllBatches = async (params = {}) => {
  try {
    let response: any = await apiGet(API_BATCHES, {params});
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 */
export const getBatch = async (batchId: number) => {
  try {
    let response: any = await apiGet(API_BATCHES + '/' + batchId);
    return response.data;
  } catch (catchBlockHandler) {}
};

export const createBatch = async (data: IBatch) => {
  try {
    let response: any = await apiPost(API_BATCHES, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assignCertificateTemplatesInBatch = async (
  id: number,
  data: any,
) => {
  try {
    let response: any = await apiPost(
      `${API_BATCHES}/${id}${API_ASSIGN_CERTIFICATE_TEMPLATES}`,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateBatch = async (batchId: number, data: IBatch) => {
  try {
    let response: any = await apiPut(API_BATCHES + '/' + batchId, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteBatch = async (batchId: number) => {
  try {
    let response: any = await apiDelete(API_BATCHES + '/' + batchId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assignTrainersToBatch = async (batchId: number, data: any) => {
  let trainersId = {trainerIds: data};
  try {
    let response: any = await apiPost(
      API_BATCHES + '/' + batchId + API_ASSIGN_TRAINERS_TO_BATCH,
      trainersId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assignExamsToBatch = async (batchId: number, data: any) => {
  try {
    let response: any = await apiPost(
      API_BATCHES + '/' + batchId + API_ASSIGN_EXAMS_TO_BATCH,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const processResult = async (batchId: number) => {
  try {
    let response: any = await apiPost(
      API_BATCHES + '/' + batchId + API_PROCESS_RESULT,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const publishResult = async (batchId: number, data: any) => {
  try {
    let response: any = await apiPut(
      API_BATCHES + '/' + batchId + API_BATCH_PUBLISH_RESULT,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const publishSingleResult = async (examTypeId: number, params: any) => {
  try {
    let response: any = await apiPut(
      API_EXAMS + '/' + examTypeId + API_BATCH_PUBLISH_RESULT,
      params,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const learnerExamMarking = async (data: any) => {
  try {
    let response: any = await apiPost(API_LEARNER_BATCH_EXAMS_MARK_UPDATE, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateCourseEmploymentStatus = async (data: any) => {
  try {
    let response: any = await apiPost(
      INSTITUTE_SERVICE_DASHBOARD_COURSE_EMPLOYMENT_STATUS_UPDATE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
