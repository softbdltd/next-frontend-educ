import Konva from 'konva';
import React from 'react';
import {useRecoilValue} from 'recoil';
import {Slider} from '@mui/material';
import {ImageConfig} from '../../../interfaces/Shape';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import SideMenuSetting from '../../ui/SideMenuSetting';
import {Filter} from 'konva/lib/Node';

interface Props {
  elementId: string;
}

function ImageBlurSetting({elementId}: Props) {
  const {updateElementProps} = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<ImageConfig>(elementId),
  );

  // TODO: maybe save filter as string in template and let renderer handle conversion
  const handleChangeBlur = async (blurRadius: number) => {
    let filters: Filter[] | undefined = undefined;

    const hasBlurFilter = elementProps.filters?.includes(Konva.Filters.Blur);

    if (blurRadius > 0 && !hasBlurFilter) {
      filters = [...(elementProps.filters ?? []), Konva.Filters.Blur];
    } else if (!blurRadius && hasBlurFilter) {
      filters = elementProps.filters?.filter(
        (filter) => filter !== Konva.Filters.Blur,
      );
    }

    updateElementProps<ImageConfig>(
      elementId,
      filters
        ? {
            blurRadius,
            filters,
          }
        : {blurRadius},
    );
  };

  const blurRadius = elementProps.blurRadius;

  return (
    <>
      <SideMenuSetting label='Blur'>
        <div className='single-property-slider-input'>
          <Slider
            max={20}
            value={blurRadius}
            step={1}
            onChange={(event, value: number | number[]) => {
              event.preventDefault();
              handleChangeBlur(value as number);
            }}
          />
          <span className='slider-container-value'>{blurRadius}px</span>
        </div>
      </SideMenuSetting>
    </>
  );
}

export default ImageBlurSetting;
