import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const AssignPermissionToPermissionSubGroupPage = asyncComponent(
  () =>
    import(
      '../../../modules/dashboard/permissionSubGroups/AssignPermissionToPermissionSubGroupPage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['assign_permission.label']} />
      <AssignPermissionToPermissionSubGroupPage />
    </>
  );
});
