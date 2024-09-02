import {Box, Card, CardContent, CircularProgress, Grid} from '@mui/material';
import ContentWithImageSkeleton from '../profile/component/ContentWithImageSkeleton';
import React from 'react';

const PostLoadingSkeleton = () => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <ContentWithImageSkeleton />
        </CardContent>
      </Card>
      <Box sx={{marginTop: 5, textAlign: 'center'}}>
        <CircularProgress color='primary' />
      </Box>
    </Grid>
  );
};

export default PostLoadingSkeleton;
