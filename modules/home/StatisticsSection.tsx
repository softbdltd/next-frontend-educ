import React from 'react';
import {Box, Grid} from '@mui/material';
import StatisticsCard from './components/StatisticsCard';
import {useFetchLandingPageStatistics} from '../../services/global/hooks';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';
import {H1} from '../../@core/elements/common';

const PREFIX = 'StatisticsSection';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));

const StatisticsSection = () => {
  const {messages} = useIntl();
  const {data: statistics, isLoading: isLoadingStatistics} =
    useFetchLandingPageStatistics();
  return (
    <StyledBox>
      <H1 className={classes.visuallyHidden}>
        {messages['common.statistics']}
      </H1>
      <Grid container my={4} spacing={2} justifyContent={'center'}>
        <StatisticsCard
          title={messages['common.learner_3']}
          value={statistics?.total_learner}
          iconUrl={`images/home-page/total_learner.png`}
          isLoading={isLoadingStatistics}
        />
        <StatisticsCard
          title={messages['institute.skills_service_provider']}
          value={statistics?.total_skill_service_provider}
          iconUrl={`images/home-page/total_skill_service_provider.png`}
          isLoading={isLoadingStatistics}
        />
        <StatisticsCard
          title={messages['job.companies']}
          value={statistics?.total_companies}
          iconUrl={`images/home-page/total_companies.png`}
          isLoading={isLoadingStatistics}
        />
        <StatisticsCard
          title={messages['common.jobs']}
          value={statistics?.total_jobs}
          iconUrl={`images/home-page/total_jobs.png`}
          isLoading={isLoadingStatistics}
        />
        <StatisticsCard
          title={messages['common.courses']}
          value={statistics?.total_courses}
          iconUrl={`images/home-page/total_courses.png`}
          isLoading={isLoadingStatistics}
        />
      </Grid>
    </StyledBox>
  );
};

export default StatisticsSection;
