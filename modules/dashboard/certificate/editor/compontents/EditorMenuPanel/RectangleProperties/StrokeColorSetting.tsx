import React from 'react';
import {RGBColor} from 'react-color';
import {useRecoilValue} from 'recoil';
import {fromRgba, toRgba} from '../../../utils/color';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import PanelColorPicker from '../../ui/PanelColorPicker';
import SideMenuSetting from '../../ui/SideMenuSetting';
import {ShapeConfig} from 'konva/lib/Shape';

interface Props {
  elementId: string;
}

function StrokeColorSetting({elementId}: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<ShapeConfig>(elementId),
  );

  const {updateElementProps} = useElementsDispatcher();

  const changeColor = (color: RGBColor) => {
    updateElementProps<ShapeConfig>(elementId, {stroke: toRgba(color)});
  };

  return (
    <SideMenuSetting label='Stroke Color' htmlFor='input-fill-color'>
      <PanelColorPicker
        rgba={
          elementProps.stroke && elementProps.stroke !== 'black'
            ? fromRgba(elementProps.stroke as string)
            : {r: 0, g: 0, b: 0, a: 1}
        }
        id='input-fill-color'
        onChange={changeColor}
        disableAlpha
      />
    </SideMenuSetting>
  );
}

export default StrokeColorSetting;
