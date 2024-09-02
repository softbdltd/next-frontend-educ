import {apiGet, apiPost, apiPut} from '../../@core/common/api';
import {
  API_ASSESSMENT_PAYMENT_PAY,
  API_COURSE_ENROLL,
  API_COURSE_ENROLL_PAYMENT_PAY,
  API_LEARNER_CV,
  API_CV_BANK_BULK_EXPORT,
  API_LEARNER_FREELANCE_PROFILE_STATUS_UPDATE,
  API_LEARNER_JOB_APPLICATION_INFORMATION_UPDATE,
  API_LEARNER_PERSONAL_INFO_UPDATE,
  API_LEARNER_PROFILE,
  API_LEARNER_PROFILES,
  API_LEARNER_UPDATE_DEFAULT_CV_TEMPLATE,
  API_LEARNER_UPDATE_PASSWORD,
  COURSE_ENROLL_RESEND_VERIFICATION,
  COURSE_ENROLL_VERIFICATION,
  API_LEARNER_NID_BRN_VERIFICATION,
  API_LEARNER_SUBSCRIPTION,
  API_LEARNER_NURSING_PROFILE_STATUS_UPDATE,
  API_BATCH_BULK_EXPORT,
} from '../../@core/common/apiRoutes';
import {catchBlockHandler} from '../../@core/utilities/helpers';
import {IVerifyYouthNidBrn, YouthPersonalInfo} from './typing';

export const getYouthProfile = async () => {
  try {
    let response: any = await apiGet(API_LEARNER_PROFILE, {});
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
export const learnerProfileShowInCV = async (params: any) => {
  try {
    let response: any = await apiPost(API_LEARNER_CV, params);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getYouthProfiles = async (params: any) => {
  try {
    let response: any = await apiPost(API_LEARNER_PROFILES, params);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateYouthPersonalInfo = async (data: YouthPersonalInfo) => {
  try {
    let response: any = await apiPut(API_LEARNER_PERSONAL_INFO_UPDATE, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const verifyYouthNidBrn = async (data: IVerifyYouthNidBrn) => {
  try {
    let response: any = await apiPost(API_LEARNER_NID_BRN_VERIFICATION, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateJobApplicationInfo = async (data: any) => {
  try {
    let response: any = await apiPut(
      API_LEARNER_JOB_APPLICATION_INFORMATION_UPDATE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateYouthFreelanceProfileStatus = async (data: any) => {
  try {
    let response: any = await apiPut(
      API_LEARNER_FREELANCE_PROFILE_STATUS_UPDATE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateYouthNursingStatus = async (data: any) => {
  try {
    let response: any = await apiPost(
      API_LEARNER_NURSING_PROFILE_STATUS_UPDATE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const courseEnroll = async (data: any) => {
  try {
    let response: any = await apiPost(API_COURSE_ENROLL, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const courseEnrollmentVerification = async (
  enrollment_id: number,
  data: any,
) => {
  try {
    let response: any = await apiPost(
      API_COURSE_ENROLL + '/' + enrollment_id + COURSE_ENROLL_VERIFICATION,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const courseEnrollmentResendVerificationCode = async (
  enrollment_id: number,
) => {
  try {
    let response: any = await apiPost(
      API_COURSE_ENROLL +
        '/' +
        enrollment_id +
        COURSE_ENROLL_RESEND_VERIFICATION,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const courseEnrollmentPaymentPay = async (data: any) => {
  try {
    let response: any = await apiPost(API_COURSE_ENROLL_PAYMENT_PAY, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const assessmentPaymentPay = async (data: any) => {
  try {
    let response: any = await apiPost(API_ASSESSMENT_PAYMENT_PAY, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateYouthDefaultCVTemplate = async (data: any) => {
  try {
    let response: any = await apiPut(
      API_LEARNER_UPDATE_DEFAULT_CV_TEMPLATE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateYouthPassword = async (data: any) => {
  try {
    let response: any = await apiPut(API_LEARNER_UPDATE_PASSWORD, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getCVBankFileExport = async (params: any = {}) => {
  try {
    let response: any = await apiGet(API_CV_BANK_BULK_EXPORT, {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (catchBlockHandler) {}
};

export const getBatchFileExport = async (params: any = {}, batchId: any) => {
  try {
    let response: any = await apiGet(API_BATCH_BULK_EXPORT + '/' + batchId, {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (catchBlockHandler) {}
};

export const learnerSubscribe = async (data: any) => {
  try {
    let response: any = await apiPost(API_LEARNER_SUBSCRIPTION, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
