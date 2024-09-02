import React from 'react';
import StyledTileSection from './StyledTileSection';
import Grid from '@mui/material/Grid';
import MostDemandableCourseChart from './charts/MostDemandableCourseChart';
import EventMiniCalendarView from '../events/EventMiniCalendarView';
import TotalBatchesChart from './charts/TotalBatchesChart';
import {styled} from '@mui/material';
import {Box} from '@mui/system';
import {useAuthUser} from '../../@core/utility/AppHooks';
import SectorWiseCourseChart from './charts/SectorWiseCourseChart';
import CourseEnrolmentChart from './charts/CourseEnrolmentChart';
import SkillTrendsChartForInstitute from './charts/DemandableSkillsChart';
import EmploymentWiseChart from './charts/EmploymentWiseChart';

const PREFIX = 'Dashboard';

const classes = {
  card: `${PREFIX}-card`,
};

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

const Dashboard = () => {
  const authUser = useAuthUser();

  return (
    <BoxContainer>
      <StyledTileSection />

      <StyledBox>
        <Grid container className={classes.card} spacing={2}>
          {/* Batch*/}
          {authUser?.isInstituteUser && (
            <Grid
              item
              xs={12}
              md={authUser?.isInstituteUser ? 6 : 12}
              sm={authUser?.isInstituteUser ? 6 : 12}>
              <TotalBatchesChart />
            </Grid>
          )}
          {/*Total Enrolment  */}
          {authUser?.isInstituteUser && (
            <Grid
              item
              xs={12}
              md={authUser?.isInstituteUser ? 6 : 12}
              sm={authUser?.isInstituteUser ? 6 : 12}>
              <CourseEnrolmentChart />
            </Grid>
          )}
          {/*Course */}
          <Grid
            item
            xs={12}
            md={authUser?.isInstituteUser ? 6 : 12}
            sm={authUser?.isInstituteUser ? 6 : 12}>
            <MostDemandableCourseChart />
          </Grid>

          {/* Event Mini Calender*/}
          {authUser?.isInstituteUser && (
            <Grid item xs={12} md={6} sm={6}>
              <EventMiniCalendarView />
            </Grid>
          )}
          {/*Skills Trends  */}
          {authUser?.isInstituteUser && (
            <Grid
              item
              xs={12}
              md={authUser?.isInstituteUser ? 6 : 12}
              sm={authUser?.isInstituteUser ? 6 : 12}>
              <SkillTrendsChartForInstitute />
            </Grid>
          )}
          {/* Job Sector*/}
          {authUser?.isInstituteUser && (
            <Grid
              item
              xs={12}
              md={authUser?.isInstituteUser ? 6 : 12}
              sm={authUser?.isInstituteUser ? 6 : 12}>
              <SectorWiseCourseChart />
            </Grid>
          )}
          {authUser?.isInstituteUser && (
            <Grid
              item
              xs={12}
              md={authUser?.isInstituteUser ? 6 : 12}
              sm={authUser?.isInstituteUser ? 6 : 12}>
              <EmploymentWiseChart />
            </Grid>
          )}
        </Grid>
      </StyledBox>
    </BoxContainer>
  );
};

export default Dashboard;
