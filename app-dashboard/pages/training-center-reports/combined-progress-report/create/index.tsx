import React from 'react';
import {useIntl} from 'react-intl';
import asyncComponent from '../../../../../@core/utility/asyncComponent';
import DashboardPage from '../../../../../@core/layouts/hoc/DashboardPage';
import PageMeta from '../../../../../@core/core/PageMeta';

const TrainingCenterProgressReportCreate = asyncComponent(
  () =>
    import(
      '../../../../../modules/dashboard/trainingCenterReports/CombinedProgressReportCreatePage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta
        title={messages['training_center_progress_report_combined.label']}
      />
      <TrainingCenterProgressReportCreate />
    </>
  );
});
