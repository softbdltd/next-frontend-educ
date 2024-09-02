import React from 'react';
import {RGBColor} from 'react-color';
import {useRecoilValue} from 'recoil';
import {Slider} from '@mui/material';
import {fromRgba, toRgba} from '../../../utils/color';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import PanelColorPicker from '../../ui/PanelColorPicker';
import SideMenuSetting from '../../ui/SideMenuSetting';
import {isString} from 'util';
import {LineConfig} from 'konva/lib/shapes/Line';

interface Props {
  elementId: string;
}

function LineStrokeSetting({elementId}: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<LineConfig>(elementId),
  );

  const {updateElementProps} = useElementsDispatcher();

  const handleChangeColor = (color: RGBColor) => {
    updateElementProps<LineConfig>(elementId, {stroke: toRgba(color)});
  };

  const handleChangeStrokeWidth = (strokeWidth: number | number[]) => {
    if (!(strokeWidth instanceof Array)) {
      updateElementProps<LineConfig>(elementId, {strokeWidth});
    }
  };

  const strokeWidth = elementProps.strokeWidth ?? 0;

  return (
    <SideMenuSetting label='Stroke' htmlFor='input-stroke-color'>
      <PanelColorPicker
        rgba={
          elementProps.stroke && isString(elementProps.stroke)
            ? fromRgba(elementProps.stroke)
            : undefined
        }
        id='input-stroke-color'
        onChange={handleChangeColor}>
        <div className='slider-container-item'>
          <span className='slider-container-label'>Width</span>
          <Slider
            min={2}
            max={10}
            value={strokeWidth}
            step={0.5}
            onChange={(event, value: number | number[]) => {
              event.preventDefault();
              handleChangeStrokeWidth(value);
            }}
          />
          <span className='slider-container-value'>{strokeWidth}px</span>
        </div>
      </PanelColorPicker>
    </SideMenuSetting>
  );
}

export default LineStrokeSetting;
