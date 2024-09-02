import {RecoilRoot} from 'recoil';
import {useCallback, useState} from 'react';
import CertificateAddEditPopup from './CertificateAddEditPopup';
import Editor from './editor/Editor';

const CertificateEditorPage = () => {
  const [isAddEditPopupOpen, setIsAddEditPopupOpen] = useState(false);

  const closeAddEditModal = useCallback(() => {
    setIsAddEditPopupOpen(false);
  }, []);

  const openAddEditModal = useCallback(() => {
    setIsAddEditPopupOpen(true);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
      <RecoilRoot>
        <Editor onClick={openAddEditModal} />

        {isAddEditPopupOpen && (
          <CertificateAddEditPopup key={1} onClose={closeAddEditModal} />
        )}
      </RecoilRoot>
    </div>
  );
};

export default CertificateEditorPage;
