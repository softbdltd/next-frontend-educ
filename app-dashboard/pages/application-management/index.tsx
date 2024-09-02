import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const ApplicationManagementPage = asyncComponent(
  () =>
    import(
      '../../../modules/dashboard/applicationManagement/ApplicationManagementPage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['applicationManagement.label'] as string} />
      <ApplicationManagementPage />
    </>
  );
});
