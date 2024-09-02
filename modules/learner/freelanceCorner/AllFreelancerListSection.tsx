import React, {useEffect, useState} from 'react';
import {Box, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import FreelancerCardComponent from './components/FreelancerCardComponent';
import {useFetchYouths} from '../../../services/learnerManagement/hooks';
import {objectFilter} from '../../../@core/utilities/helpers';
import PostLoadingSkeleton from '../common/PostLoadingSkeleton';
import NoDataFoundComponent from '../common/NoDataFoundComponent';

interface AllFreelancerListSectionProps {
  skillIds?: Array<number>;
  searchText?: string;
  upazila_id?: number | null;
}

const AllFreelancerListSection = ({
  skillIds,
  searchText,
  upazila_id,
}: AllFreelancerListSectionProps) => {
  const {messages} = useIntl();
  const [freelancerFilters, setFreelancerFilters] = useState<any>({
    is_freelance_profile: 1,
  });

  const {data: freelancerLists, isLoading: isLoadingFreelancers} =
    useFetchYouths(freelancerFilters);

  useEffect(() => {
    let filters = {
      skill_ids: skillIds,
      search_text: searchText,
      loc_upazila_municipality_id: upazila_id,
    };
    setFreelancerFilters(objectFilter({...freelancerFilters, ...filters}));
  }, [skillIds, searchText, upazila_id]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{fontSize: 17, fontWeight: 'bold'}}>
          {messages['common.all']}
        </Box>
      </Grid>

      {isLoadingFreelancers ? (
        <PostLoadingSkeleton />
      ) : (
        freelancerLists?.map((freelancer: any) => {
          return (
            <Grid item xs={12} sm={12} md={12} key={freelancer.id}>
              <FreelancerCardComponent freelancer={freelancer} />
            </Grid>
          );
        })
      )}

      {freelancerLists && freelancerLists.length <= 0 && (
        <NoDataFoundComponent />
      )}
    </Grid>
  );
};

export default AllFreelancerListSection;
