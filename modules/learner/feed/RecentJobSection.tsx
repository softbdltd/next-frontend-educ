import {ChevronRight} from '@mui/icons-material';
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import clsx from 'clsx';
import Link from 'next/link';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {LINK_FRONTEND_JOBS} from '../../../@core/common/appLinks';
import {DEFAULT_BD_JOBS_OCCUPATION} from '../../../@core/common/constants';
import JobCategory from '../../../@core/utilities/JobCategorie';
import PageSizes from '../../../@core/utilities/PageSizes';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchPublicBdJobsJobsList} from '../../../services/IndustryManagement/hooks';
import {Fonts} from '../../../shared/constants/AppEnums';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import RecentJobComponent from './components/RecentJobComponent';

const PREFIX = 'RecentJobSection';

const classes = {
  recentSectionRoot: `${PREFIX}-recentSectionRoot`,
  featureSectionTitle: `${PREFIX}-featureSectionTitle`,
  jobItem: `${PREFIX}-jobItem`,
  divider: `${PREFIX}-divider`,
  selectStyle: `${PREFIX}-selectStyle`,
  seeMoreButton: `${PREFIX}-seeMoreButton`,
  selectControl: `${PREFIX}-selectControl`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.recentSectionRoot}`]: {
    marginTop: 0,
    paddingBottom: 10,
    paddingTop: 20,
  },

  [`& .${classes.featureSectionTitle}`]: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  [`& .${classes.jobItem}`]: {
    marginBottom: 10,
  },

  [`& .${classes.divider}`]: {
    width: '100%',
    height: 1,
    marginBottom: 5,
  },

  [`& .${classes.selectStyle}`]: {
    '& .MuiSelect-select': {
      padding: '10px 30px 10px 15px',
    },
    backgroundColor: theme.palette.grey['100'],
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.seeMoreButton}`]: {
    boxShadow: 'none',
    marginTop: 10,
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.selectControl}`]: {
    marginLeft: 20,
    marginBottom: 10,
  },
}));

const RecentJobSection = () => {
  const {messages} = useIntl();
  const [selectedValue, setSelectedValue] = useState(JobCategory.RECENT);
  const authYouth = useAuthUser<YouthAuthUser>();
  const [learnerSkillIdArray, setYouthSkillIdArray] = useState<any>([]);

  const [jobFilters, setJobFilters] = useState<any>({
    type: selectedValue,
    page_size: PageSizes.THREE,
    occupation: DEFAULT_BD_JOBS_OCCUPATION,
  });
  const {
    data: jobs,
    mutate: mutateJobs,
    metaData: jobsMetaData,
    isLoading,
  } = useFetchPublicBdJobsJobsList(jobFilters);

  useEffect(() => {
    if (authYouth?.skills) {
      const skillIds = authYouth.skills.map((skill: any) => skill.id);
      setYouthSkillIdArray(skillIds);
    }
  }, [authYouth]);

  const handleJobCategoryChange = useCallback(
    (event: any) => {
      const value = event.target.value;
      switch (value) {
        case JobCategory.RECENT:
          setJobFilters({
            type: JobCategory.RECENT,
            page_size: PageSizes.THREE,
            occupation: DEFAULT_BD_JOBS_OCCUPATION,
          });
          break;
        case JobCategory.POPULAR:
          setJobFilters({
            type: JobCategory.POPULAR,
            page_size: PageSizes.THREE,
            occupation: DEFAULT_BD_JOBS_OCCUPATION,
          });
          break;
        case JobCategory.NEARBY:
          setJobFilters({
            loc_district_id: authYouth?.loc_district_id,
            page_size: PageSizes.THREE,
            occupation: DEFAULT_BD_JOBS_OCCUPATION,
          });
          break;
        case JobCategory.SKILL_MATCHING:
          setJobFilters({
            skill_ids: learnerSkillIdArray,
            page_size: PageSizes.THREE,
            occupation: DEFAULT_BD_JOBS_OCCUPATION,
          });
          break;
      }

      setSelectedValue(value);
    },
    [learnerSkillIdArray],
  );

  const onCloseJobApplyPopup = () => {
    mutateJobs();
  };

  return (
    <StyledCard>
      <Grid container className={classes.recentSectionRoot}>
        <Grid item xs={12} sm={12} md={12}>
          <Select
            id='recentJobs'
            autoWidth
            defaultValue={selectedValue}
            variant='outlined'
            className={clsx(classes.selectStyle, classes.selectControl)}
            onChange={handleJobCategoryChange}>
            <MenuItem value={JobCategory.RECENT ?? ''}>
              {messages['common.recent_jobs']}
            </MenuItem>
            <MenuItem value={JobCategory.POPULAR ?? ''}>
              {messages['common.popular_jobs']}
            </MenuItem>
            <MenuItem value={JobCategory.NEARBY ?? ''}>
              {messages['common.nearby_jobs']}
            </MenuItem>
            <MenuItem value={JobCategory.SKILL_MATCHING ?? ''}>
              {messages['common.skill_matching_jobs']}
            </MenuItem>
          </Select>
        </Grid>

        {isLoading ? (
          <Grid item xs={12} textAlign={'center'} mt={4} mb={4}>
            <CircularProgress color='primary' size={50} />
          </Grid>
        ) : jobs && jobs.length > 0 ? (
          jobs.map((job: any, index: number) => {
            return (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                key={index}
                className={classes.jobItem}>
                {index != 0 && <Divider className={classes.divider} />}
                <RecentJobComponent
                  data={job}
                  onCloseJobApplyPopup={onCloseJobApplyPopup}
                />
              </Grid>
            );
          })
        ) : (
          <NoDataFoundComponent messageTextType={'inherit'} />
        )}

        {jobsMetaData.total_page > jobsMetaData.current_page && (
          <Grid item xs={12} sm={12} md={12} style={{paddingLeft: 15}}>
            <Link href={`${LINK_FRONTEND_JOBS}/${selectedValue}`} passHref>
              <Button
                variant={'text'}
                color={'primary'}
                size={'medium'}
                className={classes.seeMoreButton}>
                {messages['learner_feed.see_more_jobs']}
                <ChevronRight color={'primary'} />
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
    </StyledCard>
  );
};

export default RecentJobSection;
