import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React, {useContext} from 'react';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const CourseDetailsPage = asyncComponent(
  () => import('../../../modules/learner/courseDetails'),
);
export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.course_details']}
      />
      <CourseDetailsPage />
    </>
  );
});
