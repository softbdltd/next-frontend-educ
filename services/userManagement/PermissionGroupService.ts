import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_PERMISSION_GROUPS} from '../../@core/common/apiRoutes';
import { IPermissionGroup } from '../../shared/Interface/userManagement.interface';

/**
 * @deprecated
 */
export const getAllPermissionGroups = async () => {
  try {
    let response: any = await apiGet(API_PERMISSION_GROUPS);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 * @param permissionGroupId
 */
export const getPermissionGroup = async (permissionGroupId: number) => {
  try {
    let response: any = await apiGet(
      API_PERMISSION_GROUPS + '/' + permissionGroupId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createPermissionGroup = async (data: IPermissionGroup) => {
  try {
    let response: any = await apiPost<IPermissionGroup>(API_PERMISSION_GROUPS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updatePermissionGroup = async (
  permissionGroupId: number,
  data: IPermissionGroup,
) => {
  try {
    let response: any = await apiPut<IPermissionGroup>(
      API_PERMISSION_GROUPS + '/' + permissionGroupId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deletePermissionGroup = async (permissionGroupId: number) => {
  try {
    let response: any = await apiDelete(
      API_PERMISSION_GROUPS + '/' + permissionGroupId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assignPermissions = async (
  permissionGroupId: number,
  permissions: number[],
) => {
  try {
    let response: any = await apiPost(
      `${API_PERMISSION_GROUPS}/${permissionGroupId}/assign-permissions`,
      {permissions: permissions},
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getPermissionGroupWithPermissions = async (
  permissionGroupId: number,
  params = {},
) => {
  try {
    let response: any = await apiGet(
      API_PERMISSION_GROUPS + '/' + permissionGroupId,
      {params},
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
