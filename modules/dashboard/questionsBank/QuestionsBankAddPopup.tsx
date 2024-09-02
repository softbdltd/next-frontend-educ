import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useFetchLocalizedSubjects} from '../../../services/instituteManagement/hooks';
import yup from '../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {createQuestionsBank} from '../../../services/instituteManagement/QuestionsBankService';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {Button, ButtonGroup, Grid} from '@mui/material';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IconQuestion from '../../../@core/icons/IconQuestion';
import {QuestionType} from './QuestionBanksEnums';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import CustomQuestionFieldArrayV1 from './CustomQuestionFieldArray';
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import RowStatus from '../../../@core/utilities/RowStatus';
import {AccessorType} from '../../../shared/constants/AccessorType';
import {useFetchLocalizedCoordinatorOrganizations} from '../../../services/organaizationManagement/hooks';
import {cloneDeep} from 'lodash';

interface IProps {
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  row_status: '1',
};

const QuestionsBankAddPopup = ({refreshDataTable, ...props}: IProps) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser<CommonAuthUser>();
  const [organizationId, setOrganizationId] = useState<any>(null);
  const [subjectFilters, setSubjectFilters] = useState<any>(null);

  // const [subjectFilters] = useState({});
  const {data: subjects, isLoading: isFetchingSubjects} =
    useFetchLocalizedSubjects(subjectFilters);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any>([1]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      questions: yup.array().of(
        yup.object().shape({
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
          option_1: yup
            .string()
            .label(messages['option.option1'] as string)
            .when('question_type', {
              is: (value: any) => value == QuestionType.MCQ,
              then: yup.string().required(),
            }),
          option_2: yup
            .string()
            .label(messages['option.option2'] as string)
            .when('question_type', {
              is: (value: any) => value == QuestionType.MCQ,
              then: yup.string().required(),
            }),
          option_3: yup
            .string()
            .label(messages['option.option3'] as string)
            .when('question_type', {
              is: (value: any) => value == QuestionType.MCQ,
              then: yup.string().required(),
            }),
          option_4: yup
            .string()
            .label(messages['option.option4'] as string)
            .when('question_type', {
              is: (value: any) => value == QuestionType.MCQ,
              then: yup.string().required(),
            }),
          answers: yup
            .array()
            .of(yup.mixed())
            .label(messages['question.answer'] as string)
            .when('question_type', {
              is: (value: any) => value == QuestionType.MCQ,
              then: yup.array().of(yup.mixed()).min(1).required(),
            }),
          answers1: yup
            .string()
            .label(messages['question.answer'] as string)
            .when('question_type', {
              is: (value: any) => value == QuestionType.YES_NO,
              then: yup.string().required(),
            }),
        }),
      ),
    });
  }, [messages, selectedType]);

  const {
    register,
    control,
    setError,
    handleSubmit,
    getValues,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const {data: organizations, isLoading: isOrganizationLoading} =
    useFetchLocalizedCoordinatorOrganizations(
      authUser?.isCoordinatorUser ? authUser?.userId : null,
    );

  useEffect(() => {
    if (!authUser?.isCoordinatorUser) {
      setSubjectFilters({
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [authUser]);

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

  console.log('error', errors);
  const onSubmit: SubmitHandler<any> = async (formdata: any) => {
    let data = cloneDeep(formdata);
    data?.questions?.map((item: any, idx: number) => {
      data.questions[idx].answers = item?.answers?.map((item: any) => item.id);
    });

    data?.questions?.map((item: any, idx: number) => {
      if (data?.questions[idx]?.answers1) {
        data.questions[idx].answers = [String(data?.questions[idx]?.answers1)];
        delete data?.questions[idx]?.answers1;
      }
    });

    if (authUser?.isCoordinatorUser) {
      data.accessor_type = AccessorType.ORGANIZATION;
    } else {
      delete data.accessor_type;
      delete data.accessor_id;
    }

    try {
      await createQuestionsBank(data);
      createSuccessMessage('question.label');

      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const addNewQuestion = useCallback(() => {
    setQuestions((prev: any) => [...prev, prev.length + 1]);
  }, []);

  const removeQuestion = useCallback(() => {
    let questionInfos = getValues('questions');

    let array = [...questions];
    if (questions.length > 1) {
      questionInfos.splice(questions.length - 1, 1);
      setValue('questions', questionInfos);
      array.splice(questions.length - 1, 1);
      setQuestions(array);
    }
  }, [questions]);

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      title={
        <>
          <IconQuestion />
          <IntlMessages
            id='common.add_new'
            values={{subject: <IntlMessages id='common.question' />}}
          />
        </>
      }
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
        </>
      }>
      <Grid container spacing={5}>
        {authUser?.isCoordinatorUser && (
          <Grid item xs={12} sm={6} md={6}>
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
        <Grid item xs={12} md={12}>
          {questions.map((question: any, index: number) => (
            <CustomQuestionFieldArrayV1
              id={`questions[${index}]`}
              key={index}
              isLoading={false}
              selectedTypeOnChange={setSelectedType}
              control={control}
              register={register}
              errors={errors}
              subjects={subjects}
              isFetchingSubjects={isFetchingSubjects}
              itemNum={index}
            />
          ))}
          <Grid
            item
            xs={12}
            display={'flex'}
            justifyContent='flex-end'
            marginTop={2}>
            <ButtonGroup
              color='primary'
              aria-label='outlined primary button group'>
              <Button onClick={addNewQuestion}>
                <AddCircleOutline />
              </Button>
              <Button onClick={removeQuestion} disabled={questions.length < 2}>
                <RemoveCircleOutline />
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormRowStatus
            id='row_status'
            control={control}
            defaultValue={initialValues.row_status}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default QuestionsBankAddPopup;
