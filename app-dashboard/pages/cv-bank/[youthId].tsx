import React from 'react';
import {useIntl} from 'react-intl';
import asyncComponent from '../../../@core/utility/asyncComponent';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import PageMeta from '../../../@core/core/PageMeta';

const YouthCVPage = asyncComponent(
  () => import('../../../modules/dashboard/cvBank/YouthCVPage'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.learner_cv'] as string} />
      <YouthCVPage />
    </>
  );
});
