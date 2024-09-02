import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import StyledTileTrainingCenter from './StyledTileTrainingCenter';
import TotalBatchesChart from './TotalBatchesChart';
import CourseEnrolmentChart from './CourseEnrolmentChart';
import MostDemandableCourseChart from './MostDemandableCourseChart';
import EventMiniCalendarView from '../../events/EventMiniCalendarView';

const PREFIX = 'TrainingCenterDashboard';

const classes = {
  card: `${PREFIX}-card`,
};

const StyledBox = styled(Box)(({theme}) => ({
  marginTop: 20,
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

const TrainigCenterDashboard = () => {
  return (
    <BoxContainer>
      <StyledTileTrainingCenter />

      <StyledBox>
        <Grid container className={classes.card} spacing={2}>
          {/* Batch*/}
          <Grid item xs={12} md={6} sm={6}>
            <TotalBatchesChart />
          </Grid>

          {/*Total Course  */}
          <Grid item xs={12} md={6} sm={6}>
            <CourseEnrolmentChart />
          </Grid>

          {/*Most Demandable Charts  */}
          <Grid item xs={12} md={6} sm={6}>
            <MostDemandableCourseChart />
          </Grid>

          {/* Event Mini Calender*/}
          <Grid item xs={12} md={6} sm={6}>
            <EventMiniCalendarView />
          </Grid>
        </Grid>
      </StyledBox>
    </BoxContainer>
  );
};

export default TrainigCenterDashboard;
