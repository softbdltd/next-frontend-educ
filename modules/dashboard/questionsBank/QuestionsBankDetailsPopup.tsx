import {useIntl} from 'react-intl';
import {useFetchExamQuestionsBank} from '../../../services/instituteManagement/hooks';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IconFAQ from '../../../@core/icons/IconFAQ';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import React, {useContext} from 'react';
import {OPTIONS, QuestionType} from './QuestionBanksEnums';
import {AnswerType} from '../rplQuestionBanks/QuestionEnums';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

interface IProps {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
}

const QuestionsBankDetailsPopup = ({
  itemId,
  openEditModal,
  ...props
}: IProps) => {
  const {messages} = useIntl();

  const {data: itemData, isLoading} = useFetchExamQuestionsBank(itemId);
  const {exam_question_bank: exam_question_bank_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const questionType = (data: any) => {
    switch (String(data)) {
      case QuestionType.MCQ:
        return messages['question.type.mcq'];
      case QuestionType.FILL_IN_THE_BLANK:
        return messages['common.fill_in_the_blanks'];
      case QuestionType.YES_NO:
        return messages['question.type.y_n'];
      case QuestionType.DESCRIPTIVE:
        return messages['common.descriptive'];
      default:
        return '';
    }
  };

  const yesNoAnswerOption = (data: any) => {
    switch (data) {
      case AnswerType.YES:
        return messages['answer.type.yes'];
      case AnswerType.NO:
        return messages['answer.type.no'];
      default:
        return '';
    }
  };

  const mcqAnswerOption = (data: any) => {
    switch (data) {
      case OPTIONS.OPTION_1:
        return messages['option.option1'];
      case OPTIONS.OPTION_2:
        return messages['option.option2'];
      case OPTIONS.OPTION_3:
        return messages['option.option3'];
      case OPTIONS.OPTION_4:
        return messages['option.option4'];
      default:
        return '';
    }
  };

  return (
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        title={
          <>
            <IconFAQ />
            <IntlMessages id='question-bank.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={false} />
            {exam_question_bank_permissions.canUpdate && (
              <EditButton
                variant={'contained'}
                onClick={() => openEditModal(itemData?.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['subject.label']}
              value={itemData?.exam_subject_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['question.type']}
              value={questionType(itemData?.question_type)}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.question']}
              value={itemData?.title}
              isLoading={isLoading}
            />
          </Grid>
          {itemData?.question_type != QuestionType.FILL_IN_THE_BLANK && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['common.question_en']}
                value={itemData?.title_en}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {itemData && QuestionType.MCQ == itemData?.question_type && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option1']}
                  value={itemData?.option_1}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option1_en']}
                  value={itemData?.option_1_en}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option2']}
                  value={itemData?.option_2}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option2_en']}
                  value={itemData?.option_2_en}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option3']}
                  value={itemData?.option_3}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option3_en']}
                  value={itemData?.option_3_en}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option4']}
                  value={itemData?.option_4}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['option.option4_en']}
                  value={itemData?.option_4_en}
                  isLoading={isLoading}
                />
              </Grid>
            </>
          )}
          {(QuestionType.MCQ == itemData?.question_type ||
            QuestionType.YES_NO == itemData?.question_type) && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['question.answer']}
                value={
                  QuestionType.MCQ == itemData?.question_type
                    ? (itemData?.answers || [])
                        .map((ans: any) => mcqAnswerOption(ans))
                        .join(', ')
                    : yesNoAnswerOption(itemData?.answers[0] || [])
                }
                isLoading={isLoading}
              />
            </Grid>
          )}
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default QuestionsBankDetailsPopup;
