import asyncComponent from '../../../@core/utility/asyncComponent';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import React, {useContext} from 'react';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const InstituteContact = asyncComponent(
  () => import('../../../modules/institute/contact'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.contact'] as string}
      />
      <InstituteContact />
    </>
  );
});
