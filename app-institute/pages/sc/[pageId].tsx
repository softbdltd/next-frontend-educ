import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';
import {useContext} from 'react';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const StaticContent = asyncComponent(() => import('../../../modules/sc'));

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.static_content']}
      />
      <StaticContent />
    </>
  );
});
