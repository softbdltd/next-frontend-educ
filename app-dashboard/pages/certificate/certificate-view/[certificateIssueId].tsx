import dynamic from 'next/dynamic';
import PageMeta from '../../../../@core/core/PageMeta';
import AuthenticatedBlankPage from '../../../../@core/layouts/hoc/AuthenticatedBlankPage';
import {useIntl} from 'react-intl';
import React from 'react';

const CertificateView = dynamic(
  () => import('../../../../modules/dashboard/certificate/CertificateView'),
  {
    ssr: false,
  },
);

export default AuthenticatedBlankPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.certificate']} />
      <CertificateView />
    </>
  );
});
