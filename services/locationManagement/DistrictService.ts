import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_DISTRICTS} from '../../@core/common/apiRoutes';
import {District} from '../../shared/Interface/location.interface';

export const createDistrict = async (data: District) => {
  try {
    let response: any = await apiPost(API_DISTRICTS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateDistrict = async (districtId: number, data: District) => {
  try {
    let response: any = await apiPut(API_DISTRICTS + '/' + districtId, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteDistrict = async (districtId: number) => {
  try {
    let response: any = await apiDelete(API_DISTRICTS + '/' + districtId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getAllDistricts = async (params = {}) => {
  try {
    let response: any = await apiGet(API_DISTRICTS, {params});
    return response.data;
  } catch (error) {
    return [];
  }
};
