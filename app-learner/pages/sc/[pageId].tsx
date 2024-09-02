import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';
import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';

const StaticContent = asyncComponent(() => import('../../../modules/sc'));

export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.static_page']} />
      <StaticContent />
    </>
  );
});
