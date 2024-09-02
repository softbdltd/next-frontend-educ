import React from "react";
import { RGBColor } from "react-color";
import { useRecoilValue } from "recoil";
import { Slider } from "@mui/material";
import { fromRgba, toRgba } from "../../../utils/color";
import { TextConfig } from "../../../interfaces/Shape";
import useElementsDispatcher from "../../../state/dispatchers/elements";
import { elementPropsSelector } from "../../../state/selectors/elements";
import PanelColorPicker from "../../ui/PanelColorPicker";
import SideMenuSetting from "../../ui/SideMenuSetting";
import { isString } from "util";

interface Props {
  elementId: string;
}

function TextStrokeSetting({ elementId }: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId)
  );

  const { updateElementProps } = useElementsDispatcher();

  const handleChangeEnabled = (strokeEnabled: boolean) => () => {
    updateElementProps<TextConfig>(elementId, { strokeEnabled });
  };

  const handleChangeColor = (color: RGBColor) => {
    updateElementProps<TextConfig>(elementId, { stroke: toRgba(color) });
  };

  const handleChangeStrokeWidth = (strokeWidth: number | number[]) => {
    if (!(strokeWidth instanceof Array)) {
      updateElementProps<TextConfig>(elementId, { strokeWidth });
    }
  };

  const strokeWidth = elementProps.strokeWidth ?? 0;

  return (
    <SideMenuSetting
      label="Stroke"
      htmlFor="input-stroke-color"
      onDelete={handleChangeEnabled(false)}
      onCreate={handleChangeEnabled(true)}
      deleted={!elementProps.strokeEnabled}
    >
      <PanelColorPicker
        rgba={
          elementProps.stroke && isString(elementProps.stroke)
            ? fromRgba(elementProps.stroke)
            : undefined
        }
        id="input-stroke-color"
        onChange={handleChangeColor}
      >
        <div className="slider-container-item">
          <span className="slider-container-label">Width</span>
          <Slider
            max={10}
            value={strokeWidth}
            step={1}
            onChange={(event, value: number | number[]) => {
              event.preventDefault();
              handleChangeStrokeWidth(value);
            }}
          />
          <span className="slider-container-value">{strokeWidth}px</span>
        </div>
      </PanelColorPicker>
    </SideMenuSetting>
  );
}

export default TextStrokeSetting;
