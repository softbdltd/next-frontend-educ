import React from 'react';
import {Box, Grid, Skeleton, Stack} from '@mui/material';
import {styled} from '@mui/material/styles';

const PREFIX = 'SkillsSectionSkeleton';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  subHeading: `${PREFIX}-subHeading`,
  descriptionText: `${PREFIX}-descriptionText`,
  applyBtn: `${PREFIX}-applyBtn`,
};

const StyledBox = styled(Box)(({theme}) => ({
  border: '1.12313px solid #D7D7D7',
  borderRadius: '6px',
  padding: '18px 14px',
  height: '100%',

  [`& .${classes.titleStyle}`]: {
    fontSize: '2.6rem',
  },
  [`& .${classes.subHeading}`]: {
    fontSize: '2.2rem',
  },
  [`& .${classes.descriptionText}`]: {
    fontSize: '1.25rem',
  },
  [`& .${classes.applyBtn}`]: {
    borderRadius: '10px',
  },
}));
const SkillsSectionSkeleton = () => {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <StyledBox>
        <Stack spacing={0.5}>
          <Skeleton
            animation='wave'
            variant='text'
            width={100}
            sx={{fontSize: '1.5rem'}}
          />
          <Skeleton
            animation='wave'
            variant='text'
            className={classes.titleStyle}
          />
          <Skeleton
            animation='wave'
            variant='text'
            width={200}
            className={classes.titleStyle}
          />
          <Skeleton
            animation='wave'
            variant='text'
            width={120}
            className={classes.descriptionText}
          />
          <Skeleton
            animation='wave'
            variant='rectangular'
            height={32}
            width={90}
            className={classes.applyBtn}
          />
        </Stack>
      </StyledBox>
    </Grid>
  );
};

export default SkillsSectionSkeleton;
