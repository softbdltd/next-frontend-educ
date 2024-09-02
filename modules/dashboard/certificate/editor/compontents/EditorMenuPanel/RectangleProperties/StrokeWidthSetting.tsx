import React from 'react';
import {useRecoilValue} from 'recoil';
import {Slider} from '@mui/material';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import SideMenuSetting from '../../ui/SideMenuSetting';
import {ShapeConfig} from 'konva/lib/Shape';

interface Props {
  elementId: string;
}

function StrokeWidthSetting({elementId}: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<ShapeConfig>(elementId),
  );

  const {updateElementProps} = useElementsDispatcher();

  const handleChangeStrokeWidth = (strokeWidth: number | number[]) => {
    if (!(strokeWidth instanceof Array)) {
      updateElementProps<ShapeConfig>(elementId, {strokeWidth});
    }
  };

  const strokeWidth = elementProps.strokeWidth ?? 1;

  return (
    <SideMenuSetting label='Stroke Width' htmlFor='input--rect-radius'>
      <div className='single-property-slider-input'>
        <Slider
          min={0.5}
          max={4}
          value={strokeWidth}
          step={0.5}
          onChange={(event, value: number | number[]) => {
            event.preventDefault();
            handleChangeStrokeWidth(value);
          }}
        />
        <span className='slider-container-value'>{strokeWidth}</span>
      </div>
    </SideMenuSetting>
  );
}

export default StrokeWidthSetting;
