import React from 'react';
import {EditorPanel} from '../../interfaces/Editor';
import ShapeActions from '../ui/ShapeActions/ShapeActions';
import SideMenuPanel from '../ui/SideMenuPanel';
import CornerRadiusSetting from './RectangleProperties/CornerRadiusSetting';
import ShadowBlurSetting from './RectangleProperties/ShadowBlurSetting';
import StrokeColorSetting from './RectangleProperties/StrokeColorSetting';
import StrokeWidthSetting from './RectangleProperties/StrokeWidthSetting';

interface Props {
  elementId: string;
}

function RectanglePropertiesPanel({elementId}: Props) {
  return (
    <SideMenuPanel
      title='Rect'
      previous={EditorPanel.Text}
      actions={<ShapeActions elementId={elementId} />}>
      <StrokeColorSetting elementId={elementId} />
      <ShadowBlurSetting elementId={elementId} />
      <CornerRadiusSetting elementId={elementId} />
      <StrokeWidthSetting elementId={elementId} />
    </SideMenuPanel>
  );
}

export default RectanglePropertiesPanel;
