import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const CertificateVerificationPage = asyncComponent(
  () => import('../../../modules/dashboard/certificateVerification/CertificateVerificationPage'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.certificate_verification']}/>
      <CertificateVerificationPage/>
    </>
  );
});
