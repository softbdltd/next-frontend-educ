import React from 'react';
import {Box, Hidden} from '@mui/material';

const AppLogoWhite = () => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
      }}>
      <Hidden smUp>
        <img
          style={{
            height: 36,
            marginRight: 10,
          }}
          src={'/images/logo-white.png'}
          alt='EDUC'
        />
      </Hidden>
      <Hidden xsDown>
        <img
          style={{
            height: 36,
            marginRight: 10,
          }}
          src={'/images/logo-white-with-name.png'}
          alt='EDUC'
        />
      </Hidden>
    </Box>
  );
};

export default AppLogoWhite;
