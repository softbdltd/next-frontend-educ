import React from 'react';
import {Grid, Skeleton} from '@mui/material';

const GalleryPageSkeleton = () => {
  return (
    <>
      <Grid item xs={12} md={3} alignSelf={'center'}>
        <Skeleton
          variant='rectangular'
          animation='wave'
          sx={{height: '200px', width: '100%', borderRadius: '10px'}}
        />
        <Skeleton
          animation='wave'
          variant={'rectangular'}
          sx={{height: '20px', width: '70%', mt: 1}}
        />
      </Grid>
      <Grid item xs={12} md={3} alignSelf={'center'}>
        <Skeleton
          variant='rectangular'
          animation='wave'
          sx={{height: '200px', width: '100%', borderRadius: '10px'}}
        />
        <Skeleton
          animation='wave'
          variant={'rectangular'}
          sx={{height: '20px', width: '70%', mt: 1}}
        />
      </Grid>
      <Grid item xs={12} md={3} alignSelf={'center'}>
        <Skeleton
          variant='rectangular'
          animation='wave'
          sx={{height: '200px', width: '100%', borderRadius: '10px'}}
        />
        <Skeleton
          animation='wave'
          variant={'rectangular'}
          sx={{height: '20px', width: '70%', mt: 1}}
        />
      </Grid>
      <Grid item xs={12} md={3} alignSelf={'center'}>
        <Skeleton
          variant='rectangular'
          animation='wave'
          sx={{height: '200px', width: '100%', borderRadius: '10px'}}
        />
        <Skeleton
          animation='wave'
          variant={'rectangular'}
          sx={{height: '20px', width: '70%', mt: 1}}
        />
      </Grid>
    </>
  );
};

export default GalleryPageSkeleton;
