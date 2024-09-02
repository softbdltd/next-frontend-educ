import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import EducFrontPage from '../../../../@core/layouts/hoc/EducFrontPage';

const UpcomingEventsDetails = asyncComponent(
  () => import('../../../../modules/educ/upComingEvents/UpcomingEventsDetails'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.upcoming_events']} />
      <UpcomingEventsDetails />
    </>
  );
});
