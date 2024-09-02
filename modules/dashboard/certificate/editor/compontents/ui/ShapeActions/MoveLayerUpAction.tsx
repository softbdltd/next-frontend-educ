import {HiOutlineArrowUp} from 'react-icons/hi';
import {last} from 'ramda';
import React from 'react';
import {useRecoilValue} from 'recoil';
import {Tooltip} from '@mui/material';
import {elementIdsState} from '../../../state/atoms/template';
import useElementsDispatcher from './../../../state/dispatchers/elements';
import Button from './../Button';

interface Props {
  elementId: string;
}

function MoveLayerUpAction({elementId}: Props) {
  const elementIds = useRecoilValue(elementIdsState);
  const {reorderElement} = useElementsDispatcher();

  const handleMoveUpClick = () => {
    reorderElement(elementId, 1);
  };

  const moveUpDisabled = last(elementIds) === elementId;

  return (
    <Tooltip title='Move up' className='flex'>
      <span className='tooltip-button-container'>
        <Button
          type={'secondary'}
          onClick={handleMoveUpClick}
          className={'shape-action-button'}
          disabled={moveUpDisabled}>
          <HiOutlineArrowUp style={{height: '1rem', width: '1rem'}} />
        </Button>
      </span>
    </Tooltip>
  );
}

export default MoveLayerUpAction;
