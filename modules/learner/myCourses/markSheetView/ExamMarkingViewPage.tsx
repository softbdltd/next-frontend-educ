import React, {useCallback} from 'react';
import {Button, Grid, Paper, Container} from '@mui/material';

import {useIntl} from 'react-intl';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import FillInTheBlankTypeComponent from './FillInTheBlankTypeComponent';
import MCQTypeComponent from './MCQTypeComponent';
import YesNoTypeComponent from './YesNoTypeComponent';
import DescriptiveTypeComponent from './DescriptiveTypeComponent';

import {useRouter} from 'next/router';

import {ArrowBack} from '@mui/icons-material';
import NoDataFoundComponent from '../../../learner/common/NoDataFoundComponent';
import {
  getIntlDateFromString,
  getIntlNumber,
  getIntlTimeFromString,
  question_type,
} from '../../../../@core/utilities/helpers';
import {Body1, Body2, H6, S1} from '../../../../@core/elements/common';
import {useFetchPublicPreviewYouthExam} from '../../../../services/instituteManagement/hooks';
import QuestionSkeleton from '../../../learner/examQuestionPaper/QuestionSkeleton';
import {QuestionType} from '../../../dashboard/questionsBank/QuestionBanksEnums';

const StyledPaper = styled(Paper)(({theme}) => ({
  padding: '25px',
}));

const ExamMarkingViewPage = () => {
  const {messages, formatDate, formatTime, formatNumber} = useIntl();
  const router = useRouter();
  let questionIndex = 1;
  let {examId, learnerId} = router.query;
  const {data: examSheet, isLoading: isExamLoading} =
    useFetchPublicPreviewYouthExam(Number(examId), Number(learnerId));

  const getExamTimeDuration = useCallback((duration: any) => {
    let hour = Math.floor(duration / 60);
    let minutes = Math.floor(duration % 60);

    if (hour > 0) {
      if (minutes > 0) {
        return (
          <>
            {getIntlNumber(formatNumber, hour) +
              ' ' +
              messages['common.hour'] +
              ' ' +
              getIntlNumber(formatNumber, minutes) +
              ' ' +
              messages['common.minute']}
          </>
        );
      } else {
        return (
          <>
            {getIntlNumber(formatNumber, hour) + ' ' + messages['common.hour']}
          </>
        );
      }
    } else {
      return (
        <>
          {getIntlNumber(formatNumber, minutes) +
            ' ' +
            messages['common.minute']}
        </>
      );
    }
  }, []);

  const getQuestionTypeComponent = (questionType: any, question: any) => {
    switch (String(questionType)) {
      case QuestionType.YES_NO:
        return (
          <YesNoTypeComponent question={question} index={questionIndex++} />
        );
      case QuestionType.MCQ:
        return <MCQTypeComponent question={question} index={questionIndex++} />;
      case QuestionType.FILL_IN_THE_BLANK:
        return (
          <FillInTheBlankTypeComponent
            question={question}
            index={questionIndex++}
          />
        );
      case QuestionType.DESCRIPTIVE:
        return (
          <DescriptiveTypeComponent
            question={question}
            index={questionIndex++}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Container maxWidth={'lg'} sx={{padding: 5}}>
      <StyledPaper>
        {isExamLoading ? (
          <QuestionSkeleton />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
              <Button
                variant={'contained'}
                color={'primary'}
                size={'small'}
                onClick={() => router.back()}>
                <ArrowBack />
                {messages['common.back']}
              </Button>
            </Grid>
            <Grid
              item
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              xs={12}>
              <H6>{examSheet?.title}</H6>
              <S1>
                {messages['subject.label']}
                {': '}
                {examSheet?.subject_title}
              </S1>
              <S1>
                {messages['common.date']} {': '}
                {examSheet?.start_date
                  ? getIntlDateFromString(formatDate, examSheet?.start_date)
                  : ''}
              </S1>
              <S1>
                {messages['common.time']} {': '}
                {examSheet?.start_date
                  ? getIntlTimeFromString(formatTime, examSheet?.start_date)
                  : ''}
              </S1>
            </Grid>

            <Grid item xs={12}>
              <Grid container>
                <Grid
                  item
                  display={'flex'}
                  alignItems={'center'}
                  whiteSpace={'pre'}>
                  <H6>{messages['common.name']}: </H6>
                  <Body1>
                    {examSheet?.first_name} {examSheet?.last_name}
                  </Body1>
                </Grid>
                <Grid
                  item
                  ml={4}
                  display={'flex'}
                  alignItems={'center'}
                  whiteSpace={'pre'}>
                  <H6>{messages['common.mobile']}: </H6>
                  <Body1>{examSheet?.mobile}</Body1>
                </Grid>
                <Grid
                  item
                  ml={4}
                  display={'flex'}
                  alignItems={'center'}
                  whiteSpace={'pre'}>
                  <H6>
                    {messages['common.email']}
                    {': '}
                  </H6>
                  <Body1>{examSheet?.email}</Body1>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              display={'flex'}
              justifyContent={'space-between'}>
              <S1>
                {messages['common.duration'] + ': '}
                {examSheet?.duration
                  ? getExamTimeDuration(examSheet?.duration)
                  : ''}
              </S1>
              <S1>
                {messages['common.total_marks']}
                {': '}
                {getIntlNumber(formatNumber, examSheet?.total_marks)}
              </S1>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{borderBottom: 1}} />
            </Grid>
            <Grid item xs={10} />
            <Grid item xs={2}>
              <Body2 sx={{textAlign: 'center'}}>
                {messages['common.obtained_mark']}
              </Body2>
              <Box sx={{borderBottom: 1}} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {examSheet && examSheet?.exam_sections.length ? (
                  examSheet?.exam_sections.map((section: any) => {
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
                            {getIntlNumber(formatNumber, section?.total_marks)}
                          </Body2>
                        </Grid>

                        {section?.questions && section?.questions.length ? (
                          section?.questions.map((question: any) => {
                            return (
                              <Grid item xs={12} key={question?.question_id}>
                                {getQuestionTypeComponent(
                                  section?.question_type,
                                  question,
                                )}
                              </Grid>
                            );
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
                  <NoDataFoundComponent
                    messageType={messages['common.question']}
                    messageTextType={'h6'}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </StyledPaper>
    </Container>
  );
};

export default ExamMarkingViewPage;
