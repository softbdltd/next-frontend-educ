import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import DashboardPage from '../../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const ExamCreatePage = asyncComponent(
  () =>
    import(
      '../../../../modules/dashboard/exams/examCreateUpdate/ExamAddEditPage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['exam.label'] as string} />
      <ExamCreatePage />
    </>
  );
});
