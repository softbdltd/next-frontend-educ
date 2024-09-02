import React, {useEffect, useMemo, useState} from 'react';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import {Box, Button, Grid, Paper} from '@mui/material';
import {Body1, Body2, H4, H5, S1, S2} from '../../../@core/elements/common';
import {useIntl} from 'react-intl';
import {SubmitHandler, useForm} from 'react-hook-form';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import yup from '../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  getIntlNumber,
  getTimer,
  question_type,
} from '../../../@core/utilities/helpers';
import {useFetchExamQuestionPaper} from '../../../services/instituteManagement/hooks';
import {useRouter} from 'next/router';
import {QuestionType} from '../../dashboard/questionsBank/QuestionBanksEnums';
import QuestionTitleHeader from './QuestionTitleHeader';
import QuestionSkeleton from './QuestionSkeleton';
import MCQTypeQuestion from './MCQTypeQuestion';
import moment from 'moment';
import {submitExamPaper} from '../../../services/instituteManagement/ExamService';
import HiddenInput from './HiddenInput';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {cloneDeep} from 'lodash';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {
  LINK_FRONTEND_LEARNER_MY_APPRENTICESHIPS_DETAILS,
  LINK_FRONTEND_LEARNER_MY_COURSES,
} from '../../../@core/common/appLinks';

const ExamQuestionPaper = () => {
  let questionIndex = 1;
  let answerIndex = 0;
  const {messages, formatDate, formatNumber} = useIntl();
  const router = useRouter();
  const authUser = useAuthUser();
  const {errorStack} = useNotiStack();
  const [timer, setTimer] = useState<string | null>('');
  const [submitDisable, setSubmitDisable] = useState<boolean>(false);
  const [hasExamStarted, setHasExamStarted] = useState(false);
  const [hasExamEnded, setHasExamEnded] = useState(false);
  const [examQuestionFilter, setExamQuestionFilter] = useState<any>(null);
  const {examId} = router.query;
  const {submissionSuccessMessage} = useSuccessMessage();
  const {data: examQuestions} = useFetchExamQuestionPaper(examQuestionFilter);

  const [examQuestionData, setExamQuestionData] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);

  const validationSchema: any = useMemo(() => {
    return yup.object().shape({});
  }, []);

  const {
    register,
    control,
    setError,
    getValues,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  useEffect(() => {
    try {
      let storedQuestions = localStorage.getItem('questionPaper');
      if (storedQuestions) {
        setExamQuestionData(JSON.parse(storedQuestions));

        let storedAnswers = localStorage.getItem('questionAnswers');
        if (storedAnswers) {
          reset(JSON.parse(storedAnswers));
        }
      } else {
        setExamQuestionFilter(examId);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (examQuestions) {
      localStorage.setItem('questionPaper', JSON.stringify(examQuestions));
      setExamQuestionData(examQuestions);
    }
  }, [examQuestions]);

  useEffect(() => {
    let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    if (examQuestionData) {
      let examDate = examQuestionData?.start_date;

      let duration = moment.duration(
        moment(currentDate).diff(moment(examDate)),
      );
      let minutes = Number(duration.asMinutes());

      if (minutes > examQuestionData?.duration) {
        setHasExamEnded(true);
        clearLocalStorage();
      } else if (minutes < 0) {
        clearLocalStorage();
      } else {
        setHasExamStarted(true);
        initTimer(currentDate, examDate, examQuestionData?.duration);
      }
      setLoadingQuestions(false);
    }
  }, [examQuestionData]);

  const initTimer = (
    currentDate: string,
    examDate: string,
    examDuration: number,
  ) => {
    let duration = moment.duration(moment(currentDate).diff(moment(examDate)));
    let seconds = Number(duration.asSeconds());

    let examDurationInSecond = Number(examDuration) * 60;
    let remSecInMillis = (examDurationInSecond - seconds) * 1000;
    let expireTime = new Date().getTime() + remSecInMillis;
    const interval = setInterval(() => {
      let remainingTime = getTimer(expireTime);
      setTimer(remainingTime.timer);
      if (remainingTime.clearInterval) {
        clearInterval(interval);
        setSubmitDisable(true);
      }
    }, 1000);
  };

  useEffect(() => {
    window.onbeforeunload = function (event) {
      localStorage.setItem('questionAnswers', JSON.stringify(getValues()));
    };
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('questionPaper');
    localStorage.removeItem('questionAnswers');
    localStorage.removeItem('batchId');
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      console.log('data: ', data);
      let formData = cloneDeep(data);
      if (authUser && authUser?.isYouthUser) {
        formData.learner_id = authUser?.learnerId;
      }
      formData.exam_id = examId;
      let batchId = localStorage.getItem('batchId');
      let apprenticeshipId = localStorage.getItem('apprenticeshipId');
      formData.batch_id = batchId;

      if (formData.questions) {
        formData.questions.map((question: any) => {
          question.individual_marks = Number(question.individual_marks);
          if (question.answers) {
            if (String(question.question_type) == QuestionType.MCQ) {
              question.answers.map((answer: any, index: number) => {
                if (answer) {
                  question.answers[index] = String(index + 1);
                } else {
                  question.answers[index] = String(0);
                }
              });
              question.answers = question.answers.filter(
                (ans: any) => ans != '0',
              );
            }
          }
        });
      }

      await submitExamPaper(formData);
      await clearLocalStorage();
      submissionSuccessMessage('common.answer_sheet');
      setHasExamEnded(true);
      if (apprenticeshipId) {
        router
          .push(
            `${LINK_FRONTEND_LEARNER_MY_APPRENTICESHIPS_DETAILS}/${apprenticeshipId}`,
          )
          .then((r) => {});
      } else {
        router.push(LINK_FRONTEND_LEARNER_MY_COURSES).then((r) => {});
      }
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Paper
      sx={{
        padding: '25px',
        margin: '30px',
        boxShadow: '1px 1px 5px 2px #7b6a6a1f',
      }}>
      <Grid container spacing={2}>
        {loadingQuestions ? (
          <QuestionSkeleton />
        ) : hasExamEnded ? (
          <Grid item xs={12}>
            <H4 sx={{textAlign: 'center'}}>{messages['exam.ended']}</H4>
          </Grid>
        ) : !hasExamStarted ? (
          <Grid item xs={12}>
            <H4 sx={{textAlign: 'center'}}>{messages['exam.not_started']}</H4>
          </Grid>
        ) : examQuestionData ? (
          <>
            <Grid
              item
              display={'flex'}
              alignItems={'center'}
              flexDirection={'column'}
              justifyContent={'center'}
              xs={12}>
              <H5>{examQuestionData?.title}</H5>
              <S1>{examQuestionData?.subject_title}</S1>
              <S2>
                {messages['common.time']}
                {': '}
                {formatNumber(examQuestionData?.duration)}{' '}
                {messages['common.minute']}
              </S2>
              <S2>
                {messages['common.date']} {': '}
                {formatDate(examQuestionData?.start_date, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </S2>
            </Grid>

            <Grid
              item
              xs={12}
              display={'flex'}
              justifyContent={'space-between'}>
              <S1 sx={submitDisable ? {color: 'red'} : {color: 'green'}}>
                {submitDisable
                  ? messages['common.time_over']
                  : messages['common.time_remaining'] + ': ' + timer}
              </S1>
              <S1 sx={{marginLeft: 'auto'}}>
                {messages['common.total_marks']}
                {': '}
                {getIntlNumber(formatNumber, examQuestionData?.total_marks)}
              </S1>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Grid container spacing={2}>
                  {examQuestionData &&
                  examQuestionData?.exam_sections &&
                  examQuestionData?.exam_sections.length ? (
                    examQuestionData?.exam_sections.map((section: any) => {
                      return (
                        <React.Fragment key={section?.uuid}>
                          <Grid item xs={12} display={'flex'}>
                            <Body1 sx={{fontWeight: 'bold', whiteSpace: 'pre'}}>
                              {messages[
                                question_type[section?.question_type - 1].label
                              ] +
                                ' | ' +
                                messages['common.total_marks'] +
                                ': '}
                            </Body1>
                            <Body2 sx={{marginTop: '3px'}}>
                              {getIntlNumber(
                                formatNumber,
                                section?.total_marks,
                              )}
                            </Body2>
                          </Grid>
                          {section?.questions && section?.questions.length ? (
                            section?.questions.map((question: any) => {
                              let ansIndex = answerIndex++;

                              let hiddenFields = (
                                <HiddenInput
                                  register={register}
                                  index={ansIndex}
                                  section={section}
                                  question={question}
                                />
                              );
                              let questionHeader;
                              if (
                                section?.question_type !=
                                QuestionType?.FILL_IN_THE_BLANK
                              ) {
                                questionHeader = (
                                  <QuestionTitleHeader
                                    index={questionIndex++}
                                    question={question}
                                  />
                                );
                              }

                              if (section?.question_type == QuestionType?.MCQ) {
                                return (
                                  <React.Fragment key={question?.id}>
                                    {questionHeader}
                                    {hiddenFields}
                                    <Grid item xs={11}>
                                      {' '}
                                      <MCQTypeQuestion
                                        index={ansIndex}
                                        question={question}
                                        register={register}
                                      />
                                    </Grid>
                                  </React.Fragment>
                                );
                              } else if (
                                section?.question_type == QuestionType.YES_NO
                              ) {
                                return (
                                  <React.Fragment key={question?.id}>
                                    {questionHeader}
                                    {hiddenFields}
                                    <Grid item xs={11}>
                                      <FormRadioButtons
                                        id={
                                          'questions[' +
                                          ansIndex +
                                          '].answers[0]'
                                        }
                                        control={control}
                                        radios={[
                                          {
                                            label: messages['common.yes'],
                                            key: 1,
                                          },
                                          {
                                            label: messages['common.no'],
                                            key: 2,
                                          },
                                        ]}
                                      />
                                    </Grid>
                                  </React.Fragment>
                                );
                              } else if (
                                section?.question_type ==
                                QuestionType.DESCRIPTIVE
                              ) {
                                return (
                                  <React.Fragment key={question?.id}>
                                    {questionHeader}
                                    {hiddenFields}
                                    <Grid item xs={11}>
                                      <CustomTextInput
                                        id={
                                          'questions[' +
                                          ansIndex +
                                          '].answers[0]'
                                        }
                                        label={''}
                                        multiline={true}
                                        rows={3}
                                        control={control}
                                        errorInstance={errors}
                                        isLoading={false}
                                      />
                                    </Grid>
                                  </React.Fragment>
                                );
                              } else {
                                let fillInTheBlankItems = question?.title.split(
                                  /(?=\[\[\]\])|(?<=\[\[\]\])/g,
                                );
                                let indexNo = 0;
                                let qIndex = questionIndex++;
                                return (
                                  <React.Fragment key={question?.id}>
                                    <Grid item xs={11} display={'flex'}>
                                      <Body2
                                        sx={{
                                          fontWeight: 'bold',
                                          textAlign: 'center',
                                        }}>
                                        {getIntlNumber(formatNumber, qIndex) +
                                          '. '}
                                      </Body2>
                                      {fillInTheBlankItems.map((item: any) => {
                                        if (item == '[[]]') {
                                          return (
                                            <Box>
                                              <CustomTextInput
                                                id={`questions[${ansIndex}].answers[${indexNo++}]`}
                                                label={''}
                                                control={control}
                                                errorInstance={errors}
                                                isLoading={false}
                                                style={{
                                                  display: 'inline-block',
                                                  width: '150px',
                                                  marginTop: '-8px',
                                                }}
                                              />
                                            </Box>
                                          );
                                        } else {
                                          return (
                                            <Body2 sx={{whiteSpace: 'pre'}}>
                                              {item}
                                            </Body2>
                                          );
                                        }
                                      })}
                                      {hiddenFields}
                                    </Grid>
                                    <Grid item xs={1}>
                                      <Body2
                                        sx={{
                                          fontWeight: 'bold',
                                          textAlign: 'center',
                                        }}>
                                        {getIntlNumber(
                                          formatNumber,
                                          question?.individual_marks,
                                        )}
                                      </Body2>
                                    </Grid>
                                  </React.Fragment>
                                );
                              }
                            })
                          ) : (
                            <NoDataFoundComponent
                              messageType={messages['common.question']}
                              messageTextType={'h6'}
                            />
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </Grid>
                <Grid item display={'flex'} justifyContent={'center'}>
                  <Button
                    sx={{marginTop: '20px'}}
                    type={'submit'}
                    variant={'contained'}
                    color={'primary'}
                    disabled={isSubmitting || submitDisable}>
                    {messages['common.submit']}
                  </Button>
                </Grid>
              </form>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Paper>
  );
};

export default ExamQuestionPaper;
