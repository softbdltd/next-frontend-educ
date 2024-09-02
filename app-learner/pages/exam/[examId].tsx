import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const ExamQuestionPaper = asyncComponent(
  () => import('../../../modules/learner/examQuestionPaper'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['exam.label'] as string} />
      <ExamQuestionPaper />
    </>
  );
});
