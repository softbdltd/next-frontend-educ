import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const CertificateAuthorityPage = asyncComponent(
  () =>
    import(
      '../../../modules/dashboard/certificateAuthority/CertificateAuthorityPage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['certificate_authority.label']} />
      <CertificateAuthorityPage />
    </>
  );
});
