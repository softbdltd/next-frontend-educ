import React from 'react';
import {Box, Grid} from '@mui/material';
import clsx from 'clsx';
import StyledTile from '../../../@core/Tile/StyledTile';
import {styled} from '@mui/material/styles';
// import RunningExamListView from '../trainerDashboard/RunningExamListView';
// import IntlMessages from '../../../@core/utility/IntlMessages';
// import UpcomingExamListView from './UpcomingExamListView';
// import {TabPanel} from '@mui/lab';
// import DashboardTabView from '../industryDashboard/DashboardTabView';
// import DashboardTabView from './DashboardTabView';
import {useFetchTrainerDashboardStatics} from '../../../services/instituteManagement/hooks';

const PREFIX = 'TrainerDashboard';

const classes = {
  card: `${PREFIX}-card`,
  boxItem: `${PREFIX}-boxItem`,
  pageTitle: `${PREFIX}-pageTitle`,
  cardColors: `${PREFIX}-cardColors`,
  cardColor1: `${PREFIX}-cardColor1`,
  cardColor2: `${PREFIX}-cardColor2`,
  cardColor3: `${PREFIX}-cardColor3`,
  cardColor4: `${PREFIX}-cardColor4`,
  cardColor5: `${PREFIX}-cardColor5`,
  cardColor6: `${PREFIX}-cardColor6`,
  mapStyle: `${PREFIX}-mapStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  height: 'calc(100vh - 110px)',
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
}));

const BoxContainer = styled(Box)(({theme}) => ({
  background: '#eeeeee',
  height: 'calc(100vh - 50px)',

  [theme.breakpoints.up('xs')]: {
    padding: '5px',
  },
  [theme.breakpoints.up('md')]: {
    padding: '10px',
  },
}));

const StyledBox = styled(Box)(({theme}) => ({
  marginTop: 20,
}));

// const StyledCard = styled(Card)(({theme}): any => ({
//   // height: 'calc(100vh - 110px)',
//   [`& .${classes.pageTitle}`]: {
//     display: 'flex',
//     alignItems: 'center',
//     '& svg': {
//       marginRight: '12px',
//     },
//   },
// }));

const TrainerDashboard = () => {
  const {data: trainerStatistics} = useFetchTrainerDashboardStatics();

  return (
    <BoxContainer>
      <StyledGrid container>
        <StyledBox>
          <Grid container className={classes.card} spacing={2}>
            <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
              <StyledTile
                className={clsx(classes.cardColors, classes.cardColor1)}
                headerNumber={trainerStatistics?.total_assigned_batch}
                message={'dashboard.assignedBatches'}
              />
            </Grid>
            <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
              <StyledTile
                className={clsx(classes.cardColors, classes.cardColor2)}
                headerNumber={trainerStatistics?.total_ended_batch}
                message={'dashboard.totalEndedBatch'}
              />
            </Grid>
            {/*<Grid item md={4} sm={4} className={classes.boxItem}>*/}
            {/*  <StyledTile*/}
            {/*    className={clsx(classes.cardColors, classes.cardColor3)}*/}
            {/*    headerNumber={trainerStatistics?.ongoingExams}*/}
            {/*    message={'dashboard.ongoingExams'}*/}
            {/*  />*/}
            {/*</Grid>*/}
            {/*<Grid item md={3} sm={3} className={classes.boxItem}>*/}
            {/*  <StyledTile*/}
            {/*    className={clsx(classes.cardColors, classes.cardColor4)}*/}
            {/*    headerNumber={trainerStatistics?.upcomingExams}*/}
            {/*    message={'dashboard.upcomingExams'}*/}
            {/*  />*/}
            {/*</Grid>*/}
            <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
              <StyledTile
                className={clsx(classes.cardColors, classes.cardColor5)}
                headerNumber={trainerStatistics?.total_ongoing_batch}
                message={'dashboard.ongoingBatches'}
              />
            </Grid>
            <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
              <StyledTile
                className={clsx(classes.cardColors, classes.cardColor6)}
                headerNumber={trainerStatistics?.upcomingBatches}
                message={'dashboard.upcomingBatches'}
              />
            </Grid>
          </Grid>
        </StyledBox>

        {/*<Grid*/}
        {/*  item*/}
        {/*  xs={12}*/}
        {/*  sx={{*/}
        {/*    paddingBottom: '18px',*/}
        {/*    flex: '1 1 auto !important',*/}
        {/*    paddingLeft: '0px !important',*/}
        {/*  }}>*/}
        {/*  /!*<Running Exam List />*!/*/}
        {/*  <StyledCard>*/}
        {/*    <CardHeader*/}
        {/*      title={*/}
        {/*        <Box style={{display: 'flex', alignItems: 'center'}}>*/}
        {/*          <Typography variant={'h6'} className={classes.pageTitle}>*/}
        {/*            <IntlMessages id='dashboard.running_exam_list' />*/}
        {/*          </Typography>*/}
        {/*        </Box>*/}
        {/*      }*/}
        {/*    />*/}
        {/*    <Divider />*/}
        {/*    <CardContent>*/}
        {/*      <RunningExamListView />*/}
        {/*    </CardContent>*/}
        {/*  </StyledCard>*/}
        {/*</Grid>*/}
        {/*<Grid*/}
        {/*  item*/}
        {/*  xs={12}*/}
        {/*  sx={{*/}
        {/*    paddingBottom: '18px',*/}
        {/*    flex: '1 1 auto !important',*/}
        {/*    paddingLeft: '0px !important',*/}
        {/*  }}>*/}
        {/*  /!*<Upcoming exam list />*!/*/}
        {/*  <StyledCard>*/}
        {/*    <CardHeader*/}
        {/*      title={*/}
        {/*        <Box style={{display: 'flex', alignItems: 'center'}}>*/}
        {/*          <Typography variant={'h6'} className={classes.pageTitle}>*/}
        {/*            <IntlMessages id='dashboard.upcoming_exam_list' />*/}
        {/*          </Typography>*/}
        {/*        </Box>*/}
        {/*      }*/}
        {/*    />*/}
        {/*    <Divider />*/}
        {/*    <CardContent>*/}
        {/*      <UpcomingExamListView />*/}
        {/*    </CardContent>*/}
        {/*  </StyledCard>*/}
        {/*</Grid>*/}
      </StyledGrid>
    </BoxContainer>
  );
};

export default TrainerDashboard;
