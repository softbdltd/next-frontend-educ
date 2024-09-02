import {Box, Container, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import CustomCarousel from '../../@core/elements/display/CustomCarousel/CustomCarousel';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {useFetchPublicJobs} from '../../services/IndustryManagement/hooks';
import JobCardComponent from '../../@core/elements/JobCardComponent';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import JobCategory from '../../@core/utilities/JobCategorie';
import PageSizes from '../../@core/utilities/PageSizes';
import {LINK_FRONTEND_JOBS} from '../../@core/common/appLinks';
import SectionTitle from './SectionTitle';
import BoxCardsSkeleton from '../institute/Components/BoxCardsSkeleton';
import {SeeMoreLinkButton} from '../../@core/elements/common';

const PREFIX = 'EducPopularJobs';

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
    page_size: PageSizes.EIGHT,
  });
  const {data: jobs, isLoading} = useFetchPublicJobs(jobFilters);

  return (
    <StyledGrid container xl={12}>
      <Container maxWidth='lg'>
        <SectionTitle
          title={messages['educ.popular_jobs'] as string}
          center={true}
        />

        <Box mb={2} sx={{marginTop: '-16px'}}>
          {isLoading ? (
            <BoxCardsSkeleton />
          ) : jobs && jobs.length > 0 ? (
            <CustomCarousel>
              {jobs.map((job: any, index: number) => (
                <Box mr={1} ml={1} key={index}>
                  <JobCardComponent job={job} isGridView={true} />
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
              href={`${LINK_FRONTEND_JOBS}/${JobCategory.POPULAR}`}
              label={messages['common.see_more'] as string}
            />
          </Grid>
        )}
      </Container>
    </StyledGrid>
  );
};

export default PopularJobs;
