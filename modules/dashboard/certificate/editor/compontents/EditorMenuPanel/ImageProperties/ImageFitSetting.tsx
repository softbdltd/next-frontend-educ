import React, {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {ImageConfig, ImageFit} from '../../../interfaces/Shape';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import SideMenuSetting from '../../ui/SideMenuSetting';
import CustomDropDownComponent from './../../ui/CustomDropDownComponent';

interface Props {
  elementId: string;
}

export const options: {label: string; value: ImageFit}[] = [
  {
    label: 'Fill',
    value: 'fill',
  },
  {
    label: 'Scale',
    value: 'scale',
  },
];
function ImageFitSetting({elementId}: Props) {
  const {updateElementProps} = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<ImageConfig>(elementId),
  );

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const [inputValue, setInputValue] = useState<string>(
    elementProps.imageFit?.toUpperCase(),
  );

  useEffect(() => {
    setInputValue(
      elementProps.imageFit?.charAt(0).toUpperCase() +
        elementProps.imageFit?.substring(1),
    );
  }, [elementProps.imageFit]);

  const onChangeIndex = (index: number) => {
    setSelectedIndex(index);
    handleChangeInput(index);
  };

  const handleChange = (imageFit: ImageFit) => {
    updateElementProps<ImageConfig>(elementId, {imageFit});
  };

  const handleChangeInput = (index: number) => {
    const value = options[index].value;
    setInputValue(value);
    if (value !== elementProps.imageFit) {
      handleChange(value);
    }
  };

  return (
    <SideMenuSetting label='Image Fit'>
      <CustomDropDownComponent
        options={options.map((option) => option.label)}
        title={'image-fit'}
        inputValue={inputValue}
        selectedIndex={selectedIndex}
        onChangeIndex={onChangeIndex}
      />
    </SideMenuSetting>
  );
}

export default ImageFitSetting;
