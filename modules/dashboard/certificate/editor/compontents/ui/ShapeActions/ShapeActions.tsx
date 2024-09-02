import {CgDuplicate, CgTrash} from 'react-icons/cg';
import {MdAlignHorizontalCenter, MdAlignVerticalCenter} from 'react-icons/md';
import React from 'react';
import {Tooltip} from '@mui/material';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import Button from '../Button';
import {useRecoilValue} from 'recoil';
import {elementSelector} from '../../../state/selectors/elements';
import {TextConfig} from 'konva/lib/shapes/Text';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MoveLayerUpAction from './MoveLayerUpAction';
import MoveLayerDownAction from './MoveLayerDownAction';
import {Directions} from '../../../constants';
interface Props {
  elementId: string;
}

function ShapeActions({elementId}: Props) {
  const {
    duplicateElement,
    deleteElement,
    updateElementProps,
    clearSelection,
    centeredElement,
  } = useElementsDispatcher();

  const element = useRecoilValue(elementSelector(elementId));

  const onLockedClick = () => {
    updateElementProps<TextConfig>(elementId, {
      isLocked: !element?.props.isLocked,
    });
    clearSelection();
  };
  const onDuplicateClick = () => {
    duplicateElement(elementId);
  };

  const onDeleteClick = () => {
    deleteElement(elementId);
  };

  const onCenteredClick = (direction: Directions) => {
    return () => {
      centeredElement(elementId, direction);
    };
  };

  return (
    <>
      <MoveLayerUpAction elementId={elementId} />
      <MoveLayerDownAction elementId={elementId} />
      <Tooltip title='Vertical Center' className='flex'>
        <Button
          type={'secondary'}
          onClick={onCenteredClick(Directions.Vertical)}
          className={'shape-action-button'}>
          <MdAlignHorizontalCenter style={{height: '1rem', width: '1rem'}} />
        </Button>
      </Tooltip>
      <Tooltip title='Horizontal Center' className='flex'>
        <Button
          type={'secondary'}
          onClick={onCenteredClick(Directions.Horizontal)}
          className={'shape-action-button'}>
          <MdAlignVerticalCenter style={{height: '1rem', width: '1rem'}} />
        </Button>
      </Tooltip>
      <Tooltip
        title={element?.props.isLocked ? 'Unlock Element' : 'Lock Element'}
        className='flex'>
        <Button
          type={'secondary'}
          onClick={onLockedClick}
          className={'shape-action-button'}>
          {element?.props.isLocked ? (
            <LockOutlinedIcon style={{height: '1rem', width: '1rem'}} />
          ) : (
            <LockOpenOutlinedIcon style={{height: '1rem', width: '1rem'}} />
          )}
        </Button>
      </Tooltip>
      <Tooltip title='Duplicate' className='flex'>
        <Button
          type={'secondary'}
          onClick={onDuplicateClick}
          className={'shape-action-button'}>
          <CgDuplicate style={{height: '1rem', width: '1rem'}} />
        </Button>
      </Tooltip>
      <Tooltip title='Delete' className='flex'>
        <Button
          type={'secondary'}
          onClick={onDeleteClick}
          className={'shape-action-button'}>
          <CgTrash style={{height: '1rem', width: '1rem'}} />
        </Button>
      </Tooltip>
    </>
  );
}

export default ShapeActions;
