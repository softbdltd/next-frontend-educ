import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';

const RecentActivities = asyncComponent(
  () => import('../../../modules/institute/recent-activities'),
);

export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.recent_activities']} />
      <RecentActivities />
    </>
  );
});
