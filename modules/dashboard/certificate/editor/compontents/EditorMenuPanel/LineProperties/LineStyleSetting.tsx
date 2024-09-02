import { LineConfig } from 'konva/lib/shapes/Line';
import React, { useMemo } from 'react';
import {
  CgBorderStyleDashed, CgBorderStyleDotted, CgBorderStyleSolid
} from 'react-icons/all';
import { useRecoilValue } from 'recoil';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import { elementPropsSelector } from '../../../state/selectors/elements';
import Button from '../../ui/Button';
import SideMenuSetting from '../../ui/SideMenuSetting';


interface Props {
  elementId: string;
}

function LineStyleSetting({elementId}: Props) {
  const {updateElementProps} = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<LineConfig>(elementId),
  );

  const areEqual = (array1: number[], array2: number[]) => {
    if (array1.length === array2.length) {
      return array1.every((element, index) => element === array2[index]);
    } else {
      return false;
    }
  };

  const lineType = useMemo(() => elementProps.dash, [elementProps.dash]);
  const isSolid = useMemo(() => lineType!.length === 0, [lineType]);
  const isDashed = useMemo(() => areEqual(lineType!, [5, 2]), [lineType]);
  const isDotted = useMemo(() => areEqual(lineType!, [1, 1]), [lineType]);

  const onClickButton = (value: number[] | []) => () => {
    updateElementProps<LineConfig>(elementId, {
      dash: value,
    });
  };

  return (
    <SideMenuSetting
      label='Style'
      className='text-property-button-param'
      noLabel>
      <div className='text-property-button-container'>
        <Button
          type={isSolid ? 'accented' : 'secondary'}
          className='line-style-left-button'
          onClick={onClickButton([])}
          title='Solid'>
          <CgBorderStyleSolid />
        </Button>
        <Button
          type={isDotted ? 'accented' : 'secondary'}
          className='line-style-center-button'
          onClick={onClickButton([2, 1])}
          title='Dotted'>
          <CgBorderStyleDotted />
        </Button>
        <Button
          type={isDashed ? 'accented' : 'secondary'}
          className='line-style-right-button'
          onClick={onClickButton([5, 2])}
          title='Dashed'>
          <CgBorderStyleDashed />
        </Button>
      </div>
    </SideMenuSetting>
  );
}

export default LineStyleSetting;
