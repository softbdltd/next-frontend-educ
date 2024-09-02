import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';
import {useIntl} from 'react-intl';

const CourseCategoryPage = asyncComponent(
  () => import('../../../modules/learner/courseList'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.courses']} />
      <CourseCategoryPage />
    </>
  );
});
