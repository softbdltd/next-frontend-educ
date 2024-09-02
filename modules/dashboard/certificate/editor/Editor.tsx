import React from 'react';
import CanvasRenderer from './compontents/CanvasRenderer/CanvasRenderer';
import EditorHeader from './compontents/EditorHeader/EditorHeader';
import EditorMenu from './compontents/EditorMenu/EditorMenu';
import EditorMenuPanel from './compontents/EditorMenuPanel/EditorMenuPanel';
import MainArea from './layouts/MainArea';
import {EditorAreaContainer} from './state/containers/EditorAreaContainer';
import {StageRefContainer} from './state/containers/StageRefContainer';
import EditorZoomControls from './compontents/EditorZoom/EditorZoomControl';
import useKeyboardCommand from './hooks/useKeyboardCommand';
import useElementsDispatcher from './state/dispatchers/elements';
import HistoryActions from './compontents/History/HistoryActions';
import History from './compontents/History/History';
import useHistoryDispatcher from './state/dispatchers/history';
interface Props {
  onClick: (selectedItemId?: number | null) => void;
}

function Editor({onClick}: Props) {
  const {deleteSelectedElement, updateSelectedElement} =
    useElementsDispatcher();
  const {undo, redo} = useHistoryDispatcher();

  useKeyboardCommand(
    'delete',
    deleteSelectedElement,
    process.browser ? document : undefined,
  );
  useKeyboardCommand(
    'ctrl+arrowright',
    updateSelectedElement,
    process.browser ? document : undefined,
  );
  useKeyboardCommand(
    'ctrl+arrowleft',
    updateSelectedElement,
    process.browser ? document : undefined,
  );
  useKeyboardCommand(
    'ctrl+arrowup',
    updateSelectedElement,
    process.browser ? document : undefined,
  );
  useKeyboardCommand(
    'ctrl+arrowdown',
    updateSelectedElement,
    process.browser ? document : undefined,
  );

  useKeyboardCommand('ctrl+z', undo, process.browser ? document : undefined);
  useKeyboardCommand('ctrl+y', redo, process.browser ? document : undefined);

  return (
    <EditorAreaContainer.Provider>
      <StageRefContainer.Provider>
        <History />
        <div className='editor-container'>
          <EditorMenu />
          <div className='editor-container-header'>
            <EditorHeader onClick={onClick} />
            <div className='editor-container-panel '>
              <div className='editor-container-panel-inner'>
                <div className='editor-tool-bar'>
                  <EditorZoomControls />
                </div>
                <EditorMenuPanel />
                <div className='history-action-toolbar'>
                  <HistoryActions />
                </div>
              </div>
              <MainArea className='relative overflow-hidden' noScroll>
                <CanvasRenderer />
              </MainArea>
            </div>
          </div>
        </div>
      </StageRefContainer.Provider>
    </EditorAreaContainer.Provider>
  );
}

export default Editor;
