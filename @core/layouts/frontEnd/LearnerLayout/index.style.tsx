import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';

const PREFIX = 'LayoutLayout';

export const classes = {
  appMain: `${PREFIX}-appMain`,
  mainContent: `${PREFIX}-mainContent`,
  mainContainer: `${PREFIX}-mainContainer`,
  boxedLayout: `${PREFIX}-boxedLayout`,
};

export const StyledBox = styled(Box)(({theme}) => {
  return {
    [`&.${classes.appMain}`]: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      // backgroundColor: theme.palette.background.default,
      backgroundColor: '#f7fafc',
      '&.appMainHor': {
        '& .customizerOption': {
          position: 'fixed',
          top: 205,
          [theme.breakpoints.up('xl')]: {
            top: 225,
          },
        },
        '&.appMainFixedFooter': {
          paddingBottom: 48,
          [theme.breakpoints.up('xl')]: {
            paddingBottom: 58,
          },
          '& .footer': {
            borderTop: 'solid 1px',
            borderTopColor: theme.palette.grey[200],
          },
        },
      },
      '& .footer': {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        [theme.breakpoints.up('md')]: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
      '& .footerContainer': {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 16,
        paddingRight: 16,
        [theme.breakpoints.up('lg')]: {
          maxWidth: 1140,
        },
        [theme.breakpoints.up('xl')]: {
          maxWidth: 1720,
        },
      },
    },
    [`& .${classes.mainContent}`]: {
      flex: 1,
      display: 'flex',
    },
    [`& .${classes.mainContainer}`]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      '& > .scrollbar-container': {
        display: 'flex',
        flexDirection: 'column',
        '& > div': {
          marginBottom: 0,
        },
      },
      marginBottom: '20px',
    },
    [`& .${classes.boxedLayout}`]: {
      [theme.breakpoints.up('lg')]: {
        maxWidth: 1260,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.12)',
        '& .app-sidebar': {
          position: 'absolute',
        },
        '& .fixed-footer': {
          maxWidth: 1260,
          marginLeft: 'auto',
          marginRight: 'auto',
          right: 0,
        },
        '& $mainContent': {
          width: '100%',
          flex: 'auto',
        },
        '& $mainContainer': {
          width: '100%',
        },
        '& .grid-btn': {
          fontSize: 11,
        },
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: 1680,
        '& $mainContent': {
          width: '100%',
        },
        '& .fixed-footer': {
          maxWidth: 1680,
        },
      },
    },
  };
});
