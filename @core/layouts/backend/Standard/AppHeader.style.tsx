import {alpha, styled} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import {ThemeStyleRadius} from '../../../../shared/constants/AppEnums';
import AppBar from '@mui/material/AppBar';

const PREFIX = 'AppHeader';

export const classes = {
  appToolbar: `${PREFIX}-appToolbar`,
  grow: `${PREFIX}-grow`,
  menuButton: `${PREFIX}-menuButton`,
  menuIcon: `${PREFIX}-menuIcon`,
  title: `${PREFIX}-title`,
  search: `${PREFIX}-search`,
  searchIcon: `${PREFIX}-searchIcon`,
  inputRoot: `${PREFIX}-inputRoot`,
  inputInput: `${PREFIX}-inputInput`,
  sectionDesktop: `${PREFIX}-sectionDesktop`,
  sectionMobile: `${PREFIX}-sectionMobile`,
  appBar: `${PREFIX}-appBar`,
  menuItemRoot: `${PREFIX}-menuItemRoot`,
  pointer: `${PREFIX}-pointer`,
  logoRoot: `${PREFIX}-logoRoot`,
};

export const StyledAppBar = styled(AppBar)(({theme}) => ({
  width: '100%',
  boxShadow: '4px 3px 4px 0px rgba(0,0,0,0.12)',
  [theme.breakpoints.up('md')]: {
    width: 'calc(100vw - 19rem)',
  },
  [theme.breakpoints.up('lg')]: {
    width: 'calc(100vw - 19rem)',
  },
  [theme.breakpoints.up('xl')]: {
    width: 'calc(100vw - 21.6rem)',
  },
}));

export const StyledToolbar = styled(Toolbar)(({theme}) => ({
  [`&.${classes.appToolbar}`]: {
    padding: 0,
    paddingLeft: 20,
    paddingRight: 20,
    minHeight: 56,
    [theme.breakpoints.up('sm')]: {
      minHeight: 50,
      maxHeight: 50,
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: 30,
      paddingRight: 30,
    },
  },

  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: 0,
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
    },
  },

  [`& .${classes.menuIcon}`]: {
    width: 35,
    height: 35,
  },

  [`& .${classes.title}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  [`& .${classes.search}`]: {
    position: 'relative',
    borderRadius: ThemeStyleRadius.STANDARD,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },

  [`& .${classes.searchIcon}`]: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.inputRoot}`]: {
    color: 'inherit',
  },

  [`& .${classes.inputInput}`]: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },

  [`& .${classes.sectionDesktop}`]: {
    height: '100%',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },

  [`& .${classes.sectionMobile}`]: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  [`& .${classes.menuItemRoot}`]: {
    padding: 0,
  },

  [`& .${classes.pointer}`]: {
    cursor: 'pointer',
  },

  [`& .${classes.logoRoot}`]: {
    verticalAlign: 'middle',
    display: 'inline-block',
    height: 30,
  },
}));
