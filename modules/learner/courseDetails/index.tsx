import {useRouter} from 'next/router';
import React from 'react';
import {MUKTOPATH_PRIFIX} from '../../../@core/common/constants';
import CourseDetailsOfMuktopath from './CourseDetailsOfMuktopath';
import CourseDetailsOfEduc from './CourseDetailsOfEduc';

const CourseDetails = () => {
  const router = useRouter();
  let {courseId} = router.query;
  const isCourseMuktopath = courseId?.includes(MUKTOPATH_PRIFIX);
  let obtainCourseId;
  if (isCourseMuktopath) {
    obtainCourseId = courseId?.slice(MUKTOPATH_PRIFIX.length);
  } else {
    obtainCourseId = courseId;
  }

  return isCourseMuktopath ? (
    <CourseDetailsOfMuktopath courseId={obtainCourseId} />
  ) : (
    <CourseDetailsOfEduc courseId={obtainCourseId} />
  );
};

export default CourseDetails;
