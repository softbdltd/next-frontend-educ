import React, {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {TextConfig} from '../../../interfaces/Shape';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';
import SideMenuSetting from '../../ui/SideMenuSetting';
import CustomDropDownComponent from './../../ui/CustomDropDownComponent';

interface Props {
  elementId: string;
}
const options = [
  12, 14, 18, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 96, 144, 288,
];
function TextSizeSetting({elementId}: Props) {
  const {updateElementProps} = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId),
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [inputValue, setInputValue] = useState(elementProps.fontSize);

  useEffect(() => {
    setInputValue(elementProps.fontSize);
  }, [elementProps.lineHeight]);

  const onChangeIndex = (index: number) => {
    setSelectedIndex(index);
    handleChangeInput(index);
  };

  const handleChange = (fontSize: number) => {
    updateElementProps<TextConfig>(elementId, {fontSize});
  };

  const handleChangeInput = (index: number) => {
    const value = options[index];
    setInputValue(value);
    if (
      value >= 0.1 &&
      (!elementProps.fontSize || value !== Math.floor(elementProps.fontSize))
    ) {
      handleChange(value);
    }
  };

  return (
    <SideMenuSetting label='Font Size'>
      <CustomDropDownComponent
        options={options}
        title={'font-size'}
        inputValue={inputValue}
        selectedIndex={selectedIndex}
        onChangeIndex={onChangeIndex}
      />
    </SideMenuSetting>
  );
}

export default TextSizeSetting;
