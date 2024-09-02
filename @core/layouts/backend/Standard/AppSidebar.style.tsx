import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

const PREFIX = 'AppSidebar';

export const classes = {
  container: `${PREFIX}-container`,
  sidebarBg: `${PREFIX}-sidebarBg`,
  scrollAppSidebar: `${PREFIX}-scrollAppSidebar`,
  drawerScrollAppSidebar: `${PREFIX}-drawerScrollAppSidebar`,
  sidebarStandard: `${PREFIX}-sidebarStandard`,
};

export const StyledBox = styled(Box)(({theme}) => {
  return {
    [`&.${classes.container}`]: {
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      position: 'relative',
      top: 0,
      left: 0,
      width: '19rem',
      maxHeight: '100vh',
      [theme.breakpoints.up('md')]: {
        position: 'fixed',
      },
      [theme.breakpoints.up('xl')]: {
        width: '21.6rem',
      },
    },
    [`& .${classes.scrollAppSidebar}`]: {
      paddingTop: 8,
      paddingBottom: 20,
      height: 'calc(100vh - 50px) !important',

      /*[theme.breakpoints.up('xl')]: {
        height: 'calc(100vh - 65px) !important',
      },*/
    },
  };
});

export const StyledDrawer = styled(Drawer)(({theme}) => {
  return {
    [`& .${classes.container}`]: {
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      position: 'relative',
      top: 0,
      left: 0,
      width: '19rem',
      maxHeight: '100vh',
      [theme.breakpoints.up('lg')]: {
        position: 'fixed',
      },
      [theme.breakpoints.up('xl')]: {
        width: '21.6rem',
      },
    },
    [`& .${classes.scrollAppSidebar}`]: {
      paddingTop: 8,
      paddingBottom: 20,
      height: 'calc(100vh - 50px) !important',

      /*[theme.breakpoints.up('xl')]: {
        height: 'calc(100vh - 65px) !important',
      },*/
    },
    [`& .${classes.drawerScrollAppSidebar}`]: {
      paddingTop: 8,
      paddingBottom: 20,
      height: 'calc(100vh - 58px) !important',

      [theme.breakpoints.up('xl')]: {
        height: 'calc(100vh - 65px) !important',
      },
    },
    [`& .${classes.sidebarStandard}`]: {
      height: '100%',
      width: '100%',
      color: 'white',
      overflow: 'hidden',
    },
  };
});
