import {Box, Grid} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  AnswerType,
  OPTIONS,
  QuestionType,
} from '../../../../questionsBank/QuestionBanksEnums';
import {useIntl} from 'react-intl';
import useSuccessMessage from '../../../../../../@core/hooks/useSuccessMessage';
import yup from '../../../../../../@core/libs/yup';
import HookFormMuiModal from '../../../../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import {isBreakPointUp} from '../../../../../../@core/utility/Utils';
import IntlMessages from '../../../../../../@core/utility/IntlMessages';
import CancelButton from '../../../../../../@core/elements/button/CancelButton/CancelButton';
import CustomTextInput from '../../../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomFormSelect from '../../../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import SubmitButton from '../../../../../../@core/elements/button/SubmitButton/SubmitButton';
import {QuestionSelectionType} from '../../../ExamEnums';

interface QuestionEditPopupProps {
  itemData: any;
  onClose: () => void;
  getEditedQuestion: (data: any) => void;
  selectionType: any;
}

const QuestionEditPopup: FC<QuestionEditPopupProps> = ({
  itemData,
  getEditedQuestion,
  selectionType,
  ...props
}) => {
  const {messages} = useIntl();
  const {updateSuccessMessage} = useSuccessMessage();

  const [isMCQ, setIsMCQ] = useState<boolean>(false);
  const [isYesNo, setIsYesNo] = useState<boolean>(false);
  const [isFillInBlank, setIsFillInBlank] = useState<boolean>(false);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .trim()
        .required()
        .label(messages['common.question'] as string),
      subject_id: yup
        .string()
        .required()
        .label(messages['subject.label'] as string),
      question_type: yup
        .string()
        .required()
        .label(messages['common.question_type'] as string),
      individual_marks: yup
        .string()
        .required()
        .label(messages['common.marks'] as string),
      option_1: isMCQ
        ? yup
            .string()
            .required()
            .label(messages['option.option1'] as string)
        : yup.string().nullable(),
      option_2: isMCQ
        ? yup
            .string()
            .required()
            .label(messages['option.option2'] as string)
        : yup.string().nullable(),
      option_3: isMCQ
        ? yup
            .string()
            .required()
            .label(messages['option.option3'] as string)
        : yup.string().nullable(),
      option_4: isMCQ
        ? yup
            .string()
            .required()
            .label(messages['option.option4'] as string)
        : yup.string().nullable(),
      answers: isMCQ
        ? yup
            .array()
            .of(yup.mixed())
            .min(1)
            .label(messages['question.answer'] as string)
        : isYesNo
        ? yup
            .string()
            .required()
            .label(messages['option.answer'] as string)
        : yup.mixed(),
    });
  }, [messages, isMCQ, isYesNo]);

  const questionTypes = useMemo(
    () => [
      {
        key: QuestionType.MCQ,
        label: messages['question.type.mcq'],
      },
      {
        key: QuestionType.FILL_IN_THE_BLANK,
        label: messages['common.fill_in_the_blanks'],
      },
      {
        key: QuestionType.YES_NO,
        label: messages['question.type.y_n'],
      },
      {
        key: QuestionType.DESCRIPTIVE,
        label: messages['common.descriptive'],
      },
    ],
    [messages],
  );

  const answerOptions = useMemo(
    () => [
      {
        id: OPTIONS.OPTION_1,
        label: messages['option.option1'],
      },
      {
        id: OPTIONS.OPTION_2,
        label: messages['option.option2'],
      },
      {
        id: OPTIONS.OPTION_3,
        label: messages['option.option3'],
      },
      {
        id: OPTIONS.OPTION_4,
        label: messages['option.option4'],
      },
    ],
    [messages],
  );

  const yesNoOption = useMemo(
    () => [
      {
        id: AnswerType.YES,
        label: messages['answer.type.yes'],
      },
      {
        id: AnswerType.NO,
        label: messages['answer.type.no'],
      },
    ],
    [messages],
  );

  const {
    // register,
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    let data: any = {
      id: itemData?.id,
      accessor_id: itemData?.accessor_id,
      accessor_type: itemData?.accessor_type,
      subject_id: itemData?.subject_id,
      title: itemData?.title,
      title_en: itemData?.title_en,
      question_type: itemData?.question_type,
      option_1: itemData?.option_1,
      option_1_en: itemData?.option_1_en,
      option_2: itemData?.option_2,
      option_2_en: itemData?.option_2_en,
      option_3: itemData?.option_3,
      option_3_en: itemData?.option_3_en,
      option_4: itemData?.option_4,
      option_4_en: itemData?.option_4_en,
      individual_marks: itemData?.individual_marks,
      answers:
        String(itemData?.question_type) == QuestionType.YES_NO &&
        itemData?.answers
          ? itemData?.answers[0]
          : itemData?.answers,
      row_status: itemData?.row_status,
    };
    setIsMCQ(String(itemData?.question_type) == QuestionType.MCQ);
    setIsFillInBlank(
      String(itemData?.question_type) == QuestionType.FILL_IN_THE_BLANK,
    );
    setIsYesNo(String(itemData?.question_type) == QuestionType.YES_NO);

    reset(data);
  }, [itemData]);

  const onChangeType = (value: any) => {
    setIsMCQ(String(value) == QuestionType.MCQ);
    setIsFillInBlank(String(value) == QuestionType.FILL_IN_THE_BLANK);
    setIsYesNo(String(value) == QuestionType.YES_NO);
  };

  useEffect(() => {
    if (itemData && itemData.question_type == QuestionType.MCQ) {
      setIsMCQ(String(itemData.question_type) == QuestionType.MCQ);
    }
    if (itemData && itemData.question_type == QuestionType.FILL_IN_THE_BLANK) {
      setIsFillInBlank(
        String(itemData.question_type) == QuestionType.FILL_IN_THE_BLANK,
      );
    }
    if (itemData && itemData.question_type == QuestionType.YES_NO) {
      setIsYesNo(String(itemData.question_type) == QuestionType.YES_NO);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    if (!isMCQ) {
      data.option_1 = '';
      data.option_1_en = '';
      data.option_2 = '';
      data.option_2_en = '';
      data.option_3 = '';
      data.option_3_en = '';
      data.option_4 = '';
      data.option_4_en = '';
    }

    if (isYesNo && data.answers) {
      data.answers = [String(data.answers)];
    }

    if (isMCQ && data && data.answers) {
      data.answers = data?.answers.map((ans: any) => String(ans));
    }

    try {
      getEditedQuestion(data);
      updateSuccessMessage('question-bank.label');
      props.onClose();
    } catch (error: any) {}
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      title={
        <IntlMessages
          id='common.edit'
          values={{subject: <IntlMessages id='question-bank.label' />}}
        />
      }
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton
            isSubmitting={isSubmitting}
            isLoading={false}
            type={'button'}
            onClick={() => handleSubmit(onSubmit)()}
          />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <CustomTextInput
            required
            id={'title'}
            label={messages['common.question']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
          {isFillInBlank && (
            <Box
              sx={{fontStyle: 'italic', fontWeight: 'bold', marginTop: '6px'}}>
              Ex: This is [[fill in the blank]] question.(Ans will be in [[]],
              and it will be blank in question.)
            </Box>
          )}
        </Grid>

        <Grid item xs={6}>
          <CustomTextInput
            id={'title_en'}
            label={messages['common.question_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomFormSelect
            required
            id='question_type'
            label={messages['question.type']}
            isLoading={false}
            control={control}
            options={questionTypes}
            optionValueProp='key'
            optionTitleProp={['label']}
            errorInstance={errors}
            onChange={onChangeType}
          />
        </Grid>

        <Grid
          item
          xs={6}
          sx={
            selectionType != QuestionSelectionType.FIXED
              ? {display: 'none'}
              : {}
          }>
          <CustomTextInput
            required
            id={'individual_marks'}
            label={messages['common.marks']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>

        {isMCQ && (
          <>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={'option_1'}
                label={messages['option.option1']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'option_1_en'}
                label={messages['option.option1_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={'option_2'}
                label={messages['option.option2']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'option_2_en'}
                label={messages['option.option2_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={'option_3'}
                label={messages['option.option3']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'option_3_en'}
                label={messages['option.option3_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={'option_4'}
                label={messages['option.option4']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'option_4_en'}
                label={messages['option.option4_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
          </>
        )}

        {(isMCQ || isYesNo) && (
          <Grid item xs={6}>
            <CustomFormSelect
              id='answers'
              required={true}
              label={messages['question.answer']}
              isLoading={false}
              control={control}
              options={isMCQ ? answerOptions : yesNoOption}
              optionValueProp={'id'}
              optionTitleProp={['label']}
              errorInstance={errors}
              multiple={isMCQ}
            />
          </Grid>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default QuestionEditPopup;
