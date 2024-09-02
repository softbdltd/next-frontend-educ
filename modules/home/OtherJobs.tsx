import {Box, Container, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import CustomCarousel from '../../@core/elements/display/CustomCarousel/CustomCarousel';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {useFetchPublicBdJobsJobsList} from '../../services/IndustryManagement/hooks';
import JobCardComponent from '../../@core/elements/JobCardComponent';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import {LINK_FRONTEND_JOBS} from '../../@core/common/appLinks';
import SectionTitle from './SectionTitle';
import BoxCardsSkeleton from '../institute/Components/BoxCardsSkeleton';
import {SeeMoreLinkButton} from '../../@core/elements/common';
import {DEFAULT_BD_JOBS_OCCUPATION} from '../../@core/common/constants';

const PREFIX = 'OthersJobs';

const classes = {
  courseItem: `${PREFIX}-courseItem`,
  image: `${PREFIX}-image`,
  timeDetails: `${PREFIX}-timeDetails`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  marginTop: '40px',

  [`& .${classes.courseItem}`]: {
    position: 'relative',
    boxShadow: '2px 8px 7px #ddd',
    border: '1px solid #ddd',
  },

  [`& .${classes.image}`]: {
    width: '100%',
    height: '125px',
  },

  [`& .${classes.timeDetails}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  '& .react-multi-carousel-list': {
    padding: '20px 0px',
  },
}));

const PopularJobs = () => {
  const {messages} = useIntl();
  const [jobFilters] = useState<any>({
    page: 1,
    occupation: DEFAULT_BD_JOBS_OCCUPATION,
  });
  const {data: jobs, isLoading} = useFetchPublicBdJobsJobsList(jobFilters);

  return (
    <StyledGrid container xl={12}>
      <Container maxWidth='lg'>
        <SectionTitle title={messages['menu.jobs'] as string} center={true} />

        <Box mb={2} sx={{marginTop: '-16px'}}>
          {isLoading ? (
            <BoxCardsSkeleton />
          ) : jobs && jobs.length > 0 ? (
            <CustomCarousel>
              {jobs.map((job: any, index: number) => (
                <Box mr={1} ml={1} key={index}>
                  <JobCardComponent
                    job={job}
                    isGridView={true}
                    jobIdPrefix={''}
                    isEducJob={false}
                  />
                </Box>
              ))}
            </CustomCarousel>
          ) : (
            <NoDataFoundComponent />
          )}
        </Box>
        {jobs && jobs?.length > 1 && (
          <Grid item container justifyContent='center'>
            <SeeMoreLinkButton
              href={`${LINK_FRONTEND_JOBS}`}
              label={messages['common.see_more'] as string}
            />
          </Grid>
        )}
      </Container>
    </StyledGrid>
  );
};

export default PopularJobs;
