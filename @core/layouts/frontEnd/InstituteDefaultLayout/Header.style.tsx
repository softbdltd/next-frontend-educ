import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';

const PREFIX = 'Header';

export const classes = {
  appBar: `${PREFIX}-appBar`,
  logoArea: `${PREFIX}-logoArea`,
  header: `${PREFIX}-header`,
  headerHalf: `${PREFIX}-headerHalf`,
  headerHalfLogo: `${PREFIX}-headerHalfLogo`,
  headerMain: `${PREFIX}-headerMain`,
  headerMainFlex: `${PREFIX}-headerMainFlex`,
  headerFixedHeight: `${PREFIX}-headerFixedHeight`,
  headerMenu: `${PREFIX}-headerMenu`,
  headerMenuGroup: `${PREFIX}-headerMenuGroup`,
  menuButton: `${PREFIX}-menuButton`,
  grow: `${PREFIX}-grow`,
  sectionDesktop: `${PREFIX}-sectionDesktop`,
  sectionMobile: `${PREFIX}-sectionMobile`,
  mobileMenuButton: `${PREFIX}-mobileMenuButton`,
  menuIcons: `${PREFIX}-menuIcons`,
  menuItem: `${PREFIX}-menuItem`,
  firstMenuItem: `${PREFIX}-firstMenuItem`,
  menuItemActive: `${PREFIX}-menuItemActive`,
  menuItemAction: `${PREFIX}-menuItemAction`,
  menuItemMobile: `${PREFIX}-menuItemMobile`,
  headerNav: `${PREFIX}-headerNav`,
  pointer: `${PREFIX}-pointer`,
  languageSwitcher: `${PREFIX}-languageSwitcher`,
  menuItemRegOrLogin: `${PREFIX}-menuItemRegOrLogin`,
  logoInstitute: `${PREFIX}-logoInstitute`,
  instituteName: `${PREFIX}-instituteName`,
};

const headerFixedHeight = {
  height: 60,
  minHeight: 60,
  boxSizing: 'border-box',
};

export const StyledBox = styled(Box)(({theme}) => ({
  width: '100%',
  minHeight: 80,
  margin: '0px auto',

  [`& .${classes.logoArea}`]: {
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },

  [`& .${classes.headerHalf}`]: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    margin: 'auto',
    color: theme.palette.grey[800],
    [theme.breakpoints.up('md')]: {
      margin: '0px 16px 0px 0px',
      justifyContent: 'unset',
      textAlign: 'end',
    },
  },

  [`& .${classes.headerHalfLogo}`]: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      margin: '0px',
      justifyContent: 'unset',
      textAlign: 'end',
    },
  },

  [`& .${classes.menuIcons}`]: {
    height: '0.6em',
    fontSize: '2rem',
  },

  [`& .${classes.logoInstitute}`]: {
    width: '100%',
    height: 48,
    objectFit: 'contain',
  },

  [`& .${classes.instituteName}`]: {
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      marginLeft: '16px',
    },
  },
}));

export const StyledAppBar = styled(AppBar)(({theme}) => ({
  // boxShadow: '4px 3px 4px 0px rgba(0,0,0,0.12)',
  boxShadow: 'none',

  [`& .${classes.headerMain}`]: {
    minHeight: 56,
    paddingRight: 0,
    paddingLeft: 0,
    [theme.breakpoints.up('sm')]: {
      minHeight: 70,
    },
    backgroundColor: theme.palette.primary.main,
    // maxWidth: theme.breakpoints.values.xl,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '100%',
  },

  [`& .${classes.headerMainFlex}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    padding: 0,
    width: '100%',
  },

  [`& .${classes.headerFixedHeight}`]: {
    ...headerFixedHeight,
  },

  [`& .${classes.headerMenu}`]: {
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    justifyContent: 'space-between',
    display: 'flex',
  },

  [`& .${classes.headerMenuGroup}`]: {
    ...headerFixedHeight,
    justifyContent: 'center',
    display: 'flex',
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },

  [`& .${classes.sectionDesktop}`]: {
    display: 'none',
    width: '100%',
    maxWidth: theme.breakpoints.values.xl,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },

  [`& .${classes.sectionMobile}`]: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 'auto',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  [`& .${classes.mobileMenuButton}`]: {
    color: theme.palette.primary.contrastText,
  },

  [`& .${classes.menuIcons}`]: {
    height: '0.6em',
    fontSize: '2rem',
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.6rem',
    },
  },

  [`& .${classes.menuItem}`]: {
    ...headerFixedHeight,
    display: 'flex',
    alignItems: 'center',
    padding: '20px 10px',
    fontSize: '1rem',
    color: theme.palette.primary.contrastText,
    '&.active': {
      backgroundColor: theme.palette.primary.light,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: '1rem',
    },
  },

  [`& .${classes.firstMenuItem}`]: {
    ...headerFixedHeight,
    display: 'flex',
    alignItems: 'center',
    padding: '20px 10px',
    fontSize: '1rem',
    color: theme.palette.primary.contrastText,
    '&.active': {
      backgroundColor: theme.palette.primary.light,
      // paddingLeft: 10,
    },
  },

  [`& .${classes.menuItemActive}`]: {
    backgroundColor: theme.palette.primary.light,
  },

  [`& .${classes.menuItemAction}`]: {
    backgroundColor: theme.palette.warning.main,
  },

  [`& .${classes.menuItemMobile}`]: {
    padding: '18px 20px 18px 12px',
    '& .active': {
      color: theme.palette.primary.main,
    },
  },

  [`& .${classes.headerNav}`]: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.grey[800],
    '& .navbarNav': {
      display: 'flex',
      padding: 0,
      marginLeft: -16,
      marginRight: -16,
      [theme.breakpoints.up('lg')]: {
        marginLeft: -20,
        marginRight: -20,
      },
    },
    '& .navItem': {
      width: 'auto',
      cursor: 'pointer',
      [theme.breakpoints.up('lg')]: {
        paddingLeft: 20,
        paddingRight: 20,
      },
      '&.active': {
        color: theme.palette.secondary.main,
        '& .navLinkIcon': {
          color: theme.palette.secondary.main,
        },
      },
    },
    '& .navLinkIcon': {
      marginRight: 10,
      color: theme.palette.grey[800],
      fontSize: 20,
    },
  },

  [`& .${classes.pointer}`]: {
    cursor: 'pointer',
  },

  [`& .${classes.languageSwitcher}`]: {
    height: '100%',
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },

  [`& .${classes.menuItemRegOrLogin}`]: {
    background: theme.palette.warning.main,
    color: theme.palette.primary.contrastText,
    width: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const StyledMenu = styled(Menu)(({theme}) => ({
  [`& .${classes.menuItemMobile}`]: {
    '& .active': {
      color: theme.palette.primary.main,
    },
    [`& .${classes.menuIcons}`]: {
      verticalAlign: 'bottom',
      marginRight: '5px',
    },
  },
}));
