import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import InstituteFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const InstituteNoticeDetailsPage = asyncComponent(
  () => import('../../../shared/components/NoticeDetails'),
);
export default InstituteFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.notice_details'] as string}
      />
      <InstituteNoticeDetailsPage />
    </>
  );
});
