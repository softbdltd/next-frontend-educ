import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { Tooltip, Slider, Popper, ClickAwayListener } from "@mui/material";
import { fromHex, toHex } from "../../utils/color";

interface Props {
  id: string;
  rgba?: RGBColor;
  onChange: (rgba: RGBColor) => void;
  disableAlpha?: boolean;
  children?: React.ReactNode;
}

function PanelColorPicker({
  id,
  rgba,
  disableAlpha,
  onChange,
  children,
}: Props) {
  const color = rgba && toHex(rgba);
  const opacity = rgba?.a;
  const percentageOpacity = Math.round((opacity ?? 1) * 100);
  const [inputValue, setInputValue] = useState(color);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClickAway = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleChangeOpacity = (value: number | number[]) => {
    if (!(value instanceof Array)) {
      if (rgba) {
        onChange({ ...rgba, a: value / 100 });
      }
    }
  };
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    event.preventDefault();
    handleChangeOpacity(newValue);
  };

  const handleChangeColor = useCallback(
    ({ rgb }: ColorResult) => {
      onChange(rgb);
    },
    [onChange]
  );

  const handleChangeInputValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);

      onChange(fromHex(e.target.value, opacity));
    },
    [onChange, opacity]
  );

  const handleBlurInput = useCallback(() => {
    const lowercaseHex = inputValue?.toLowerCase();

    if (lowercaseHex === color) {
      return;
    }

    if (lowercaseHex) {
      onChange(fromHex(lowercaseHex, opacity));
    } else if (color) {
      setInputValue(color);
    }
  }, [inputValue, color, onChange, opacity]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        className={`panel-color-picker-container ${
          open ? "panel-color-picker-container-open" : ""
        }`}
      >
        <div className="panel-color-picker-inner">
          <label
            htmlFor={id}
            className="panel-color-picker-label"
            onClick={handleClick}
          >
            Color
          </label>
          <input
            id={id}
            className="panel-color-picker-input"
            placeholder="#000000"
            onBlur={handleBlurInput}
            value={inputValue}
            disabled
            onChange={handleChangeInputValue}
          />
          <div className="panel-color-picker-tooltip">
            <Tooltip title="Pick a Color" placement="top" arrow>
              <button
                id={`button-${id}`}
                type="button"
                style={{ backgroundColor: color }}
                className="panel-color-picker-button"
                onClick={handleClick}
              />
            </Tooltip>

            <Popper open={open} anchorEl={anchorEl} placement={"bottom-start"}>
              <SketchPicker
                disableAlpha={disableAlpha}
                styles={{
                  default: {
                    picker: {
                      boxShadow: "inherit",
                      borderRadius: "inherit",
                      borderColor: "inherit",
                    },
                  },
                }}
                color={rgba}
                onChange={handleChangeColor}
              />
            </Popper>
          </div>
        </div>

        {!disableAlpha && (
          <div className="slider-container-item">
            <span className="slider-container-label">Opacity</span>
            <Slider
              max={100}
              value={percentageOpacity}
              step={1}
              onChange={handleSliderChange}
            />
            <span className="slider-container-value">{percentageOpacity}%</span>
          </div>
        )}
        {children}
      </div>
    </ClickAwayListener>
  );
}

export default PanelColorPicker;
