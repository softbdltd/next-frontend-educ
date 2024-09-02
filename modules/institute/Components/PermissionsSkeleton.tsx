import React from 'react';
import {Box, Skeleton} from '@mui/material';

const PermissionSkeleton = () => {
  return (
    <Box sx={{display: 'grid', gap: '1rem'}}>
      <Skeleton variant='rectangular' width='100%' height={50} />
      <Skeleton variant='rectangular' width='100%' height={150} />
      <Skeleton variant='rectangular' width='100%' height={150} />
      <Skeleton variant='rectangular' width='100%' height={150} />
      <Skeleton variant='rectangular' width='100%' height={150} />
      <Skeleton variant='rectangular' width='100%' height={50} />
    </Box>
  );
};

export default PermissionSkeleton;
