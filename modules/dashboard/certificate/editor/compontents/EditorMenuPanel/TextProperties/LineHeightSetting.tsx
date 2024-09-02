import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { TextConfig } from "../../../interfaces/Shape";
import useElementsDispatcher from "../../../state/dispatchers/elements";
import { elementPropsSelector } from "../../../state/selectors/elements";
import SideMenuSetting from "../../ui/SideMenuSetting";
import CustomDropDownComponent from "./../../ui/CustomDropDownComponent";

interface Props {
  elementId: string;
}
const options = [0.5, 0.75, 1, 1.25, 1.5];
function LineHeightSetting({ elementId }: Props) {
  const { updateElementProps } = useElementsDispatcher();
  const elementProps = useRecoilValue(
    elementPropsSelector<TextConfig>(elementId)
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [inputValue, setInputValue] = useState(elementProps.lineHeight);

  useEffect(() => {
    setInputValue(elementProps.lineHeight);
  }, [elementProps.lineHeight]);

  const onChangeIndex = (index: number) => {
    setSelectedIndex(index);
    handleChangeInput(index);
  };

  const handleChange = (lineHeight: number) => {
    updateElementProps<TextConfig>(elementId, { lineHeight });
  };

  const handleChangeInput = (index: number) => {
    const value = options[index];
    setInputValue(value);
    if (value >= 0.1 && value !== elementProps.lineHeight) {
      handleChange(value);
    }
  };

  return (
    <SideMenuSetting label="Line Height">
      <CustomDropDownComponent
        options={options}
        title={"line-height"}
        inputValue={inputValue}
        selectedIndex={selectedIndex}
        onChangeIndex={onChangeIndex}
      />
    </SideMenuSetting>
  );
}

export default LineHeightSetting;

// export default LineHeightSetting;

// <ThemeProvider theme={theme}>
//         <List
//           component="nav"
//           sx={{
//             bgcolor: "rgb(237, 237, 237)",
//             borderRadius: "4px",
//             borderWidth: "1px",
//             borderColor: "black",
//             padding: "0",
//           }}
//         >
//           <ListItem button onClick={handleClickListItem}>
//             <ListItemText secondary={`${inputValue}`} />
//             <KeyboardArrowDown
//               sx={{
//                 mr: -1,
//                 opacity: 0,
//                 transform: open ? "rotate(-180deg)" : "rotate(0)",
//                 transition: "0.2s",
//               }}
//             />
//           </ListItem>
//         </List>
//         <Menu
//           id="lock-menu"
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           MenuListProps={{
//             "aria-labelledby": "lock-button",
//             role: "listbox",
//           }}
//         >
//           {options.map((value, index) => (
//             <MenuItem
//               key={`lineheight-${value}`}
//               selected={index === selectedIndex}
//               onClick={(event) => handleMenuItemClick(event, value, index)}
//             >
//               {value}
//             </MenuItem>
//           ))}
//         </Menu>
//       </ThemeProvider>
