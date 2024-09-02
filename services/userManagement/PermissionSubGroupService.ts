import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_PERMISSION_SUB_GROUPS} from '../../@core/common/apiRoutes';
import { IPermissionSubGroup } from '../../shared/Interface/userManagement.interface';

/**
 * @deprecated
 */
export const getAllPermissionSubGroups = async () => {
  try {
    let response: any = await apiGet(API_PERMISSION_SUB_GROUPS);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 * @param permissionSubGroupId
 */
export const getPermissionSubGroup = async (permissionSubGroupId: number) => {
  try {
    let response: any = await apiGet(
      API_PERMISSION_SUB_GROUPS + '/' + permissionSubGroupId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createPermissionSubGroup = async (data: IPermissionSubGroup) => {
  try {
    let response: any = await apiPost(API_PERMISSION_SUB_GROUPS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updatePermissionSubGroup = async (
  permissionSubGroupId: number,
  data: IPermissionSubGroup,
) => {
  try {
    let response: any = await apiPut(
      API_PERMISSION_SUB_GROUPS + '/' + permissionSubGroupId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deletePermissionSubGroup = async (
  permissionSubGroupId: number,
) => {
  try {
    let response: any = await apiDelete(
      API_PERMISSION_SUB_GROUPS + '/' + permissionSubGroupId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assignPermissions = async (
  permissionSubGroupId: number,
  permissions: number[],
) => {
  try {
    let response: any = await apiPost(
      `${API_PERMISSION_SUB_GROUPS}/${permissionSubGroupId}/assign-permissions`,
      {permissions: permissions},
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
