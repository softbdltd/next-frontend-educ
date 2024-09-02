import React from 'react';
import {Tooltip} from '@mui/material';
import {GrUndo, GrRedo} from 'react-icons/gr';
import Button from '../ui/Button';
import {
  canUndoSelector,
  canRedoSelector,
} from './../../state/selectors/history';
import {useRecoilValue} from 'recoil';
import useHistoryDispatcher from './../../state/dispatchers/history';

function HistoryActions() {
  const undoEnabled = useRecoilValue(canUndoSelector);
  const redoEnabled = useRecoilValue(canRedoSelector);
  const {redo, undo} = useHistoryDispatcher();
  return (
    <div>
      <Tooltip title='Undo' leaveDelay={100}>
        <span>
          <Button
            type={'secondary'}
            className={'shape-action-button'}
            disabled={!undoEnabled}
            onClick={undo}>
            <GrUndo style={{height: '1.5rem', width: '1.75rem'}} />
          </Button>
        </span>
      </Tooltip>

      <Tooltip title='Redo' leaveDelay={100}>
        <span>
          <Button
            type={'secondary'}
            className={'shape-action-button'}
            disabled={!redoEnabled}
            onClick={redo}>
            <GrRedo style={{height: '1.5rem', width: '1.75rem'}} />
          </Button>
        </span>
      </Tooltip>
    </div>
  );
}

export default HistoryActions;
