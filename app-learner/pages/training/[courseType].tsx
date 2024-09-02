import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';
import {useIntl} from 'react-intl';

const YouthAllCourse = asyncComponent(
  () => import('../../../modules/learner/training/AllCourseSection'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.courses']} />
      <YouthAllCourse />
    </>
  );
});
