import React from 'react';
import {styled} from '@mui/material/styles';
import BasicInfo from './BasicInfo';
import SideMenu from '../../../@core/elements/YouthSideMenu';
import {Box, Container, Grid} from '@mui/material';
import Scrollbar from '../../../@core/core/Scrollbar';
import EventCalendarViewPage from '../../../modules/events/EventCalendarView';

const PREFIX = 'YouthFeedPage';

const classes = {
  container: `${PREFIX}-container`,
  root: `${PREFIX}-root`,
  scrollBarStyle: `${PREFIX}-scrollBarStyle`,
  rootScrollBar: `${PREFIX}-rootScrollBar`,
  scrollBar: `${PREFIX}-scrollBar`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`&.${classes.container}`]: {
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 90px)',
      boxSizing: 'border-box',
      overflowY: 'hidden',
    },
  },

  [`& .${classes.root}`]: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      flexDirection: 'column',
    },
  },

  [`& .${classes.scrollBarStyle}`]: {
    paddingTop: 20,
    paddingBottom: '1px',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 90px)',
      overflowY: 'hidden',
      '&:hover': {
        overflowY: 'auto',
      },
    },
    '&>.ps__rail-y': {
      height: 'calc(100% - 40px) !important',
      marginBottom: 20,
      marginTop: 20,
    },
  },

  [`& .${classes.rootScrollBar}`]: {
    overflowY: 'hidden',
  },

  [`& .${classes.scrollBar}`]: {
    height: '82.5vh',
    overflowY: 'hidden',
    '&:hover': {
      $rootScrollBar: {
        overflowY: 'auto',
      },
    },
  },
}));

const YouthCalendarPage = () => {
  return (
    <StyledContainer maxWidth={'lg'} className={classes.container}>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} md={3}>
          <Scrollbar className={classes.scrollBarStyle}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BasicInfo />
              </Grid>
              <Grid item xs={12}>
                <SideMenu />
              </Grid>
            </Grid>
          </Scrollbar>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          order={{xs: 3, md: 2}}
          style={{paddingTop: 24}}>
          <Scrollbar className={classes.scrollBarStyle}>
            <Box sx={{mt: -5}}></Box>
          <EventCalendarViewPage />
          </Scrollbar>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default YouthCalendarPage;
