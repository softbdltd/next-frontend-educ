import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  useFetchExamQuestionsBank,
  useFetchLocalizedSubjects,
} from '../../../services/instituteManagement/hooks';
import yup from '../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {Box, Grid} from '@mui/material';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IconQuestion from '../../../@core/icons/IconQuestion';
import {OPTIONS, QuestionType} from './QuestionBanksEnums';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {AnswerType} from '../rplQuestionBanks/QuestionEnums';
import {updateQuestionsBank} from '../../../services/instituteManagement/QuestionsBankService';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';
import _ from 'lodash';
import RowStatus from '../../../@core/utilities/RowStatus';
import {useFetchLocalizedCoordinatorOrganizations} from '../../../services/organaizationManagement/hooks';
import {AccessorType} from '../../../shared/constants/AccessorType';
import {useAuthUser} from '../../../@core/utility/AppHooks';

interface IProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title: '',
  title_en: '',
  subject_id: '',
  question_type: '',
  option_1: '',
  option_1_en: '',
  option_2: '',
  option_2_en: '',
  option_3: '',
  option_3_en: '',
  option_4: '',
  option_4_en: '',
  answers: [],
  answers1: [],
  row_status: '1',
};

const QuestionsBankEditPopup = ({
  itemId,
  refreshDataTable,
  ...props
}: IProps) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser();

  const {
    data: itemData,
    isLoading,
    mutate: mutateQuestionBank,
  } = useFetchExamQuestionsBank(itemId);

  const [organizationId, setOrganizationId] = useState<any>(null);
  const [subjectFilters, setSubjectFilters] = useState<any>(null);
  const {data: subjects, isLoading: isFetchingSubjects} =
    useFetchLocalizedSubjects(subjectFilters);

  const {data: organizations, isLoading: isOrganizationLoading} =
    useFetchLocalizedCoordinatorOrganizations(
      authUser?.isCoordinatorUser ? authUser?.userId : null,
    );

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const onChangeType = (value: any) => {
    setSelectedType(value ? String(value) : null);
  };

  const onOrganizationChange = useCallback(
    (value) => {
      if (value != organizationId) {
        setOrganizationId(value ?? null);
        setSubjectFilters(
          value
            ? {
                row_status: RowStatus.ACTIVE,
                accessor_type: AccessorType.ORGANIZATION,
                accessor_id: value,
              }
            : null,
        );
      }
    },
    [organizationId],
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .trim()
        .required()
        .label(messages['common.question'] as string),
      accessor_id: authUser?.isCoordinatorUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['common.industrial'] as string)
        : yup.string(),
      subject_id: yup
        .string()
        .required()
        .label(messages['subject.label'] as string),
      question_type: yup
        .string()
        .required()
        .label(messages['common.question_type'] as string),
      option_1:
        selectedType && String(selectedType) == QuestionType.MCQ
          ? yup
              .mixed()
              .required()
              .label(messages['option.option1'] as string)
          : yup.string().nullable(),
      option_2:
        selectedType && String(selectedType) == QuestionType.MCQ
          ? yup
              .mixed()
              .required()
              .label(messages['option.option2'] as string)
          : yup.string().nullable(),
      option_3:
        selectedType && String(selectedType) == QuestionType.MCQ
          ? yup
              .mixed()
              .required()
              .label(messages['option.option3'] as string)
          : yup.string().nullable(),
      option_4:
        selectedType && String(selectedType) == QuestionType.MCQ
          ? yup
              .mixed()
              .required()
              .label(messages['option.option4'] as string)
          : yup.string().nullable(),
      answers:
        selectedType && String(selectedType) == QuestionType.MCQ
          ? yup
              .array()
              .of(yup.mixed())
              .min(1)
              .required()
              .label(messages['question.answer'] as string)
          : yup.mixed(),
      answers1:
        selectedType && String(selectedType) == QuestionType.YES_NO
          ? yup
              .string()
              .required()
              .label(messages['question.answer'] as string)
          : yup.mixed(),
    });
  }, [messages, selectedType]);

  const {
    // register,
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      let data: any = {
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
        answers:
          itemData?.question_type == QuestionType.MCQ
            ? getAnswers(itemData?.answers)
            : [],
        answers1:
          itemData?.question_type == QuestionType.YES_NO && itemData?.answers
            ? itemData?.answers[0]
            : '',
        row_status: itemData?.row_status,
      };
      if (authUser?.isCoordinatorUser) {
        data.accessor_id = itemData?.accessor_id;
        setSubjectFilters({
          row_status: RowStatus.ACTIVE,
          accessor_type: AccessorType.ORGANIZATION,
          accessor_id: itemData?.accessor_id,
        });
      } else {
        setSubjectFilters({
          row_status: RowStatus.ACTIVE,
        });
      }

      setSelectedType(String(itemData?.question_type));

      reset(data);
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const getAnswers = (answerIds: any) => {
    return answerOptions.filter((answer: any) =>
      (answerIds || []).includes(answer.id),
    );
  };

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

  console.log('error', errors);
  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    let data = _.cloneDeep(formData);
    if (selectedType != QuestionType.MCQ) {
      data.option_1 = '';
      data.option_1_en = '';
      data.option_2 = '';
      data.option_2_en = '';
      data.option_3 = '';
      data.option_3_en = '';
      data.option_4 = '';
      data.option_4_en = '';
    }

    if (selectedType == QuestionType.MCQ && data.answers) {
      data.answers = data?.answers.map((ans: any) => String(ans.id));
    }

    if (selectedType == QuestionType.YES_NO && data.answers1) {
      data.answers = [String(data.answers1)];
    }

    if (selectedType == QuestionType.DESCRIPTIVE) {
      delete data.answers;
    }
    delete data.answers1;

    let questions: any = [];
    questions = [data];
    let finalData: any = {};
    finalData.questions = questions;

    if (authUser?.isCoordinatorUser) {
      finalData.accessor_type = AccessorType.ORGANIZATION;
      finalData.accessor_id = data.accessor_id;
    } else {
      delete finalData.accessor_type;
      delete finalData.accessor_id;
    }

    try {
      if (itemId) {
        await updateQuestionsBank(itemId, finalData);
        updateSuccessMessage('question.label');
        mutateQuestionBank();
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      title={
        <>
          <IconQuestion />
          <IntlMessages
            id='common.edit'
            values={{subject: <IntlMessages id='common.question' />}}
          />
        </>
      }
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
        </>
      }>
      <Grid container spacing={5}>
        {authUser?.isCoordinatorUser && (
          <Grid item xs={6}>
            <CustomFormSelect
              required
              id='accessor_id'
              label={messages['common.industrial']}
              isLoading={isOrganizationLoading}
              control={control}
              options={organizations}
              optionValueProp='id'
              optionTitleProp={['title']}
              errorInstance={errors}
              onChange={onOrganizationChange}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <CustomFilterableFormSelect
            required
            id={`subject_id`}
            label={messages['subject.label']}
            isLoading={isFetchingSubjects}
            control={control}
            options={subjects}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={6}>
          <CustomFormSelect
            required
            id={`question_type`}
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

        <Grid item xs={6}>
          <CustomTextInput
            required
            id={`title`}
            label={messages['common.question']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
          {selectedType == QuestionType.FILL_IN_THE_BLANK && (
            <Box
              sx={{
                fontStyle: 'italic',
                fontWeight: 'bold',
                marginTop: '6px',
                color: 'green',
              }}>
              Ex: This is [[fill in the blank]] question.(Ans will be in [[]]
              (double square brackets), and it will be blank in question.)
            </Box>
          )}
        </Grid>
        {selectedType != QuestionType.FILL_IN_THE_BLANK && (
          <Grid item xs={6}>
            <CustomTextInput
              id={`title_en`}
              label={messages['common.question_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
            />
          </Grid>
        )}

        {selectedType == QuestionType.MCQ && (
          <>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={`option_1`}
                label={messages['option.option1']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={`option_1_en`}
                label={messages['option.option1_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={`option_2`}
                label={messages['option.option2']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={`option_2_en`}
                label={messages['option.option2_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={`option_3`}
                label={messages['option.option3']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={`option_3_en`}
                label={messages['option.option3_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id={`option_4`}
                label={messages['option.option4']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={`option_4_en`}
                label={messages['option.option4_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
          </>
        )}

        {selectedType == QuestionType.MCQ && (
          <Grid item xs={6}>
            <CustomSelectAutoComplete
              id={`answers`}
              required={true}
              label={messages['question.answer']}
              isLoading={false}
              control={control}
              options={answerOptions}
              optionValueProp={'id'}
              optionTitleProp={['label']}
              errorInstance={errors}
              defaultValue={initialValues.answers}
            />
          </Grid>
        )}
        {selectedType == QuestionType.YES_NO && (
          <Grid item xs={6}>
            <CustomFilterableFormSelect
              id={`answers1`}
              required={true}
              label={messages['question.answer']}
              isLoading={false}
              control={control}
              options={yesNoOption}
              optionValueProp={'id'}
              optionTitleProp={['label']}
              errorInstance={errors}
              defaultValue={initialValues.answers1}
            />
          </Grid>
        )}

        <Grid item xs={6}>
          <FormRowStatus
            id='row_status'
            control={control}
            defaultValue={initialValues.row_status}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default QuestionsBankEditPopup;
