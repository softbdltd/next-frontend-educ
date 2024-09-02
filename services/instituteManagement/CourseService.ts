import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {API_COURSES} from '../../@core/common/apiRoutes';
import {ICourse} from '../../shared/Interface/institute.interface';

export const getAllCourses = async (params = {}) => {
  try {
    let response: any = await apiGet(API_COURSES, {params});
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

/**
 * @deprecated
 */
export const getCourse = async (courseId: number) => {
  try {
    let response: any = await apiGet(API_COURSES + '/' + courseId);
    return response.data;
  } catch (catchBlockHandler) {}
};

export const createCourse = async (data: ICourse) => {
  try {
    let response: any = await apiPost(API_COURSES, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateCourse = async (courseId: number, data: ICourse) => {
  try {
    let response: any = await apiPut(API_COURSES + '/' + courseId, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const deleteCourse = async (courseId: number) => {
  try {
    let response: any = await apiDelete(API_COURSES + '/' + courseId);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
