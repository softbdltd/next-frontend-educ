import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const EventCalendarPage = asyncComponent(
  () => import('../../../modules/dashboard/events/EventCalendar'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['menu.events'] as string} />
      <EventCalendarPage />
    </>
  );
});
