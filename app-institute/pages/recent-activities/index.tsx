import asyncComponent from '../../../@core/utility/asyncComponent';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import {useContext} from 'react';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const RecentActivities = asyncComponent(
  () => import('../../../modules/institute/recent-activities'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.recent_activities']}
      />
      <RecentActivities />
    </>
  );
});
