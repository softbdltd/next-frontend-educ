import dynamic from 'next/dynamic';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const CertificateView = dynamic(
  () => import('../../../modules/dashboard/certificate/CertificateView'),
  {
    ssr: false,
  },
);

export default YouthFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.certificate']} />
      <CertificateView />
    </>
  );
});
