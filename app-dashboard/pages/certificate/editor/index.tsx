import dynamic from 'next/dynamic';
import PageMeta from '../../../../@core/core/PageMeta';
import AuthenticatedBlankPage from './../../../../@core/layouts/hoc/AuthenticatedBlankPage';
import {useIntl} from 'react-intl';

const CertificateEditor = dynamic(
  () =>
    import('./../../../../modules/dashboard/certificate/CertificateEditorPage'),
  {
    ssr: false,
  },
);

const CertificateEditorPage = AuthenticatedBlankPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.certificate']} />
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
        <div className='loader'>
          <CertificateEditor />
        </div>
      </div>
    </>
  );
});

export default CertificateEditorPage;
