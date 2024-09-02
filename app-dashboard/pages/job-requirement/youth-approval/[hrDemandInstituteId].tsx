import React from 'react';
import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import DashboardPage from '../../../../@core/layouts/hoc/DashboardPage';
import {useIntl} from 'react-intl';

const YouthJobApprovalYouthListPage = asyncComponent(
  () =>
    import(
      '../../../../modules/dashboard/jobRequirements/InstituteProvidedYouthList'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.learner_approval']} />
      <YouthJobApprovalYouthListPage />
    </>
  );
});
