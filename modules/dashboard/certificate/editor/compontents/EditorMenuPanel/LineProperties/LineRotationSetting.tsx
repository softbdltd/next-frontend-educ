import React from 'react';
import {useRecoilValue} from 'recoil';
import {Slider} from '@mui/material';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import SideMenuSetting from '../../ui/SideMenuSetting';
import {LineConfig} from 'konva/lib/shapes/Line';

interface Props {
  elementId: string;
}

function LineRotationSetting({elementId}: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<LineConfig>(elementId),
  );

  const {updateElementProps} = useElementsDispatcher();

  const handleChangeRotation = (rotation: number | number[]) => {
    if (!(rotation instanceof Array)) {
      updateElementProps<LineConfig>(elementId, {rotation});
    }
  };

  const rotation = elementProps?.rotation ?? 0;

  return (
    <SideMenuSetting label='Rotation' htmlFor='input-rotation'>
      <div className='single-property-slider-input'>
        <Slider
          min={0}
          max={90}
          value={rotation}
          step={5}
          onChange={(event, value: number | number[]) => {
            event.preventDefault();
            handleChangeRotation(value);
          }}
        />
        <span className='slider-container-value'>{rotation}</span>
      </div>
    </SideMenuSetting>
  );
}

export default LineRotationSetting;
