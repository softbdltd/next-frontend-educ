import {apiGet, apiPost} from '../../@core/common/api';
import {
  API_TRAINING_CENTERS_REPORTING_COMBINED_PROGRESS,
  API_TRAINING_CENTERS_REPORTING_PROGRESS,
  API_TRAINING_CENTERS_REPORTING_INCOME_EXPENDITURE,
  API_SKILL_DEVELOPMENT_REPORT,
} from '../../@core/common/apiRoutes';
import {catchBlockHandler} from '../../@core/utilities/helpers';

export const trainingCenterCombinedProgressReportCreate = async (data: any) => {
  try {
    let response: any = await apiPost(
      API_TRAINING_CENTERS_REPORTING_COMBINED_PROGRESS,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const skillDevelopmentReportCreate = async (data: any) => {
  try {
    let response: any = await apiPost(API_SKILL_DEVELOPMENT_REPORT, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const trainingCenterProgressReportCreate = async (data: any) => {
  try {
    let response: any = await apiPost(
      API_TRAINING_CENTERS_REPORTING_PROGRESS,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getTrainingCenterProgressReport = async (ReportId: any) => {
  try {
    let response: any = await apiGet(
      API_TRAINING_CENTERS_REPORTING_PROGRESS + '/' + ReportId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const trainingCenterReportIncomeExpenditureCreate = async (
  data: any,
) => {
  try {
    let response: any = await apiPost(
      API_TRAINING_CENTERS_REPORTING_INCOME_EXPENDITURE,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
