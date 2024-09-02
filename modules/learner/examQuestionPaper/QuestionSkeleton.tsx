import React from 'react';
import {Grid, Skeleton} from '@mui/material';

const QuestionSkeleton = () => {
  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: 'inline-grid',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Skeleton variant='text' width={200} height={30} />
        <Skeleton variant='text' width={150} height={30} />
        <Skeleton variant='text' width={150} height={30} />
      </Grid>
      <Grid item xs={12} sx={{margin: '30px'}}>
        <Skeleton variant='text' width={500} height={40} />
        <Skeleton variant='text' width={150} height={30} />
        <Skeleton variant='text' width={150} height={30} />
        <Skeleton variant='text' width={150} height={30} />
        <Skeleton variant='text' width={150} height={30} />
        <Skeleton variant='text' width={500} height={40} />
        <Skeleton variant='text' width={150} height={30} />
        <Skeleton variant='text' width={150} height={30} />
      </Grid>
    </Grid>
  );
};

export default QuestionSkeleton;
