import React from 'react';
import {useIntl} from 'react-intl';
import DashboardPage from '../../../../../../../../@core/layouts/hoc/DashboardPage';
import PageMeta from '../../../../../../../../@core/core/PageMeta';
import asyncComponent from '../../../../../../../../@core/utility/asyncComponent';

const MarkingViewPage = asyncComponent(
  () =>
    import(
      '../../../../../../../../modules/dashboard/batches/ExamMarking/ExamMarkingViewPage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.marks_distribution'] as string} />
      <MarkingViewPage />
    </>
  );
});
