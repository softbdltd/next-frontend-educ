import StyledTile from '../../../@core/Tile/StyledTile';
import {Box, Grid} from '@mui/material';
import clsx from 'clsx';
import {styled} from '@mui/material/styles';
import {useFetchTrainignCenterDashboardStatics} from '../../../services/instituteManagement/hooks';

const PREFIX = 'Dashboard';

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
  cardColor8: `${PREFIX}-cardColor8`,
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

  [`& .${classes.cardColor5}`]: {
    background: '#14017F',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor6}`]: {
    background: '#D169E4',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor7}`]: {
    background: '#22BB33',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));

const StyledTileTrainingCenter = () => {
  const {data: trainingStatistics} = useFetchTrainignCenterDashboardStatics();

  return (
    <StyledBox>
      <Grid container className={classes.card} spacing={2}>
        <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
          <StyledTile
            className={clsx(classes.cardColors, classes.cardColor1)}
            headerNumber={trainingStatistics?.total_course}
            message={'common.total_course'}
          />
        </Grid>
        <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
          <StyledTile
            className={clsx(classes.cardColors, classes.cardColor4)}
            headerNumber={trainingStatistics?.total_enroll}
            message={'common.total_enrolments'}
          />
        </Grid>
        <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
          <StyledTile
            className={clsx(classes.cardColors, classes.cardColor5)}
            headerNumber={trainingStatistics?.total_ended_batch}
            message={'common.completed_batch'}
          />
        </Grid>
        <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
          <StyledTile
            className={clsx(classes.cardColors, classes.cardColor2)}
            headerNumber={trainingStatistics?.total_running_batch}
            message={'common.running_batch'}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default StyledTileTrainingCenter;
