import asyncComponent from '../../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../../@core/core/PageMeta';
import DashboardPage from '../../../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const SmartJobFairDetailsPage = asyncComponent(
  () =>
    import(
      '../../../../../modules/dashboard/smartJobFair/SmartJobFairDetailsPage'
    ),
);

export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.smart_job_fair'] as string} />
      <SmartJobFairDetailsPage />
    </>
  );
});
