import React from 'react';
import CardWithImageSkeleton from '../../home/components/CardWithImageSkeleton';
import {Grid} from '@mui/material';

const NewsPageSkeleton = () => {
  return (
    <>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
      <Grid item xs={12} md={3}>
        <CardWithImageSkeleton />
      </Grid>
    </>
  );
};

export default NewsPageSkeleton;
