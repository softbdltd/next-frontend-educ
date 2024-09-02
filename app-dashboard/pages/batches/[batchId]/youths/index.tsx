import asyncComponent from '../../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../../@core/core/PageMeta';
import DashboardPage from '../../../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const BatchsYouthList = asyncComponent(
  () => import('../../../../../modules/dashboard/batches/BatchsYouthList'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.trainee_cv'] as string} />
      <BatchsYouthList />
    </>
  );
});
