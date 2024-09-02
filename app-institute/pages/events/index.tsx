import asyncComponent from '../../../@core/utility/asyncComponent';
import React, {useContext} from 'react';
import PageMeta from '../../../@core/core/PageMeta';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const InstituteEventCalendarViewPage = asyncComponent(
  () => import('../../../modules/events/EventCalendarView'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.calendar'] as string}
      />
      <InstituteEventCalendarViewPage />
    </>
  );
});
