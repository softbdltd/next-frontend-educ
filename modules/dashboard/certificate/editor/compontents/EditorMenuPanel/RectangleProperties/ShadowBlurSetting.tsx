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

function ShadowBlurSetting({elementId}: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<ShapeConfig>(elementId),
  );

  const {updateElementProps} = useElementsDispatcher();

  const handleChangeShadowBlur = (shadowBlur: number | number[]) => {
    if (!(shadowBlur instanceof Array)) {
      updateElementProps<ShapeConfig>(elementId, {shadowBlur});
    }
  };

  const shadowBlur = elementProps.shadowBlur ?? 0;

  return (
    <SideMenuSetting label='Shadow' htmlFor='input--rect-shadow'>
      <div className='single-property-slider-input'>
        <Slider
          min={0}
          max={10}
          value={shadowBlur}
          step={0.5}
          onChange={(event, value: number | number[]) => {
            event.preventDefault();
            handleChangeShadowBlur(value);
          }}
        />
        <span className='slider-container-value'>{shadowBlur}</span>
      </div>
    </SideMenuSetting>
  );
}

export default ShadowBlurSetting;
