import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import asyncComponent from '../../../@core/utility/asyncComponent';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';

const CertificatePage = asyncComponent(
  () => import('./../../../modules/dashboard/certificate/CertificatePage'),
);

export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['certificate_template.name']} />
      <CertificatePage />
    </>
  );
});
