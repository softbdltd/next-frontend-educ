import React from 'react';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';
import PageMeta from '../../../@core/core/PageMeta';
import asyncComponent from '../../../@core/utility/asyncComponent';
import {useIntl} from 'react-intl';

const YouthCalendarPage = asyncComponent(
  () => import('../../../modules/learner/feed/YouthCalendar'),
);


export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.calendar'] as string} />
      <YouthCalendarPage/>
    </>
  );
});
