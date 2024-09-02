import InputIcon from '@mui/icons-material/Input';
import React from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {EditorPanel} from '../../../interfaces/Editor';
import {activePanelState} from '../../../state/atoms/editor';
import {isEitherPanelActiveSelector} from '../../../state/selectors/editor';
import SideMenuButton from '../../ui/SideMenuButton';

function InputToolButton() {
  const setActivePanel = useSetRecoilState(activePanelState);
  const selected = useRecoilValue(
    isEitherPanelActiveSelector([
      EditorPanel.Input,
      EditorPanel.InputProperties,
    ]),
  );

  const handleClick = () => {
    setActivePanel(EditorPanel.Input);
  };

  return (
    <SideMenuButton onClick={handleClick} selected={selected} icon={InputIcon}>
      Input
    </SideMenuButton>
  );
}

export default InputToolButton;
