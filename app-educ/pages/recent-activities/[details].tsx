import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';
import asyncComponent from '../../../@core/utility/asyncComponent';

const RecentActivitiesDetails = asyncComponent(
  () =>
    import(
      '../../../modules/institute/recent-activities/RecentActivitiesDetails'
    ),
);

export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.recent_activities']} />
      <RecentActivitiesDetails />
    </>
  );
});
