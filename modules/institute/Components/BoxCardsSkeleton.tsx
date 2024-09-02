import React from 'react';
import {Box, Skeleton} from '@mui/material';

const BoxCardsSkeleton = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          marginTop: '20px',
          justifyContent: 'space-around',
        }}>
        <Skeleton variant='rectangular' width={250} height={150} />
        <Skeleton variant='rectangular' width={250} height={150} />
        <Skeleton variant='rectangular' width={250} height={150} />
        <Skeleton variant='rectangular' width={250} height={150} />
      </Box>
    </React.Fragment>
  );
};

export default BoxCardsSkeleton;
