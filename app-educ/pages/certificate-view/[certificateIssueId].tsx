import dynamic from 'next/dynamic';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import EducFrontPage from './../../../@core/layouts/hoc/EducFrontPage';
const CertificatePublicView = dynamic(
  () => import('../../../modules/dashboard/certificate/CertificatePublicView'),
  {
    ssr: false,
  },
);

export default EducFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.certificate']} />
      <CertificatePublicView />
    </>
  );
});
