import React, {useState, useEffect, useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {ratioState} from '../../state/atoms/editor';
import SideMenuSetting from './../ui/SideMenuSetting';
import CustomDropDownComponent from './../ui/CustomDropDownComponent';
import useKeyboardCommand from './../../hooks/useKeyboardCommand';
import useRatioControl from '../../hooks/useRatioControl';
import ZoomActions from './ZoomActions';
const optionsString = ['200%', '125%', '100%', '75%', '50%', '25%', '10%'];
const optionsNum = [2, 1.25, 1, 0.75, 0.5, 0.25, 0.1];

function EditorZoomControls() {
  const [zoom, setZoom] = useRecoilState(ratioState);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [inputValue, setInputValue] = useState<string>(
    `${String(Math.floor(zoom * 100))}%`,
  );
  const {fitToScreen} = useRatioControl();

  const increaseZoom = useCallback(() => {
    if (zoom <= 2) {
      let newZoom = zoom + 0.1;
      if (newZoom > 2) {
        setZoom(2);
      } else {
        setZoom(newZoom);
      }
    }
  }, [zoom]);

  const decreaseZoom = useCallback(() => {
    let newZoom = zoom - 0.1;
    if (newZoom < 0.15) {
      setZoom(0.15);
    } else {
      setZoom(newZoom);
    }
  }, [zoom]);

  useKeyboardCommand(
    'ctrl+f',
    fitToScreen,
    process.browser ? document : undefined,
  );

  useKeyboardCommand(
    'ctrl+i',
    increaseZoom,
    process.browser ? document : undefined,
  );

  useKeyboardCommand(
    'ctrl+d',
    decreaseZoom,
    process.browser ? document : undefined,
  );

  useEffect(() => {
    setInputValue(`${String(Math.floor(zoom * 100))}%`);
  }, [zoom]);

  const onChangeIndex = (index: number) => {
    setSelectedIndex(index);
    handleChangeInput(index);
  };

  const handleChange = (scale: number) => {
    setZoom(scale);
  };

  const handleChangeInput = (index: number) => {
    const value = optionsString[index];
    setInputValue(value);
    const valueInt = optionsNum[index];
    handleChange(valueInt);
  };

  return (
    <>
      <SideMenuSetting>
        <CustomDropDownComponent
          options={optionsString}
          title={'zoom-control'}
          inputValue={inputValue}
          selectedIndex={selectedIndex}
          onChangeIndex={onChangeIndex}
        />
      </SideMenuSetting>
      <ZoomActions increaseZoom={increaseZoom} decreaseZoom={decreaseZoom} />
    </>
  );
}

export default EditorZoomControls;
