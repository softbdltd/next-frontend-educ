import React from 'react';
import {Grid} from '@mui/material';
import Notifications from './Notifications';

const NotificationsPage = () => {
  return (
    <Grid
      container
      justifyContent={'center'}
      sx={{
        overflow: 'hidden',
        height: 'calc(100vh - 110px)',
      }}>
      <Grid item xs={6} sx={{height: 'calc(100% - 1px)'}}>
        <Notifications />
      </Grid>
    </Grid>
  );
};

export default NotificationsPage;
