import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_ROLES} from '../../@core/common/apiRoutes';
import { IRole } from '../../shared/Interface/userManagement.interface';

/**
 * @deprecated
 */
export const getAllRoles = async () => {
  try {
    let response: any = await apiGet(API_ROLES);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 * @param roleId
 */
export const getRole = async (roleId: number) => {
  try {
    let response: any = await apiGet(API_ROLES + '/' + roleId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteRole = async (roleId: number) => {
  try {
    let response: any = await apiDelete(API_ROLES + '/' + roleId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createRole = async (data: IRole) => {
  try {
    let response: any = await apiPost(API_ROLES, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateRole = async (roleId: number, data: IRole) => {
  try {
    let response: any = await apiPut(API_ROLES + '/' + roleId, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assignPermissions = async (
  roleId: number,
  permissions: number[],
) => {
  try {
    let response: any = await apiPost(
      `${API_ROLES}/${roleId}/assign-permissions`,
      {permissions: permissions},
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
