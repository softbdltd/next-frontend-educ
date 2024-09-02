import React from 'react';
import { useRecoilValue } from 'recoil';
import { EditorPanel } from '../../interfaces/Editor';
import {
  activePanelState,
  selectedElementIdState
} from '../../state/atoms/editor';
import SideMenuPanel from '../ui/SideMenuPanel';
import ElementToolPanel from './ElementMenuPanel';
import ImagePropertiesPanel from './ImagePropertiesPanel';
import ImageToolPanel from './ImageToolPanel';
import InputToolPanel from './InputMenuPanel';
import LinePropertiesPanel from './LinePropertiesPanel';
import RectanglePropertiesPanel from './RectanglePropertyPanel';
import SettingsToolPanel from './SettingsToolPanel/SettingsToolPanel';
import TextPropertiesPanel from './TextPropertiesPanel';
import TextToolPanel from './TextToolPanel';

function EditorMenuPanel() {
  const activePanel = useRecoilValue(activePanelState);
  const selectedElementId = useRecoilValue(selectedElementIdState);

  if (selectedElementId) {
    switch (activePanel) {
      case EditorPanel.TextProperties:
        return <TextPropertiesPanel elementId={selectedElementId} />;
      case EditorPanel.InputProperties:
        return <TextPropertiesPanel elementId={selectedElementId} />;
      case EditorPanel.LineProperties:
        return <LinePropertiesPanel elementId={selectedElementId} />;
      case EditorPanel.RectangleProperties:
        return <RectanglePropertiesPanel elementId={selectedElementId} />;
      case EditorPanel.ImageProperties:
        return <ImagePropertiesPanel elementId={selectedElementId} />;
    }
  }

  switch (activePanel) {
    case EditorPanel.Settings:
      return <SettingsToolPanel />;
    case EditorPanel.Text:
      return <TextToolPanel />;
    case EditorPanel.Image:
      return <ImageToolPanel />;
    case EditorPanel.Elements:
      return <ElementToolPanel />;
    case EditorPanel.Input:
      return <InputToolPanel />;
    default:
      return <SideMenuPanel />;
  }
}

export default EditorMenuPanel;
