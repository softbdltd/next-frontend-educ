import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_DIVISIONS} from '../../@core/common/apiRoutes';
import {Division} from '../../shared/Interface/location.interface';

export const createDivision = async (data: Division) => {
  try {
    let response: any = await apiPost(API_DIVISIONS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateDivision = async (divisionId: number, data: Division) => {
  try {
    let response: any = await apiPut(API_DIVISIONS + '/' + divisionId, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteDivision = async (divisionId: number) => {
  try {
    let response: any = await apiDelete(API_DIVISIONS + '/' + divisionId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getAllDivisions = async (params = {}) => {
  try {
    let response: any = await apiGet(API_DIVISIONS, {params});
    return response.data;
  } catch (error) {
    return [];
  }
};
