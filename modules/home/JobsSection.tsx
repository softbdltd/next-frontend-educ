import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {Button, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Link from 'next/link';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {LINK_FRONTEND_LEARNER_JOBS} from '../../@core/common/appLinks';
import SectionHeading from '../../@core/elements/common/SectionHeading';
import PageSizes from '../../@core/utilities/PageSizes';
import {useFetchPublicBdJobsJobsList} from '../../services/IndustryManagement/hooks';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import JobCard from './components/JobCard';
import JobsFilterSection from './components/JobsFilterSection';
import JobsSectionSkeleton from './components/JobsSectionSkeleton';
import PaginationComponent from './components/PaginationComponent';

const PREFIX = 'JobsSection';

const classes = {
  paginationContainer: `${PREFIX}-paginationContainer`,
  moreBtn: `${PREFIX}-moreBtn`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  justifyContent: 'center',

  [`& .${classes.paginationContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  [`& .${classes.moreBtn}`]: {
    marginTop: '10px',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: '12px',
      right: '0px',
    },
  },
}));

const JobsSection = () => {
  const {messages} = useIntl();
  const [jobsFilters, setJobsFilters] = useState<any>({
    page_size: PageSizes.EIGHT,
    page: 1,
    // occupation: DEFAULT_BD_JOBS_OCCUPATION,
  });

  const {
    data: jobs,
    isLoading: isLoadingJobs,
    metaData,
  } = useFetchPublicBdJobsJobsList(jobsFilters);

  return (
    <StyledGrid container spacing={3} my={4}>
      <Grid item xs={12}>
        <SectionHeading title={messages['common.jobs'] as string} />
      </Grid>
      <Grid item xs={12}>
        <JobsFilterSection setJobsFilters={setJobsFilters} />
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {isLoadingJobs ? (
              <>
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
                <JobsSectionSkeleton />
              </>
            ) : jobs && jobs.length > 0 ? (
              <>
                {jobs?.map((job: any) => (
                  <Grid key={job?.id} item xs={12} sm={6} md={3}>
                    <JobCard job={job} jobIdPrefix={''} />
                  </Grid>
                ))}
              </>
            ) : (
              <Grid item xs={12}>
                <NoDataFoundComponent />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.paginationContainer}>
        {jobs && jobs?.length > 0 && (
          <PaginationComponent
            setPaginationFilter={setJobsFilters}
            pageMetaData={metaData}
          />
        )}

        <Link href={LINK_FRONTEND_LEARNER_JOBS} passHref>
          <Button
            className={classes.moreBtn}
            variant={'outlined'}
            endIcon={<KeyboardDoubleArrowRightIcon />}>
            {messages['common.see_more']}
          </Button>
        </Link>
      </Grid>
    </StyledGrid>
  );
};

export default JobsSection;
