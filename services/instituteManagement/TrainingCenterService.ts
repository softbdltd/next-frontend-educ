import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_TRAINING_CENTERS} from '../../@core/common/apiRoutes';
import {ITrainingCenter} from '../../shared/Interface/institute.interface';

export const getAllTrainingCenters = async (params = {}) => {
  try {
    let response: any = await apiGet(API_TRAINING_CENTERS, {params});
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 */
export const getTrainingCenter = async (trainingCenterId: number) => {
  try {
    let response: any = await apiGet(
      API_TRAINING_CENTERS + '/' + trainingCenterId,
    );
    return response.data;
  } catch (catchBlockHandler) {}
};

export const createTrainingCenter = async (data: ITrainingCenter) => {
  try {
    let response: any = await apiPost(API_TRAINING_CENTERS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateTrainingCenter = async (
  trainingCenterId: number,
  data: ITrainingCenter,
) => {
  try {
    let response: any = await apiPut(
      API_TRAINING_CENTERS + '/' + trainingCenterId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteTrainingCenter = async (trainingCenterId: number) => {
  try {
    let response: any = await apiDelete(
      API_TRAINING_CENTERS + '/' + trainingCenterId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
