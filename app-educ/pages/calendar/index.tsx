import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';

const EventCalendarViewPage = asyncComponent(
  () => import('../../../modules/events/EventCalendarView'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['menu.calendar'] as string} />
      <EventCalendarViewPage />
    </>
  );
});
