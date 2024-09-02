import {styled} from '@mui/material/styles';
import {Grid, Skeleton} from '@mui/material';
import React from 'react';

const PREFIX = 'PartnerSkeleton';

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
}));

const AccessToMarketSkeleton = () => {
  return (
    <StyledContainer container spacing={3} mt={6} pt={6}>
      <Grid item xs={12} md={3} className={classes.gridStyle}>
        <Skeleton
          animation='wave'
          className={classes.skeletonStyle}
          variant='rectangular'
          width={'100%'}
          height={220}
        />
      </Grid>
      <Grid item xs={12} md={3} className={classes.gridStyle}>
        <Skeleton
          animation='wave'
          className={classes.skeletonStyle}
          variant='rectangular'
          width={'100%'}
          height={220}
        />
      </Grid>
      <Grid item xs={12} md={3} className={classes.gridStyle}>
        <Skeleton
          animation='wave'
          className={classes.skeletonStyle}
          variant='rectangular'
          width={'100%'}
          height={220}
        />
      </Grid>
      <Grid item xs={12} md={3} className={classes.gridStyle}>
        <Skeleton
          animation='wave'
          className={classes.skeletonStyle}
          variant='rectangular'
          width={'100%'}
          height={220}
        />
      </Grid>
    </StyledContainer>
  );
};
export default AccessToMarketSkeleton;
