import {styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import {Container} from '@mui/material';

const PREFIX = 'AppHeader';

export const classes = {
  educTitle: `${PREFIX}-educTitle`,
  localizationTitle: `${PREFIX}-localizationTitle`,
  menuItem: `${PREFIX}-menuItem`,
  menuItemMobile: `${PREFIX}-menuItemMobile`,
};

export const StyledContainer = styled(Container)(({theme}) => ({
  padding: '10px 0',
  height: 'auto',
  zIndex: 10,
  [theme.breakpoints.up('md')]: {
    height: '80px',
  },
  [`& .${classes.educTitle}`]: {
    fontWeight: '600',
    lineHeight: '23.44px',
    maxWidth: '500px',
    color: '#0F0F0F',
  },

  [`& .${classes.localizationTitle}`]: {
    // fontSize: '1rem',
    color: '#969796',
  },
}));

export const StyledAppBar = styled(AppBar)(({theme}) => ({
  background: theme.palette.primary.main,
  height: '50px',

  [`& .${classes.menuItem}`]: {
    fontSize: '1.12rem',
    color: '#FFFFFF',
    '&>a': {
      display: 'flex',
    },
    '& .active': {
      fontWeight: 'bold',
    },
    '&:hover': {
      transition: 'all .7s ease',
      transform: 'scale(1.2)',
    },
  },

  [`& .${classes.menuItemMobile}`]: {
    padding: '18px 20px 18px 12px',
    '&>a': {
      display: 'flex',
    },
    '& .active': {
      color: theme.palette.primary.main,
    },
  },
}));
