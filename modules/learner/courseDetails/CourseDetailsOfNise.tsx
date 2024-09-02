import {Container, Grid} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchPublicCourseDetailsWithParams} from '../../../services/instituteManagement/hooks';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import CourseContentSection from './CourseContentSection';
import CourseDetailsHeaderSection from './CourseDetailsHeaderSection';
import CourseDetailsSkillMatchingJobSection from './CourseDetailsSkillMatchingJobSection';
import SimilarCourseSection from './SimilarCourseSection';

const CourseDetailsOfEduc = ({courseId}: any) => {
  const authUser = useAuthUser<YouthAuthUser>();

  const [courseDetailsFilter, setCourseDetailsFilter] = useState<any>({});

  const {data: courseDetails, isLoading: isLoadingCourse} =
    useFetchPublicCourseDetailsWithParams(
      Number(courseId),
      courseDetailsFilter,
    );

  useEffect(() => {
    if (authUser && authUser?.isYouthUser) {
      setCourseDetailsFilter({
        learner_id: authUser?.learnerId,
      });
    }
  }, [authUser]);

  const [skillIds, setSkillIds] = useState<Array<number>>([]);

  useEffect(() => {
    let skillIDs: Array<number> = [];
    if (courseDetails?.skills) {
      courseDetails.skills.map((skill: any) => {
        skillIDs.push(skill.id);
      });
    }
    setSkillIds(skillIDs);
  }, [courseDetails]);

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
          <CourseDetailsHeaderSection course={courseDetails} />
          <CourseContentSection course={courseDetails} />
        </>
      ) : (
        <NoDataFoundComponent />
      )}

      <SimilarCourseSection skillIds={skillIds} courseId={Number(courseId)} />
      <CourseDetailsSkillMatchingJobSection
        skillIds={skillIds}
        courseId={courseId}
      />
    </>
  );
};

export default CourseDetailsOfEduc;
