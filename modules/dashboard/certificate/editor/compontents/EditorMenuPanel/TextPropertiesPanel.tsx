import React from 'react';
import {EditorPanel} from '../../interfaces/Editor';
import SideMenuPanel from '../ui/SideMenuPanel';
import FontStyleSetting from './TextProperties/FontStyleSetting';
import TextAlignmentSetting from './TextProperties/TextAlignmentSetting';
import TextContentsSetting from './TextProperties/TextContentSetting';
import TextFillSetting from './TextProperties/TextFillSetting';
import TextStrokeSetting from './TextProperties/TextStrokeSetting';
import TextShadowSetting from './TextProperties/TextShadowSetting';
import LineHeightSetting from './TextProperties/LineHeightSetting';
import TextSizeSetting from './TextProperties/TextSizeSetting';
import ShapeActions from '../ui/ShapeActions/ShapeActions';
import {activePanelState} from '../../state/atoms/editor';
import {useRecoilValue} from 'recoil';

interface Props {
  elementId: string;
}

function TextPropertiesPanel({elementId}: Props) {
  const activePanel = useRecoilValue(activePanelState);

  return (
    <SideMenuPanel
      title={activePanel === EditorPanel.InputProperties ? 'Input' : 'Text'}
      previous={
        activePanel === EditorPanel.InputProperties
          ? EditorPanel.Input
          : EditorPanel.Text
      }
      actions={<ShapeActions elementId={elementId} />}>
      {activePanel === EditorPanel.TextProperties && (
        <TextContentsSetting elementId={elementId} />
      )}
      <div className='text-property-panel-inner'>
        <FontStyleSetting elementId={elementId} />
        <TextSizeSetting elementId={elementId} />
      </div>
      <div className='text-property-panel-inner'>
        <TextAlignmentSetting elementId={elementId} />
        <LineHeightSetting elementId={elementId} />
      </div>
      <TextFillSetting elementId={elementId} />
      <TextStrokeSetting elementId={elementId} />
      <TextShadowSetting elementId={elementId} />
    </SideMenuPanel>
  );
}

export default TextPropertiesPanel;
