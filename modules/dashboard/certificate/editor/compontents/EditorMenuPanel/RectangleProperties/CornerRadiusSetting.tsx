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

function CornerRadiusSetting({elementId}: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<ShapeConfig>(elementId),
  );

  const {updateElementProps} = useElementsDispatcher();

  const handleChangeCornerRadius = (cornerRadius: number | number[]) => {
    if (!(cornerRadius instanceof Array)) {
      updateElementProps<ShapeConfig>(elementId, {cornerRadius});
    }
  };

  const cornerRadius = elementProps.cornerRadius ?? 0;

  return (
    <SideMenuSetting label='Corner Radius' htmlFor='input--rect-radius'>
      <div className='single-property-slider-input'>
        <Slider
          min={0}
          max={100}
          value={cornerRadius}
          step={1}
          onChange={(event, value: number | number[]) => {
            event.preventDefault();
            handleChangeCornerRadius(value);
          }}
        />
        <span className='slider-container-value'>{cornerRadius}</span>
      </div>
    </SideMenuSetting>
  );
}

export default CornerRadiusSetting;
