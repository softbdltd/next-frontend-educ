import React from 'react';
import {EditorAreaContainer} from './state/containers/EditorAreaContainer';
import {StageRefContainer} from './state/containers/StageRefContainer';
import MainArea from './layouts/MainArea';
import ViewRendererPublic from './compontents/CanvasRenderer/ViewRendererPublic';

function CertificatePublicView() {
  return (
    <StageRefContainer.Provider>
      <EditorAreaContainer.Provider>
        <div className='editor-container-header'>
          <div className='editor-container'>
            <MainArea className='relative overflow-hidden' noScroll>
              <ViewRendererPublic />
            </MainArea>
          </div>
        </div>
      </EditorAreaContainer.Provider>
    </StageRefContainer.Provider>
  );
}

export default CertificatePublicView;
