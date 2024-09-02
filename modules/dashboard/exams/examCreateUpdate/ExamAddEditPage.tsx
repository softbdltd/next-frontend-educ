import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import yup from '../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import PageBlock from '../../../../@core/utilities/PageBlock';
import IconExam from '../../../../@core/icons/IconExam';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import Grid from '@mui/material/Grid';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomFormSelect from '../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {ExamTypes, QuestionSelectionType} from '../ExamEnums';
import {Button} from '@mui/material';
import {
  useFetchExam,
  useFetchLocalizedSubjects,
} from '../../../../services/instituteManagement/hooks';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import RowStatus from '../../../../@core/utilities/RowStatus';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import FormRowStatus from '../../../../@core/elements/input/FormRowStatus/FormRowStatus';
import {
  createExam,
  updateExam,
} from '../../../../services/instituteManagement/ExamService';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import OnlineExam from './onlineExam';
import OffLineExam from './offLineExam';
import {ArrowBack} from '@mui/icons-material';
import {useRouter} from 'next/router';
import _, {cloneDeep} from 'lodash';
import {questionTypesArray} from '../../questionsBank/QuestionBanksEnums';
import CustomDateTimePicker from '../../../../@core/elements/input/CustomDateTimePicker';
import moment from 'moment';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {useFetchLocalizedCoordinatorOrganizations} from '../../../../services/organaizationManagement/hooks';
import {AccessorType} from '../../../../shared/constants/AccessorType';

interface ExamAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const ExamAddEditPage: FC<ExamAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser();

  const router = useRouter();
  const examId = Number(router.query.id);
  const {
    data: itemData,
    isLoading: isLoadingExam,
    mutate: mutateExam,
  } = useFetchExam(examId);

  const {data: organizations, isLoading: isOrganizationLoading} =
    useFetchLocalizedCoordinatorOrganizations(
      authUser?.isCoordinatorUser ? authUser?.userId : null,
    );

  const [subjectFilters, setSubjectFilters] = useState<any>(null);
  const {data: subjects, isLoading: isLoadingSubjects} =
    useFetchLocalizedSubjects(subjectFilters);

  const [examType, setExamType] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<any>(null);
  const [organizationId, setOrganizationId] = useState<any>(null);

  const examQuestionsSchema = (isOnline: boolean) => {
    return yup.array().of(
      yup.object().shape({
        is_question_checked: yup.boolean(),
        number_of_questions: yup
          .mixed()
          .label(messages['common.number_of_questions'] as string)
          .when('is_question_checked', {
            is: (value: any) => value,
            then: yup.string().required(),
          }),
        total_marks: yup
          .mixed()
          .label(messages['common.total_marks'] as string)
          .when('is_question_checked', {
            is: (value: any) => value,
            then: yup.string().required(),
          }),
        question_selection_type: yup
          .mixed()
          .label(messages['common.question_selection_type'] as string)
          .when('is_question_checked', {
            is: (value: any) => value,
            then: yup.string().required(),
          }),
        questions: isOnline
          ? yup
              .array()
              .of(yup.object())
              .label(messages['exam.no_question_selected'] as string)
              .when(['is_question_checked', 'question_selection_type'], {
                is: (values: any) => {
                  return (
                    values[0] &&
                    values[1] &&
                    values[1] !== QuestionSelectionType.RANDOM
                  );
                },
                then: yup.array().required(),
                otherwise: yup.array().nullable(),
              })
          : yup.array().of(yup.object()),
        question_sets: !isOnline
          ? yup
              .array()
              .of(
                yup.object().shape({
                  questions: yup
                    .array()
                    .of(yup.object())
                    .label(messages['exam.no_question_selected'] as string)
                    .required()
                    .min(1),
                }),
              )
              .label(messages['exam.no_question_selected'] as string)
              .when('question_selection_type', {
                is: (value: any) =>
                  value && value !== QuestionSelectionType.RANDOM,
                then: yup.array().required(),
              })
          : yup.array().of(yup.object()),
      }),
    );
  };

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .required()
        .label(messages['exam.label'] as string),
      title_en: yup
        .string()
        .title('en', false)
        .label(messages['exam.label'] as string),
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
      type: yup
        .string()
        .required()
        .label(messages['common.exam_type'] as string),
      total_marks:
        examType &&
        ![ExamTypes.ONLINE, ExamTypes.OFFLINE, ExamTypes.MIXED].includes(
          examType,
        )
          ? yup
              .string()
              .label(messages['common.marks'] as string)
              .required()
          : yup.string(),
      start_date:
        Number(examType) == ExamTypes.MIXED
          ? yup.string()
          : yup
              .string()
              .label(messages['common.exam_date'] as string)
              .test(
                'start_date',
                messages['common.start_date_greater_than_today'] as string,
                (value) => moment(value).isAfter(moment(), 'minutes'),
              )
              .required(),
      end_date:
        examType &&
        ![ExamTypes.ONLINE, ExamTypes.OFFLINE, ExamTypes.MIXED].includes(
          examType,
        )
          ? yup
              .string()
              .label(messages['common.end_date'] as string)
              .required()
          : yup.string(),
      duration:
        Number(examType) == ExamTypes.ONLINE ||
        Number(examType) == ExamTypes.OFFLINE
          ? yup
              .string()
              .label(messages['common.duration_min'] as string)
              .required()
              .test(
                'duration_min_validation',
                messages['exam.exam_duration_min'] as string,
                (value) => Boolean(Number(value) > 0),
              )
          : yup.mixed(),
      total_set:
        Number(examType) == ExamTypes.OFFLINE
          ? yup
              .mixed()
              .required()
              .label(messages['common.number_of_sets'] as string)
              .test(
                'total_set_validation',
                messages['common.number_of_sets_min_max'] as string,
                (value) => Boolean(Number(value) >= 1 && Number(value) <= 5),
              )
          : yup.string(),
      online:
        Number(examType) == ExamTypes.MIXED
          ? yup.object().shape({
              start_date: yup
                .string()
                .required()
                .test(
                  'start_date',
                  messages['common.start_date_greater_than_today'] as string,
                  (value) => moment(value).isAfter(moment(), 'minutes'),
                )
                .label(messages['common.exam_date'] as string),
              duration: yup
                .string()
                .required()
                .test(
                  'duration_min_validation',
                  messages['exam.exam_duration_min'] as string,
                  (value) => Boolean(Number(value) > 0),
                )
                .label(messages['common.duration_min'] as string),
              exam_questions: examQuestionsSchema(true),
            })
          : yup.object().shape({}),
      offline:
        Number(examType) == ExamTypes.MIXED
          ? yup.object().shape({
              start_date: yup
                .string()
                .required()
                .test(
                  'start_date',
                  messages['common.start_date_greater_than_today'] as string,
                  (value) => moment(value).isAfter(moment(), 'minutes'),
                )
                .label(messages['common.exam_date'] as string),
              duration: yup
                .string()
                .required()
                .test(
                  'duration_min_validation',
                  messages['exam.exam_duration_min'] as string,
                  (value) => Boolean(Number(value) > 0),
                )
                .label(messages['common.duration_min'] as string),
              total_set: yup
                .mixed()
                .required()
                .label(messages['common.number_of_sets'] as string)
                .test(
                  'total_set_validation',
                  messages['common.number_of_sets_min_max'] as string,
                  (value) => Boolean(Number(value) >= 1 && Number(value) <= 5),
                ),
              sets: yup.array().of(
                yup.object().shape({
                  title: yup
                    .string()
                    .required()
                    .label(messages['common.set_name'] as string),
                }),
              ),
              exam_questions: examQuestionsSchema(false),
            })
          : yup.object().shape({}),
      sets:
        Number(examType) == ExamTypes.OFFLINE
          ? yup.array().of(
              yup.object().shape({
                title: yup
                  .string()
                  .required()
                  .label(messages['common.set_name'] as string),
              }),
            )
          : yup.array(),
      exam_questions:
        Number(examType) == ExamTypes.MIXED
          ? yup.array().of(yup.object().shape({}))
          : examQuestionsSchema(Number(examType) == ExamTypes.ONLINE),
    });
  }, [messages, examType, authUser]);

  const {
    register,
    control,
    setError,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!authUser?.isCoordinatorUser) {
      setSubjectFilters({
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [authUser]);

  const setFormValues = (data: any, exam: any) => {
    data.start_date = exam?.start_date.replace(' ', 'T');
    data.duration = exam?.duration;

    if (exam?.type == ExamTypes.OFFLINE) {
      data.venue = exam?.venue;
      if (exam?.exam_sets) {
        data.total_set = exam.exam_sets.length;
        data.sets = exam.exam_sets.map((set: any) => {
          return {
            title: set?.title,
            title_en: set?.title_en,
            uuid: set?.uuid,
          };
        });
      }
    }

    let exam_questions: Array<any> = [];

    if (exam?.exam_sections) {
      questionTypesArray.map((type) => {
        let section = exam.exam_sections.find(
          (sec: any) => sec?.question_type == Number(type),
        );

        (section?.questions || []).map((qu: any) => {
          qu.id = qu.question_id;
        });

        let secQuestions: any = {
          is_question_checked: section != undefined,
          question_type: type,
          number_of_questions: section?.number_of_questions
            ? section?.number_of_questions
            : '',
          total_marks: section?.total_marks ? Number(section?.total_marks) : '',
          question_selection_type: section?.question_selection_type
            ? section?.question_selection_type
            : '',
          questions: section?.questions ? section?.questions : [],
        };

        if (exam?.type == ExamTypes.OFFLINE && section?.questions) {
          let grouped = _.mapValues(
            _.groupBy(section.questions, 'exam_set_uuid'),
          );
          let ques: any = [];
          Object.keys(grouped).map((key, i) => {
            ques.push({id: 'SET##' + (i + 1), questions: grouped[key]});
          });
          secQuestions.question_sets = ques;
        }

        exam_questions.push(secQuestions);
      });
    }

    data.exam_questions = exam_questions;
  };

  useEffect(() => {
    if (itemData) {
      let data: any = {
        title: itemData?.title,
        title_en: itemData?.title_en,
        subject_id: itemData?.subject_id,
        type: itemData?.type,
        row_status: itemData?.row_status,
      };

      if (authUser?.isCoordinatorUser) {
        data.accessor_id = itemData?.accessor_id;
        setSubjectFilters({
          row_status: RowStatus.ACTIVE,
          accessor_type: AccessorType.ORGANIZATION,
          accessor_id: itemData?.accessor_id,
        });
      }

      if (
        itemData &&
        itemData?.type != ExamTypes.ONLINE &&
        itemData?.type != ExamTypes.OFFLINE &&
        itemData?.type != ExamTypes.MIXED
      ) {
        data.total_marks = Number(itemData?.exams[0]?.total_marks).toFixed();
        data.end_date = itemData?.exams[0]?.end_date
          .replace(/T(\d\d):(\d\d):\d\d/, 'T$1:$2')
          .replace(' ', 'T');
      }

      if (itemData?.type != ExamTypes.MIXED) {
        setFormValues(data, itemData?.exams[0]);
      } else {
        if (Number(itemData?.exams[0]?.type) == ExamTypes.ONLINE) {
          data.online = {};
          data.offline = {};
          setFormValues(data.online, itemData?.exams[0]);
          setFormValues(data.offline, itemData?.exams[1]);
        } else {
          data.online = {};
          data.offline = {};
          setFormValues(data.online, itemData?.exams[1]);
          setFormValues(data.offline, itemData?.exams[0]);
        }
      }

      setExamType(itemData?.type);
      setSubjectId(itemData?.subject_id);

      reset(data);
    }
  }, [itemData]);

  const onChangeExamType = useCallback((value) => {
    setExamType(Number(value));
  }, []);

  const onOrganizationChange = useCallback(
    (value) => {
      if (value != organizationId) {
        setOrganizationId(value ?? null);
        setSubjectId(null);
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

  const onSubjectChange = useCallback((value) => {
    setSubjectId(value);
  }, []);

  console.log('error', errors);

  const getTotalCount = (questions: any) => {
    let count = 0;
    (questions || []).map((item: any) => {
      if (item?.total_marks && !isNaN(item?.total_marks)) {
        count += Number(item?.total_marks);
      }
    });
    return count;
  };

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    console.log('submitted data', formData);

    let data = cloneDeep(formData);

    if (examType == ExamTypes.ONLINE || examType == ExamTypes.OFFLINE) {
      delete data.online;
      delete data.offline;
      if (examType == ExamTypes.ONLINE) delete data.total_set;

      data.start_date =
        data.start_date
          .replace(/T(\d\d):(\d\d):\d\d/, 'T$1:$2')
          .replace('T', ' ') + ':00';
      delete data.end_date;

      let arr: any = data.exam_questions.filter(
        (item: any) => item.is_question_checked != false,
      );

      data.exam_questions = arr.map(({is_question_checked, ...rest}: any) => {
        if (
          String(rest.question_selection_type) == QuestionSelectionType.RANDOM
        ) {
          delete rest.questions;
          delete rest.question_sets;
        }
        if (examType == ExamTypes.OFFLINE) {
          delete rest.questions;
        }

        return rest;
      });
    } else if (examType == ExamTypes.MIXED) {
      delete data.start_date;
      delete data.end_date;
      delete data.duration;
      delete data.exam_questions;

      data.online.start_date =
        data.online.start_date
          .replace(/T(\d\d):(\d\d):\d\d/, 'T$1:$2')
          .replace('T', ' ') + ':00';

      data.offline.start_date =
        data.offline.start_date
          .replace(/T(\d\d):(\d\d):\d\d/, 'T$1:$2')
          .replace('T', ' ') + ':00';

      let arrOnline: any = data.online.exam_questions.filter(
        (item: any) => item.is_question_checked != false,
      );

      data.online.exam_questions = arrOnline.map(
        ({is_question_checked, ...rest}: any) => {
          if (
            String(rest.question_selection_type) == QuestionSelectionType.RANDOM
          ) {
            delete rest.questions;
          }
          return rest;
        },
      );

      let arrOffline: any = data.offline?.exam_questions.filter(
        (item: any) => item.is_question_checked != false,
      );

      data.offline.exam_questions = arrOffline.map(
        ({is_question_checked, ...rest}: any) => {
          delete rest.questions;
          if (
            String(rest.question_selection_type) == QuestionSelectionType.RANDOM
          ) {
            delete rest.question_sets;
          }
          return rest;
        },
      );
    } else {
      delete data.exam_questions;
      delete data.online;
      delete data.offline;

      data.start_date =
        data.start_date
          .replace(/T(\d\d):(\d\d):\d\d/, 'T$1:$2')
          .replace('T', ' ') + ':00';
      data.end_date =
        data.end_date
          .replace(/T(\d\d):(\d\d):\d\d/, 'T$1:$2')
          .replace('T', ' ') + ':00';
    }

    if (examType == ExamTypes.ONLINE || examType == ExamTypes.OFFLINE) {
      data.total_marks = getTotalCount(data.exam_questions);
    } else if (examType == ExamTypes.MIXED) {
      data.online.total_marks = getTotalCount(data.online.exam_questions);
      data.offline.total_marks = getTotalCount(data.offline.exam_questions);
    }

    if (examId && examType == ExamTypes.MIXED) {
      if (itemData.exams[0].type == ExamTypes.ONLINE) {
        data.online.exam_id = itemData.exams[0].id;
        data.offline.exam_id = itemData.exams[1].id;
      } else if (itemData.exams[0].type == ExamTypes.OFFLINE) {
        data.online.exam_id = itemData.exams[1].id;
        data.offline.exam_id = itemData.exams[0].id;
      }
    } else if (examId) {
      data.exam_id = itemData.exams[0].id;
    }

    if (authUser?.isCoordinatorUser) {
      data.accessor_type = AccessorType.ORGANIZATION;
    } else {
      delete data.accessor_type;
      delete data.accessor_id;
    }

    try {
      if (examId) {
        await updateExam(examId, data);
        updateSuccessMessage('exam.label');
        mutateExam();
      } else {
        await createExam(data);
        createSuccessMessage('exam.label');
      }
      router.back();
    } catch (error: any) {
      console.log('api error->', error);
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const examTypes = useMemo(
    () => [
      {
        id: ExamTypes.ONLINE,
        label: messages['common.online'],
      },
      {
        id: ExamTypes.OFFLINE,
        label: messages['common.offline'],
      },
      {
        id: ExamTypes.MIXED,
        label: messages['common.mixed'],
      },
      {
        id: ExamTypes.PRACTICAL,
        label: messages['common.practical'],
      },
      {
        id: ExamTypes.FIELDWORK,
        label: messages['common.field_work'],
      },
      {
        id: ExamTypes.PRESENTATION,
        label: messages['common.presentation'],
      },
      {
        id: ExamTypes.ASSIGNMENT,
        label: messages['common.assignment'],
      },
    ],
    [messages],
  );

  return (
    <>
      <PageBlock
        title={
          <>
            <IconExam />
            {examId ? (
              <IntlMessages
                id='common.edit'
                values={{subject: <IntlMessages id='exam.label' />}}
              />
            ) : (
              <IntlMessages
                id='common.add_new'
                values={{subject: <IntlMessages id='exam.label' />}}
              />
            )}
          </>
        }
        extra={[
          <Button
            key={1}
            variant={'contained'}
            color={'primary'}
            size={'small'}
            onClick={() => router.back()}>
            <ArrowBack />
            {messages['common.back']}
          </Button>,
        ]}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id={'title'}
                label={messages['common.title']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputLabelProps={
                  !isNaN(examId)
                    ? {
                        shrink: true,
                      }
                    : {}
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'title_en'}
                label={messages['common.title_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputLabelProps={
                  !isNaN(examId)
                    ? {
                        shrink: true,
                      }
                    : {}
                }
              />
            </Grid>
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
                id={'subject_id'}
                label={messages['subject.label']}
                isLoading={isLoadingSubjects}
                control={control}
                options={subjects}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={onSubjectChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormSelect
                required
                id={'type'}
                label={messages['common.exam_type']}
                isLoading={false}
                control={control}
                options={examTypes}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
                onChange={onChangeExamType}
              />
            </Grid>

            {examType &&
            ![ExamTypes.ONLINE, ExamTypes.OFFLINE, ExamTypes.MIXED].includes(
              examType,
            ) ? (
              <>
                <Grid item xs={6}>
                  <CustomDateTimePicker
                    required
                    id={'start_date'}
                    label={messages['common.start_date']}
                    register={register}
                    errorInstance={errors}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomDateTimePicker
                    required
                    id={'end_date'}
                    label={messages['common.end_date']}
                    register={register}
                    errorInstance={errors}
                  />
                </Grid>

                <Grid item xs={6}>
                  <CustomTextInput
                    required
                    id={'total_marks'}
                    label={messages['common.marks']}
                    control={control}
                    errorInstance={errors}
                    InputLabelProps={
                      !isNaN(examId)
                        ? {
                            shrink: true,
                          }
                        : {}
                    }
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

            {(examType == ExamTypes.ONLINE || examType == ExamTypes.MIXED) &&
              subjectId && (
                <Grid item xs={12}>
                  <OnlineExam
                    useFrom={{register, errors, control, setValue, getValues}}
                    examType={examType}
                    subjectId={subjectId}
                  />
                </Grid>
              )}

            {(examType == ExamTypes.OFFLINE || examType == ExamTypes.MIXED) &&
              subjectId && (
                <Grid item xs={12}>
                  <OffLineExam
                    useFrom={{register, errors, control, setValue, getValues}}
                    examType={examType}
                    subjectId={subjectId}
                  />
                </Grid>
              )}

            <Grid item xs={6}>
              <FormRowStatus
                id='row_status'
                control={control}
                defaultValue={RowStatus.ACTIVE}
                isLoading={isLoadingExam}
              />
            </Grid>
          </Grid>

          <Button
            sx={{marginTop: 3}}
            disabled={isSubmitting}
            type={'submit'}
            variant={'contained'}
            color={'primary'}>
            {messages['common.submit']}
          </Button>
        </form>
      </PageBlock>
    </>
  );
};

export default ExamAddEditPage;
