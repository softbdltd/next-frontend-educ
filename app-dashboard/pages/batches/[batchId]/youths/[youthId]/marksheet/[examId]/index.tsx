import React from 'react';
import {useIntl} from 'react-intl';
import DashboardPage from '../../../../../../../../@core/layouts/hoc/DashboardPage';
import PageMeta from '../../../../../../../../@core/core/PageMeta';
import asyncComponent from '../../../../../../../../@core/utility/asyncComponent';

const ExamMarkSheetPage = asyncComponent(
  () =>
    import(
      '../../../../../../../../modules/dashboard/batches/ExamMarkSheet/ExamMarkSheetView'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.answer_sheet'] as string} />
      <ExamMarkSheetPage />
    </>
  );
});
