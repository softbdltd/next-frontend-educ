import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {
  API_COORDINATORS,
  API_USERS,
  CORE_SERVICE_PATH,
  PROFILE_UPDATE,
  RESET_FORGET_PASSWORD,
  SEND_FORGET_PASSWORD_OTP,
  UPDATE_PASSWORD,
  VERIFY_FORGET_PASSWORD_OTP,
} from '../../@core/common/apiRoutes';
import {
  ICoordinator,
  IUser,
} from '../../shared/Interface/userManagement.interface';

/**
 * @deprecated
 */
export const getAllUsers = async () => {
  try {
    let response: any = await apiGet(API_USERS);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 * @param userId
 */
export const getUser = async (userId: number) => {
  try {
    let response: any = await apiGet(API_USERS + '/' + userId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createUser = async (data: IUser) => {
  try {
    let response: any = await apiPost(API_USERS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateUser = async (userId: number, data: IUser) => {
  try {
    let response: any = await apiPut(API_USERS + '/' + userId, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createCoordinator = async (data: ICoordinator) => {
  try {
    let response: any = await apiPost(API_COORDINATORS, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateCoordinator = async (
  coordinatorUserId: number,
  data: ICoordinator,
) => {
  try {
    let response: any = await apiPut(
      API_COORDINATORS + '/' + coordinatorUserId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateProfile = async (userId: number, data: IUser) => {
  try {
    let response: any = await apiPost(
      API_USERS + '/' + userId + PROFILE_UPDATE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteUser = async (userId: number) => {
  try {
    let response: any = await apiDelete(API_USERS + '/' + userId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteCoordinatorItem = async (coordinatorUserId: number) => {
  try {
    let response: any = await apiDelete(
      API_COORDINATORS + '/' + coordinatorUserId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updatePassword = async (userId: number, data: any) => {
  try {
    let response: any = await apiPut(
      API_USERS + '/' + userId + UPDATE_PASSWORD,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const sendForgotPasswordOTP = async (data: any) => {
  try {
    let response: any = await apiPost(
      CORE_SERVICE_PATH + SEND_FORGET_PASSWORD_OTP,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const verifyForgotPasswordOtp = async (data: any) => {
  try {
    let response: any = await apiPost(
      CORE_SERVICE_PATH + VERIFY_FORGET_PASSWORD_OTP,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const resetPassword = async (data: any) => {
  try {
    let response: any = await apiPost(
      CORE_SERVICE_PATH + RESET_FORGET_PASSWORD,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
