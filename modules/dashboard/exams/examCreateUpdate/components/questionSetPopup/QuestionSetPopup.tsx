import React, {useMemo, useState} from 'react';
import HookFormMuiModal from '../../../../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IconFAQ from '../../../../../../@core/icons/IconFAQ';
import IntlMessages from '../../../../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../../../../@core/utility/Utils';
import CancelButton from '../../../../../../@core/elements/button/CancelButton/CancelButton';
import {Grid, Typography} from '@mui/material';
import TransferQuestionList from './TransferQuestionList';
import SubmitButton from '../../../../../../@core/elements/button/SubmitButton/SubmitButton';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import yup from '../../../../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {QuestionSelectionType} from '../../../ExamEnums';
import {S2} from '../../../../../../@core/elements/common';
import useNotiStack from '../../../../../../@core/hooks/useNotifyStack';
import {getIntlNumber} from '../../../../../../@core/utilities/helpers';

interface IProps {
  questionType: any;
  onClose: () => void;
  subjectId: any;
  totalQuestions: number;
  totalMarks: number;
  selectionType: string;
  selectedQuestions: any;
  onQuestionsSubmitted: (data: any) => void;
}

const QuestionSetPopup = ({
  questionType,
  subjectId,
  totalQuestions,
  totalMarks,
  selectionType,
  onQuestionsSubmitted,
  selectedQuestions,
  ...props
}: IProps) => {
  const {messages, formatNumber} = useIntl();
  const {errorStack} = useNotiStack();

  const [isQuestionEditFormOpened, setIsQuestionEditFormOpened] =
    useState<boolean>(false);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      questions: yup
        .array()
        .of(yup.object({}))
        .min(
          totalQuestions,
          (
            <IntlMessages
              id={
                selectionType == QuestionSelectionType.FIXED
                  ? 'common.must_have_sub_question'
                  : 'common.more_than_sub_question'
              }
              values={{
                subject: (
                  <IntlMessages
                    id={String(getIntlNumber(formatNumber, totalQuestions))}
                  />
                ),
              }}
            />
          ) as unknown as string,
        )
        .test(
          'questions',
          (
            <IntlMessages
              id={
                selectionType == QuestionSelectionType.FIXED
                  ? 'common.not_more_than_sub_question'
                  : 'common.more_than_sub_question'
              }
              values={{
                subject: (
                  <IntlMessages
                    id={String(
                      getIntlNumber(
                        formatNumber,
                        selectionType == QuestionSelectionType.FIXED
                          ? totalQuestions
                          : totalQuestions,
                      ),
                    )}
                  />
                ),
              }}
            />
          ) as unknown as string,
          (value: any) => {
            return selectionType == QuestionSelectionType.FIXED
              ? value && value?.length <= totalQuestions
              : value && value?.length > totalQuestions;
          },
        )
        .label(messages['common.addQuestion'] as string),
    });
  }, [messages, totalQuestions, selectionType]);

  const {
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  console.log('erros->', errors);

  const onEditPopupOpenClose = (open: boolean) => {
    setIsQuestionEditFormOpened(open);
  };

  const getQuestionSet = (questionList: any) => {
    let questionsFormValues = questionList.map((question: any) => {
      return {
        id: question?.id,
        accessor_id: question?.accessor_id,
        accessor_type: question?.accessor_type,
        subject_id: question?.subject_id,
        title: question?.title,
        title_en: question?.title_en,
        question_type: question?.question_type,
        option_1: question?.option_1,
        option_1_en: question?.option_1_en,
        option_2: question?.option_2,
        option_2_en: question?.option_2_en,
        option_3: question?.option_3,
        option_3_en: question?.option_3_en,
        option_4: question?.option_4,
        option_4_en: question?.option_4_en,
        individual_marks: question?.individual_marks,
        answers: question?.answers,
        row_status: question?.row_status,
      };
    });

    setValue('questions', questionsFormValues);
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    if (!isQuestionEditFormOpened) {
      try {
        let totMark: number = 0;

        if (data.questions) {
          data.questions.map((question: any) => {
            totMark += Number(question?.individual_marks);
          });
        }

        if (
          String(selectionType) == QuestionSelectionType.FIXED &&
          totMark != totalMarks
        ) {
          errorStack(messages['common.total_mark_exceeded_warning']);
        } else {
          onQuestionsSubmitted(data);
          props.onClose();
        }
      } catch (error: any) {
        console.log('error->', error);
      }
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconFAQ />
          <IntlMessages
            id='common.add_new'
            values={{
              subject: <IntlMessages id='common.addQuestion' />,
            }}
          />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      actions={
        <>
          <CancelButton onClick={props.onClose} />
          <SubmitButton
            isSubmitting={isSubmitting}
            isLoading={false}
            type={'button'}
            onClick={() => handleSubmit(onSubmit)()}
          />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <S2>
            {selectionType == QuestionSelectionType.FIXED
              ? `${messages['question_set.select_only']} ${getIntlNumber(
                  formatNumber,
                  totalQuestions,
                )} ${messages['question_set.question_only']}`
              : `${messages['question_set.select_more']} ${getIntlNumber(
                  formatNumber,
                  totalQuestions,
                )} ${messages['question_set.question_more']}`}
          </S2>
          <S2 sx={{display: 'flex'}}>
            {messages['common.total_marks']}:{' '}
            <Typography sx={{color: 'green', marginLeft: '10px'}}>
              {getIntlNumber(formatNumber, totalMarks)}
            </Typography>
          </S2>
        </Grid>
        <Grid item xs={12}>
          <TransferQuestionList
            getQuestionSet={getQuestionSet}
            onEditPopupOpenClose={onEditPopupOpenClose}
            subjectId={subjectId}
            questionType={questionType}
            eachQuestionMark={Number((totalMarks / totalQuestions).toFixed(2))}
            selectedQuestions={selectedQuestions || []}
            selectionType={selectionType}
          />
        </Grid>
        {errors?.questions?.message && (
          <Grid item xs={12}>
            <Typography
              sx={{color: 'red', fontSize: '14px', fontWeight: '500'}}>
              {errors?.questions?.message}
            </Typography>
          </Grid>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default QuestionSetPopup;
