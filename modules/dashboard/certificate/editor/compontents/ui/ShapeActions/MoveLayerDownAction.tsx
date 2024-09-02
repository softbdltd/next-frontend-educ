import {HiOutlineArrowDown} from 'react-icons/hi';
import {head} from 'ramda';
import React from 'react';
import {useRecoilValue} from 'recoil';
import {Tooltip} from '@mui/material';
import {elementIdsState} from '../../../state/atoms/template';
import useElementsDispatcher from './../../../state/dispatchers/elements';
import Button from './../Button';

interface Props {
  elementId: string;
}

function MoveLayerDownAction({elementId}: Props) {
  const elementIds = useRecoilValue(elementIdsState);
  const {reorderElement} = useElementsDispatcher();

  const handleMoveDownClick = () => {
    reorderElement(elementId, -1);
  };

  const moveDownDisabled = head(elementIds) === elementId;

  return (
    <Tooltip title='Move Down' className='flex'>
      <span className='tooltip-button-container'>
        <Button
          type={'secondary'}
          onClick={handleMoveDownClick}
          className={'shape-action-button'}
          disabled={moveDownDisabled}>
          <HiOutlineArrowDown style={{height: '1rem', width: '1rem'}} />
        </Button>
      </span>
    </Tooltip>
  );
}

export default MoveLayerDownAction;
