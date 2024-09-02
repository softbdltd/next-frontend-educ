import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import asyncComponent from '../../../@core/utility/asyncComponent';

const QuestionsBank = asyncComponent(
  () => import('../../../modules/dashboard/questionsBank/QuestionsBankPage'),
);

export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['question-bank.label']} />
      <QuestionsBank />
    </>
  );
});
