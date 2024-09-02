import React from "react";
import { useRecoilValue } from "recoil";
import Button from "../../ui/Button";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import { TextConfig } from "../../../interfaces/Shape";
import useElementsDispatcher from "../../../state/dispatchers/elements";
import { elementPropsSelector } from "../../../state/selectors/elements";
import SideMenuSetting from "../../ui/SideMenuSetting";

interface Props {
  elementId: string;
}

function TextAlignmentSetting({ elementId }: Props) {
  const { updateElementProps } = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId)
  );

  const onChangeAlign = (align: string) => () => {
    updateElementProps<TextConfig>(elementId, {
      align,
    });
  };

  return (
    <SideMenuSetting
      label="Text alignment"
      className="text-property-button-param"
      noLabel
    >
      <div className="text-property-button-container">
        <Button
          type={elementProps.align === "left" ? "accented" : "secondary"}
          className="text-property-left-button"
          onClick={onChangeAlign("left")}
          title="Align left"
        >
          <FormatAlignLeftIcon sx={{ width: "1rem", height: "1rem" }} />
        </Button>
        <Button
          type={elementProps.align === "center" ? "accented" : "secondary"}
          className="text-property-center-button"
          onClick={onChangeAlign("center")}
          title="Align center"
        >
          <FormatAlignCenterIcon sx={{ width: "1rem", height: "1rem" }} />
        </Button>
        <Button
          type={elementProps.align === "right" ? "accented" : "secondary"}
          className="text-property-right-button"
          onClick={onChangeAlign("right")}
          title="Align right"
        >
          <FormatAlignRightIcon sx={{ width: "1rem", height: "1rem" }} />
        </Button>
      </div>
    </SideMenuSetting>
  );
}

export default TextAlignmentSetting;
