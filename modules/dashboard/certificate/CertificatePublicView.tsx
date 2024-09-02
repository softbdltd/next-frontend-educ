import {RecoilRoot} from 'recoil';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./editor/CertificatePublicView'),
  {
    ssr: false,
  },
);

const CertificatePublicView = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <RecoilRoot>
        <DynamicComponentWithNoSSR />
      </RecoilRoot>
    </div>
  );
};

export default CertificatePublicView;
