import React from 'react';
import {styled} from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

const PREFIX = 'NotificationBar';

const classes = {
  headerTop: `${PREFIX}-headerTop`,
  headerContainer: `${PREFIX}-headerContainer`,
  alertStyle: `${PREFIX}-alertStyle`,
};

const StyledCollapse = styled(Collapse)(({theme}) => ({
  [`& .${classes.headerTop}`]: {
    borderBottom: 'solid 1px',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    padding: '2px 0',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },

  [`& .${classes.headerContainer}`]: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
    [theme.breakpoints.up('lg')]: {
      maxWidth: 1140,
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: 1720,
    },
  },

  [`& .${classes.alertStyle}`]: {
    backgroundColor: 'transparent !important',
    color: theme.palette.primary.contrastText,
    padding: 0,
    textAlign: 'center',
    '& .MuiAlert-message': {
      flex: 1,
    },
    '& .MuiAlert-action': {
      marginLeft: 10,
    },
  },
}));

interface NotificationBarProps {}

const NotificationBar: React.FC<NotificationBarProps> = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <StyledCollapse in={open}>
      <Box className={classes.headerTop}>
        <Box className={classes.headerContainer}>
          <Alert
            className={classes.alertStyle}
            icon={false}
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setOpen(false);
                }}>
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }>
            Get flat 60% off on your first purchase
          </Alert>
        </Box>
      </Box>
    </StyledCollapse>
  );
};
export default NotificationBar;
