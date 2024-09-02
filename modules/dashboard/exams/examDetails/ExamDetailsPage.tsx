import {Box, Button, Grid} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import IconExam from '../../../../@core/icons/IconExam';
import {ExamTypes} from '../ExamEnums';
import {useFetchExamDetails} from '../../../../services/instituteManagement/hooks';
import PageBlock from '../../../../@core/utilities/PageBlock';
import {ArrowBack} from '@mui/icons-material';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import QuestionSkeleton from '../../../learner/examQuestionPaper/QuestionSkeleton';
import OnlineDetails from './OnlineDetails';
import OfflineDetails from './OfflineDetails';
import OtherExamDetails from './OtherExamDetails';

const ExamDetailsPage = () => {
  const {messages} = useIntl();

  const [onlineExam, setOnlineExam] = useState<any>(null);
  const [offlineExam, setOfflineExam] = useState<any>(null);
  const [otherExam, setOtherExam] = useState<any>(null);

  const router = useRouter();

  const itemId = router.query.id;

  const {data: examData, isLoading: isLoadingExam} =
    useFetchExamDetails(itemId);

  const examType = (data: any) => {
    switch (data) {
      case ExamTypes.ONLINE:
        return messages['common.online'];
      case ExamTypes.OFFLINE:
        return messages['common.offline'];
      case ExamTypes.MIXED:
        return messages['common.mixed'];
      case ExamTypes.PRACTICAL:
        return messages['common.practical'];
      case ExamTypes.FIELDWORK:
        return messages['common.field_work'];
      case ExamTypes.PRESENTATION:
        return messages['common.presentation'];
      case ExamTypes.ASSIGNMENT:
        return messages['common.assignment'];
      default:
        return '';
    }
  };

  useEffect(() => {
    examData &&
      examData.exams &&
      examData.exams.map((exam: any) => {
        {
          ExamTypes.ONLINE === Number(exam?.type)
            ? setOnlineExam(exam)
            : ExamTypes.OFFLINE === Number(exam?.type)
            ? setOfflineExam(exam)
            : setOtherExam(exam);
        }
      });
  }, [examData]);

  const {
    register,
    control,
    setValue,
    formState: {errors},
  } = useForm<any>();

  return (
    <>
      <PageBlock
        title={
          <>
            <IconExam />
            {messages['exam.label']}
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
        <Box sx={{padding: '25px'}}>
          <Grid container>
            {isLoadingExam ? (
              <QuestionSkeleton />
            ) : (
              <>
                {onlineExam && (
                  <OnlineDetails
                    key={onlineExam?.id}
                    exam={onlineExam}
                    examData={examData}
                    register={register}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />
                )}

                {offlineExam && (
                  <OfflineDetails
                    key={offlineExam?.id}
                    exam={offlineExam}
                    examData={examData}
                    register={register}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />
                )}

                {otherExam && (
                  <OtherExamDetails
                    key={otherExam?.id}
                    exam={otherExam}
                    examData={examData}
                    examType={examType}
                  />
                )}
              </>
            )}
          </Grid>
        </Box>
      </PageBlock>
    </>
  );
};

export default ExamDetailsPage;
