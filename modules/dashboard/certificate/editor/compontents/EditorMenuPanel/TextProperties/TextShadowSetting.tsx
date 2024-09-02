import React from "react";
import { RGBColor } from "react-color";
import { useRecoilValue } from "recoil";
import { Slider } from "@mui/material";
import { fromRgba, toRgba } from "./../../../utils/color";
import { TextConfig } from "../../../interfaces/Shape";
import useElementsDispatcher from "../../../state/dispatchers/elements";
import { elementPropsSelector } from "../../../state/selectors/elements";
import PanelColorPicker from "../../ui/PanelColorPicker";
import SideMenuSetting from "../../ui/SideMenuSetting";

interface Props {
  elementId: string;
}

function TextShadowSetting({ elementId }: Props) {
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId)
  );

  const { updateElementProps } = useElementsDispatcher();

  const handleChangeEnabled = (shadowEnabled: boolean) => () => {
    updateElementProps<TextConfig>(elementId, { shadowEnabled });
  };

  const handleChangeColor = (color: RGBColor) => {
    updateElementProps<TextConfig>(elementId, {
      shadowColor: toRgba(color),
    });
  };

  const handleChangeShadowBlur = (shadowBlur: number | number[]) => {
    if (!(shadowBlur instanceof Array)) {
      updateElementProps<TextConfig>(elementId, { shadowBlur });
    }
  };

  const shadowBlur = elementProps.shadowBlur ?? 0;

  return (
    <SideMenuSetting
      label="Shadow"
      htmlFor="input-shadow-color"
      onDelete={handleChangeEnabled(false)}
      onCreate={handleChangeEnabled(true)}
      deleted={!elementProps.shadowEnabled}
    >
      <PanelColorPicker
        rgba={
          elementProps.shadowColor
            ? fromRgba(elementProps.shadowColor)
            : undefined
        }
        id="input-shadow-color"
        onChange={handleChangeColor}
      >
        <div className="slider-container-item">
          <span className="slider-container-label">Blur</span>
          <Slider
            max={20}
            value={shadowBlur}
            step={1}
            onChange={(event, value: number | number[]) => {
              event.preventDefault();
              handleChangeShadowBlur(value);
            }}
          />
          <span className="slider-container-value">{shadowBlur}px</span>
        </div>
      </PanelColorPicker>
    </SideMenuSetting>
  );
}

export default TextShadowSetting;
