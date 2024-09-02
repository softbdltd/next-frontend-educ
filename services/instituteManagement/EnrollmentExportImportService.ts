import {apiGet, apiPost} from '../../@core/common/api';
import {
  API_COURSE_ENROLLMENT_BULK_EXPORT_FORMAT,
  API_COURSE_ENROLLMENT_BULK_IMPORT_FORMAT,
  API_COURSE_ENROLLMENT_IMPORT,
} from '../../@core/common/apiRoutes';
import {catchBlockHandler} from '../../@core/utilities/helpers';

export const createEnrollmentImport = async (data: any) => {
  try {
    let response: any = await apiPost(API_COURSE_ENROLLMENT_IMPORT, data, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getEnrollmentFileFormat = async (
  course_id: any,
  batch_id: any,
) => {
  try {
    let response: any = await apiGet(
      API_COURSE_ENROLLMENT_BULK_IMPORT_FORMAT +
        '?course_id=' +
        course_id +
        '&batch_id=' +
        batch_id,
    );
    return response.data;
  } catch (catchBlockHandler) {}
};

export const getEnrollmentFileExportFormat = async (params: any = {}) => {
  try {
    let response: any = await apiGet(API_COURSE_ENROLLMENT_BULK_EXPORT_FORMAT, {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (catchBlockHandler) {}
};
