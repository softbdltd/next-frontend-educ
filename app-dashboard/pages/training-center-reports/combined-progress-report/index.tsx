import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import DashboardPage from '../../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const TrainingCenterProgressReportCreate = asyncComponent(
  () =>
    import(
      '../../../../modules/dashboard/trainingCenterReports/CombinedProgressReportPage'
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
