import React, {useCallback, useState} from 'react';
import {Container, Grid, Typography} from '@mui/material';
import CourseCardComponent from '../../../@core/elements/CourseCardComponent';
import {useIntl} from 'react-intl';
import {useFetchYouthCourses} from '../../../services/learnerManagement/hooks';
import {Link} from '../../../@core/elements/common';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import ViewExamsPopup from './ViewExamsPopup';
import ViewResultPopup from './ViewResultPopup';
import RowStatus from '../../../@core/utilities/RowStatus';

const MyCoursePage = () => {
  const {messages} = useIntl();

  const [courseFilters] = useState({row_status: RowStatus.ACTIVE});
  const [isOpenViewExamModal, setIsOpenViewExamModal] = useState(false);
  const [learnerId, setYouthId] = useState<any>(null);
  const [batchId, setBatchId] = useState<any>(null);
  const [batchTitle, setBatchTitle] = useState<string | null>('');
  const [isOpenResultModal, setIsOpenResultModal] = useState(false);

  const {data: courseList, isLoading: isLoadingCourses} =
    useFetchYouthCourses(courseFilters);

  const onCloseViewExamModal = useCallback(() => {
    setYouthId(null);
    setIsOpenViewExamModal(false);
  }, []);

  const handleViewResult = (
    e: any,
    batchId: any,
    learnerId: any,
    batchTitle: string | null,
  ) => {
    e.preventDefault();
    setIsOpenResultModal(true);
    setBatchId(batchId);
    setYouthId(learnerId);
    setBatchTitle(batchTitle);
  };

  const onCloseResultModal = useCallback(() => {
    setIsOpenResultModal(false);
  }, []);

  const handleViewExam = (e: any, learnerId: any, batchId: any) => {
    e.preventDefault();
    setYouthId(learnerId);
    setIsOpenViewExamModal(true);
    setBatchId(batchId);
  };

  return (
    <Container maxWidth={'lg'} sx={{padding: 5}}>
      {isLoadingCourses ? (
        <BoxCardsSkeleton />
      ) : courseList && courseList?.length ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant={'h5'} fontWeight={'bold'}>
              {messages['common.my_courses']}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Grid container spacing={5}>
              {courseList.map((course: any) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={course.id}>
                    <Link href={`/course-details/${course.course_id}`}>
                      <CourseCardComponent
                        course={{
                          id: course.course_id,
                          course_fee: course.course_fee,
                          cover_image: course.cover_image,
                          title: course.course_title,
                          institute_title: course.institute_title,
                          created_at: course.course_created_at,
                          duration: course.duration,
                          exams: course?.exams,
                          batch_id: course.batch_id,
                          learner_id: course.learner_id,
                          result_published_at: course.result_published_at,
                          result_processed_at: course.result_processed_at,
                          batch_title: course.batch_title,
                        }}
                        handleViewExam={handleViewExam}
                        handleViewResult={handleViewResult}
                      />
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container sx={{justifyContent: 'center', marginTop: 5}}>
          <Typography variant={'h4'}>
            {messages['common.no_enrolled_course_found']}
          </Typography>
        </Grid>
      )}

      {isOpenViewExamModal && (
        <ViewExamsPopup
          onClose={onCloseViewExamModal}
          learnerId={learnerId}
          batchId={batchId}
        />
      )}

      {isOpenResultModal && (
        <ViewResultPopup
          onClose={onCloseResultModal}
          batchId={batchId}
          learnerId={learnerId}
          batchTitle={batchTitle}
        />
      )}
    </Container>
  );
};

export default MyCoursePage;
