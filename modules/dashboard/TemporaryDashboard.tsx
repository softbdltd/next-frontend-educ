import {styled} from '@mui/material';
import Grid from '@mui/material/Grid';
import {Box} from '@mui/system';
import React from 'react';
import MostDemandableCourseChart from './charts/MostDemandableCourseChart';
import PopularInstituteChart from './charts/PopularInstituteChart';
import GraphMapView from './GraphMapView';
import TemporaryStyledTileSection from './StyledTileSection/TemporaryStyledTileSection';

const PREFIX = 'Dashboard';

const classes = {
  card: `${PREFIX}-card`,
};

const BoxContainer = styled(Box)(({theme}) => ({
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

const TemporaryDashboard = () => {
  return (
    <BoxContainer>
      <TemporaryStyledTileSection />

      <StyledBox>
        <Grid container className={classes.card} spacing={2}>
          {/*Course */}
          <Grid item xs={12} sm={6} md={6}>
            <MostDemandableCourseChart />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <PopularInstituteChart />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <GraphMapView />
          </Grid>
        </Grid>
      </StyledBox>
    </BoxContainer>
  );
};

export default TemporaryDashboard;
