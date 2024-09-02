import React from 'react';
import {Box, Skeleton} from '@mui/material';

const BoxContentSkeleton = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          marginTop: '20px',
          justifyContent: 'space-evenly',
        }}>
        <Skeleton variant='rectangular' width={210} height={118} />
        <Skeleton variant='rectangular' width={210} height={118} />
        <Skeleton variant='rectangular' width={210} height={118} />
      </Box>
    </React.Fragment>
  );
};

export default BoxContentSkeleton;
