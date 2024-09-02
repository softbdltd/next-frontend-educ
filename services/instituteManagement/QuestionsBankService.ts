import {apiDelete, apiGet, apiPost, apiPut} from '../../@core/common/api';
import {
  API_EXAM_QUESTION_BANK,
  API_EXAM_QUESTION_BULK_IMPORT,
  API_EXAM_QUESTION_IMPORT_FILE_FORMAT,
} from '../../@core/common/apiRoutes';
import {catchBlockHandler} from '../../@core/utilities/helpers';

export const deleteQuestionsBank = async (questionsBankId: number) => {
  try {
    let response: any = await apiDelete(
      API_EXAM_QUESTION_BANK + '/' + questionsBankId,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const updateQuestionsBank = async (
  questionsBankId: number | null,
  data: any,
) => {
  try {
    let response: any = await apiPut(
      API_EXAM_QUESTION_BANK + '/' + questionsBankId,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const createQuestionsBank = async (data: any) => {
  try {
    let response: any = await apiPost(API_EXAM_QUESTION_BANK, data);
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getQuestionFileFormat = async () => {
  try {
    let response: any = await apiGet(API_EXAM_QUESTION_IMPORT_FILE_FORMAT);
    return response.data;
  } catch (catchBlockHandler) {}
};

export const createQuestionImport = async (data: any) => {
  try {
    let response: any = await apiPost(API_EXAM_QUESTION_BULK_IMPORT, data, {
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
