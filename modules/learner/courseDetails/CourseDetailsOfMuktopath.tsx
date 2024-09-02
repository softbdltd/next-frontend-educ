import {Container, Grid} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchPublicMuktopathCourseDetailsWithParams} from '../../../services/instituteManagement/hooks';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import CourseContentSectionOfMuktopath from './component/CourseContentSectionOfMuktopath';
import CourseDetailsHeaderSectionOfMuktopath from './component/CourseDetailsHeaderSectionOfMuktopath';

const CourseDetailsOfMuktopath = ({courseId}: any) => {
  const authUser = useAuthUser<YouthAuthUser>();
  const [courseDetailsFilter, setCourseDetailsFilter] = useState<any>({});

  const {data: courseDetails, isLoading: isLoadingCourse} =
    useFetchPublicMuktopathCourseDetailsWithParams(
      courseId,
      courseDetailsFilter,
    );

  useEffect(() => {
    if (authUser && authUser?.isYouthUser) {
      setCourseDetailsFilter({
        learner_id: authUser?.learnerId,
      });
    }
  }, [authUser]);

  return (
    <>
      {isLoadingCourse ? (
        <Container maxWidth={'lg'}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <BoxCardsSkeleton />
            </Grid>
          </Grid>
        </Container>
      ) : courseDetails ? (
        <>
          <CourseDetailsHeaderSectionOfMuktopath course={courseDetails} />
          <CourseContentSectionOfMuktopath course={courseDetails} />
        </>
      ) : (
        <NoDataFoundComponent />
      )}
    </>
  );
};

export default CourseDetailsOfMuktopath;
