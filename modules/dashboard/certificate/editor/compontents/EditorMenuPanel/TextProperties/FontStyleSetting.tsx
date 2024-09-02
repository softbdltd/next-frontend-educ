import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import Button from "../../ui/Button";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import classNames from "../../../utils/className";
import { TextConfig } from "../../../interfaces/Shape";
import useElementsDispatcher from "../../../state/dispatchers/elements";
import { elementPropsSelector } from "../../../state/selectors/elements";
import SideMenuSetting from "../../ui/SideMenuSetting";

interface Props {
  elementId: string;
}

function FontStyleSetting({ elementId }: Props) {
  const { updateElementProps } = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId)
  );

  const styles = useMemo(
    () => elementProps.fontStyle?.split(" "),
    [elementProps.fontStyle]
  );
  const isBold = useMemo(() => styles?.includes("bold"), [styles]);
  const isItalic = useMemo(() => styles?.includes("italic"), [styles]);
  const isUnderline = elementProps?.textDecoration === "underline";

  const onToggleBold = () => {
    updateElementProps<TextConfig>(elementId, {
      fontStyle: isBold
        ? styles?.filter((style) => style !== "bold").join(" ")
        : classNames(...(styles ?? []), "bold"),
    });
  };

  const onToggleItalic = () => {
    updateElementProps<TextConfig>(elementId, {
      fontStyle: isItalic
        ? styles?.filter((style) => style !== "italic").join(" ")
        : classNames(...(styles ?? []), "italic"),
    });
  };

  const onToggleUnderline = () => {
    updateElementProps<TextConfig>(elementId, {
      textDecoration: isUnderline ? undefined : "underline",
    });
  };

  return (
    <SideMenuSetting
      label="Style"
      className="text-property-button-param"
      noLabel
    >
      <div className="text-property-button-container">
        <Button
          type={isBold ? "accented" : "secondary"}
          className="text-property-left-button"
          onClick={onToggleBold}
          title="Bold"
        >
          <FormatBoldIcon sx={{ width: "1rem", height: "1rem" }} />
        </Button>
        <Button
          type={isItalic ? "accented" : "secondary"}
          className="text-property-center-button"
          onClick={onToggleItalic}
          title="Italic"
        >
          <FormatItalicIcon sx={{ width: "1rem", height: "1rem" }} />
        </Button>
        <Button
          type={isUnderline ? "accented" : "secondary"}
          className="text-property-right-button"
          onClick={onToggleUnderline}
          title="Underline"
        >
          <FormatUnderlinedIcon sx={{ width: "1rem", height: "1rem" }} />
        </Button>
      </div>
    </SideMenuSetting>
  );
}

export default FontStyleSetting;
