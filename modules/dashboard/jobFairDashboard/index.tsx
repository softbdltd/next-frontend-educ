import React, {useState} from 'react';
import {styled} from '@mui/material';
import {Box} from '@mui/system';
import JobFairStyledTileSection from './JobFairStyledTileSection';
import JobFairMapView from './map/JobFairMapView';
import {useIntl} from 'react-intl';
import InstituteWiseJobInformation from './InstituteWiseJobInformation';

const BoxContainer = styled(Box)(({theme}) => ({
  [theme.breakpoints.up('xs')]: {
    padding: '5px',
  },
  [theme.breakpoints.up('md')]: {
    padding: '10px',
  },
}));

const JobFairDashboard = () => {
  const {messages} = useIntl();
  const [filterState, setFilterState] = useState<any>(null);

  return (
    <BoxContainer>
      <Box
        fontWeight='fontWeightBold'
        sx={{fontSize: '35px', color: 'primary.main', marginTop: '-15px'}}>
        {messages['job_fair_dashboard.heading']}
      </Box>
      <Box fontWeight='fontWeightBold' sx={{fontSize: '25px'}}>
        {messages['job_fair_dashboard.overall_country_info']}
      </Box>
      <JobFairStyledTileSection />

      <JobFairMapView setFilterState={setFilterState} />
      <InstituteWiseJobInformation filterState={filterState} />
    </BoxContainer>
  );
};

export default JobFairDashboard;
