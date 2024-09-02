import React from 'react';
import {Box, Skeleton} from '@mui/material';

const ContentWithImageSkeleton = () => {
  return (
    <React.Fragment>
      <Box sx={{display: 'flex', marginTop: '20px'}}>
        <Skeleton variant='circular' width={50} height={50} />
        <Box sx={{width: 'calc(100% - 70px)', marginLeft: '20px'}}>
          <Skeleton animation='wave' />
          <Skeleton animation='wave' />
        </Box>
      </Box>
      <Skeleton animation='wave' />
    </React.Fragment>
  );
};

export default ContentWithImageSkeleton;
