import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Skeleton,
} from '@mui/material';
import React from 'react';

const GridPostLoadingSkeleton = () => {
  return (
    <>
      <Grid item xs={12} md={3}>
        <Skeleton
          variant={'rectangular'}
          height={150}
          animation='wave'
          sx={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}
        />
        <Card>
          <CardContent>
            <Skeleton animation='wave' height={50} />
            <Skeleton animation='wave' sx={{mt: 4}} />
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />

            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Skeleton
          variant={'rectangular'}
          height={150}
          animation='wave'
          sx={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}
        />
        <Card>
          <CardContent>
            <Skeleton animation='wave' height={50} />
            <Skeleton animation='wave' sx={{mt: 4}} />
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />

            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Skeleton
          variant={'rectangular'}
          height={150}
          animation='wave'
          sx={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}
        />
        <Card>
          <CardContent>
            <Skeleton animation='wave' height={50} />
            <Skeleton animation='wave' sx={{mt: 4}} />
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />

            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Skeleton
          variant={'rectangular'}
          height={150}
          animation='wave'
          sx={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}
        />
        <Card>
          <CardContent>
            <Skeleton animation='wave' height={50} />
            <Skeleton animation='wave' sx={{mt: 4}} />
            <Skeleton animation='wave' />
            <Skeleton animation='wave' />

            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton animation='wave' height={50} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        mt={5}
        sx={{display: 'flex', justifyContent: 'center'}}>
        <CircularProgress color='primary' sx={{mx: 'auto'}} />
      </Grid>
    </>
  );
};

export default GridPostLoadingSkeleton;
