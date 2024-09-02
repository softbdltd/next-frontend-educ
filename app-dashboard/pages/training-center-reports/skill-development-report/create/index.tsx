import asyncComponent from '../../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../../@core/core/PageMeta';
import DashboardPage from '../../../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const SkillDevelopmentReportCreatePage = asyncComponent(
  () =>
    import(
      '../../../../../modules/dashboard/trainingCenterReports/SkillDevelopmentReportCreatePage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['skill_development_report.label']} />
      <SkillDevelopmentReportCreatePage />
    </>
  );
});
