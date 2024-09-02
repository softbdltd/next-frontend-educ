import React from 'react';
import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import {useIntl} from 'react-intl';

const JobRequirementManagePage = asyncComponent(
  () =>
    import(
      '../../../modules/dashboard/jobRequirements/JobRequirementManagePage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['human_resource_demand.label']} />
      <JobRequirementManagePage />
    </>
  );
});
