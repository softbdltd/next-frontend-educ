import React from 'react';
import {Grid, Skeleton} from '@mui/material';
import {styled} from '@mui/material/styles';

const PREFIX = 'PartnersSkeleton';

const classes = {
  gridStyle: `${PREFIX}-gridStyle`,
  skeletonStyle: `${PREFIX}-skeletonStyle`,
};

const StyledContainer = styled(Grid)(({theme}) => ({
  [`& .${classes.gridStyle}`]: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  [`& .${classes.skeletonStyle}`]: {
    borderRadius: '5px',
  },
  marginLeft: 0,
}));

const ResourceSkeleton = () => {
  return (
    <StyledContainer container spacing={2} pt={6}>
      <Grid item xs={6} sm={6} md={3} className={classes.gridStyle}>
        <Skeleton
          className={classes.skeletonStyle}
          animation='wave'
          variant='rectangular'
          width={'100%'}
          height={'340px'}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3} className={classes.gridStyle}>
        <Skeleton
          className={classes.skeletonStyle}
          animation='wave'
          variant='rectangular'
          width={'100%'}
          height={'340px'}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3} className={classes.gridStyle}>
        <Skeleton
          className={classes.skeletonStyle}
          animation='wave'
          variant='rectangular'
          width={'100%'}
          height={'340px'}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={3} className={classes.gridStyle}>
        <Skeleton
          className={classes.skeletonStyle}
          animation='wave'
          variant='rectangular'
          width={'100%'}
          height={'340px'}
        />
      </Grid>
    </StyledContainer>
  );
};

export default ResourceSkeleton;
