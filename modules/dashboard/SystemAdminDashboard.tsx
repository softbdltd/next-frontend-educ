import Grid from '@mui/material/Grid';
import {styled} from '@mui/material';
import {Box} from '@mui/system';
import TemporaryStyledTileSection from './StyledTileSection/TemporaryStyledTileSection';
import OccupationalRiskTendView from './SystemAdminDashboard/OccupationalRiskTendView';
import DepartmentBasedRegistration from './SystemAdminDashboard/DepartmentBasedRegistration';
import WorldMapSection from './SystemAdminDashboard/WorldMapSection/index';
import PopularJobs from './SystemAdminDashboard/PopularJobs';
import GraphMapView from './GraphMapView';

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

const SystemAdminDashboard = () => {
  return (
    <BoxContainer>
      <TemporaryStyledTileSection />
      <StyledBox>
        <Grid container className={classes.card} spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <DepartmentBasedRegistration />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <WorldMapSection />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <GraphMapView />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <OccupationalRiskTendView />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <PopularJobs />
          </Grid>
        </Grid>
      </StyledBox>
    </BoxContainer>
  );
};

export default SystemAdminDashboard;
