import ClickableStyledTile from '../../../@core/Tile/ClickableStyledTile';
import {Box, Grid} from '@mui/material';
import React from 'react';
import clsx from 'clsx';
import {styled} from '@mui/material/styles';
import {useFetcJobFairStatistics} from '../../../services/cmsManagement/hooks';

const PREFIX = 'JobFairStyledTileSection';

const classes = {
  card: `${PREFIX}-card`,
  boxItem: `${PREFIX}-boxItem`,
  cardColors: `${PREFIX}-cardColors`,
  cardColor1: `${PREFIX}-cardColor1`,
  cardColor2: `${PREFIX}-cardColor2`,
  cardColor3: `${PREFIX}-cardColor3`,
  cardColor4: `${PREFIX}-cardColor4`,
  cardColor5: `${PREFIX}-cardColor5`,
  cardColor6: `${PREFIX}-cardColor6`,
  cardColor7: `${PREFIX}-cardColor7`,
};
const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.cardColors}`]: {
    height: '100%',
    position: 'relative',
    '&::before, &::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      background: '#fff2',
      borderRadius: 50,
      width: 90,
      height: 90,
      left: -20,
      bottom: -30,
    },
    '&::after': {
      left: -20,
      bottom: -60,
    },
  },

  [`& .${classes.cardColor1}`]: {
    background: '#661687',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor2}`]: {
    background: '#0069BC',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor3}`]: {
    background: '#305DF7',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor4}`]: {
    background: '#FD8A4B',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));

const JobFairStyledTileSection = () => {
  const {data: dashStatistics} = useFetcJobFairStatistics();

  return (
    <StyledBox>
      <Grid container className={classes.card} spacing={{xs: 1, md: 2}}>
        <Grid item xs={6} sm={6} md={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor1)}
            headerNumber={dashStatistics?.total_participating_institutions}
            message={'job_fair_dashboard.participated_institutes'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor2)}
            headerNumber={dashStatistics?.total_fair_registered_learners}
            message={'job_fair_dashboard.registered_learners_in_fair'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor3)}
            headerNumber={dashStatistics?.total_jobs_demand}
            message={'job_fair_dashboard.job_demand'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor4)}
            headerNumber={dashStatistics?.total_jobs_provided}
            message={'job_fair_dashboard.job_provided_info'}
            link={undefined}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default JobFairStyledTileSection;
