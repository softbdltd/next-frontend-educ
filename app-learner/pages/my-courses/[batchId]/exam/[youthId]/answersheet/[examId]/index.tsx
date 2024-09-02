import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../../../../../../@core/layouts/hoc/YouthFrontPage';
import asyncComponent from '../../../../../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../../../../../@core/core/PageMeta';

const MyCoursePage = asyncComponent(
  () =>
    import(
      '../../../../../../../../modules/learner/myCourses/markSheetView/ExamMarkingViewPage'
    ),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.answer_sheet']} />
      <MyCoursePage />
    </>
  );
});
