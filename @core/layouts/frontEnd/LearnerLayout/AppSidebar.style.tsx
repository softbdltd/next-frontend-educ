import {ThemeMode} from '../../../../shared/constants/AppEnums';
import {styled} from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import {useContext} from 'react';
import AppContextPropsType from '../../../../redux/types/AppContextPropsType';
import {AppContext} from '../../../../@core';

const PREFIX = 'AppSidebar';

export const classes = {
  drawerContainer: `${PREFIX}-drawerContainer`,
  sidebarBg: `${PREFIX}-sidebarBg`,
  drawerScrollAppSidebar: `${PREFIX}-drawerScrollAppSidebar`,
};

export const StyledDrawer = styled(Drawer)(({theme}) => {
  const {sidebarColors} = useContext<AppContextPropsType>(AppContext);

  return {
    [`& .${classes.drawerContainer}`]: {
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      maxHeight: '100vh',
      width: '19rem',
      [theme.breakpoints.up('xl')]: {
        width: '21.6rem',
      },
    },
    [`& .${classes.sidebarBg}`]: {
      overflow: 'hidden',
      backgroundColor: (props: {themeMode: ThemeMode}) =>
        props.themeMode === ThemeMode.SEMI_DARK
          ? sidebarColors?.bgColor
          : props.themeMode === ThemeMode.LIGHT
          ? 'white'
          : '#313541',
    },
    [`& .${classes.drawerScrollAppSidebar}`]: {
      paddingTop: 8,
      paddingBottom: 32,
      height: 'calc(100vh - 58px) !important',
    },
  };
});
