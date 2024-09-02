import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const MyCoursePage = asyncComponent(
  () => import('../../../modules/learner/myCourses'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.my_courses']} />
      <MyCoursePage />
    </>
  );
});
