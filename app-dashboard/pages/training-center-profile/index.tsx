import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const TrainingCenterProfile = asyncComponent(
  () => import('../../../modules/dashboard/trainingCenterProfile'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.profile']} />
      <TrainingCenterProfile />
    </>
  );
});
