import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthSecondaryPage from '../../../@core/layouts/hoc/YouthSecondaryPage';

const CourseEnrollmentSubmittedPage = asyncComponent(
  () => import('../../../modules/learner/courseRegistrationSubmitted'),
);
export default YouthSecondaryPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.course_registration']} />
      <CourseEnrollmentSubmittedPage />
    </>
  );
});
