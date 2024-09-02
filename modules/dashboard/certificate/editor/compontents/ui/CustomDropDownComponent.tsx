import {
  createTheme, List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem, ThemeProvider
} from "@mui/material";
import React from "react";

interface Props {
  options: Array<any>;
  inputValue?: string | number;
  title: string;
  selectedIndex: number;
  onChangeIndex: (index: number) => void;
  style?: {};
}

export default function CustomDropDownComponent({
  options,
  inputValue,
  title,
  selectedIndex,
  onChangeIndex,
  style = {},
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  // const handleMenuItemClick = (
  //   event: React.MouseEvent<HTMLElement>,
  //   index: number
  // ) => {
  //   event.preventDefault();
  //   onChangeIndex(index);

  // };

  const theme = createTheme({
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            width: "100%",
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            fontsize: "3rem",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <List
        component="nav"
        sx={{
          bgcolor: "rgb(237, 237, 237)",
          borderRadius: "4px",
          borderWidth: "1px",
          borderColor: "black",
          padding: "0",
        }}
      >
        <ListItem button onClick={handleClickListItem}>
          <ListItemText secondary={`${inputValue}`} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {options.map((value, index) => (
          <MenuItem
            key={`${title}-${index}`}
            selected={index === selectedIndex}
            onClick={(event) => {
              onChangeIndex(index);
              setAnchorEl(null);
            }}
          >
            <span style={style}>{value}</span>
          </MenuItem>
        ))}
      </Menu>
    </ThemeProvider>
  );
}
