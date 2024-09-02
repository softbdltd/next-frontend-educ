import React from 'react';
import {EditorAreaContainer} from './state/containers/EditorAreaContainer';
import {StageRefContainer} from './state/containers/StageRefContainer';
import MainArea from './layouts/MainArea';
import ViewHeader from './compontents/ViewHeader/ViewHeader';
import ViewRenderer from './compontents/CanvasRenderer/ViewRenderer';

type Props = {
  templateId?: string | number;
};

function CertificateView({templateId}: Props) {
  return (
    <StageRefContainer.Provider>
      <EditorAreaContainer.Provider>
        <div className='editor-container-header'>
          <ViewHeader templateId={templateId} />
          <div className='editor-container'>
            <MainArea className='relative overflow-hidden' noScroll>
              <ViewRenderer templateId={templateId} />
            </MainArea>
          </div>
        </div>
      </EditorAreaContainer.Provider>
    </StageRefContainer.Provider>
  );
}

export default CertificateView;
