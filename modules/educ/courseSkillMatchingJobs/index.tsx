import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import PageSizes from '../../@core/utilities/PageSizes';
import {useFetchPublicJobs} from '../../services/IndustryManagement/hooks';
import {Container, Grid, Pagination, Stack} from '@mui/material';
import {H6} from '../../@core/elements/common';
import IntlMessages from '../../@core/utility/IntlMessages';
import PostLoadingSkeleton from '../learner/common/PostLoadingSkeleton';
import JobCardComponent from '../../@core/elements/JobCardComponent';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import {styled} from '@mui/material/styles';
import {useFetchPublicCourseDetailsWithParams} from '../../services/instituteManagement/hooks';
import {objectFilter} from '../../@core/utilities/helpers';
import JobListSearchSection from '../industry/jobCircular/JobListSearchSection';
import {FilterItem} from '../../shared/Interface/common.interface';

const PREFIX = 'CourseSkillMatchingJobs';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  gridMargin: `${PREFIX}-gridMargin`,
  filterBox: `${PREFIX}-filterBox`,
  chipStyle: `${PREFIX}-chipStyle`,
  selectStyle: `${PREFIX}-selectStyle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.titleStyle}`]: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },

  [`& .${classes.chipStyle}`]: {
    color: theme.palette.primary.light,
    padding: '3px 7px',
    marginLeft: '10px',
  },

  [`& .${classes.gridMargin}`]: {
    marginLeft: '15px',
    [theme.breakpoints.only('xs')]: {
      marginLeft: 0,
      marginTop: '15px',
    },
  },

  [`& .${classes.filterBox}`]: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  },

  [`& .${classes.selectStyle}`]: {
    minWidth: '220px',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
}));

const CourseSkillMatchingJobs = () => {
  const {formatNumber} = useIntl();
  const router = useRouter();
  const {courseId} = router.query;
  const page = useRef<any>(1);

  const [courseDetailsFilter] = useState<any>({});

  const {data: courseDetails} = useFetchPublicCourseDetailsWithParams(
    Number(courseId),
    courseDetailsFilter,
  );

  const [jobFilters, setJobFilters] = useState<any>({
    page_size: PageSizes.EIGHT,
  });
  const {
    data: jobs,
    metaData: jobsMetaData,
    isLoading,
  } = useFetchPublicJobs(jobFilters);

  useEffect(() => {
    let skillIDs: Array<number> = [];
    if (courseDetails?.skills) {
      courseDetails.skills.map((skill: any) => {
        skillIDs.push(skill.id);
      });

      setJobFilters((params: any) => ({
        ...params,
        skill_ids: skillIDs,
        page: page.current,
      }));
    }
  }, [courseDetails]);

  const onPaginationChange = useCallback((event: any, currentPage: number) => {
    page.current = currentPage;
    setJobFilters((params: any) => {
      return {...params, ...{page: currentPage}};
    });
  }, []);

  const filterJobList = useCallback((filterKey: any, filterValue: any) => {
    const newFilter: any = {};
    newFilter[filterKey] = filterValue;

    setJobFilters((prev: any) => {
      return objectFilter({...prev, ...newFilter});
    });
  }, []);

  const filterJobListByRouteParams = useCallback(
    (filters: Array<FilterItem>) => {
      const newFilter: any = {};
      filters.map((item) => {
        newFilter[item.filterKey] = item.filterValue;
      });

      setJobFilters((prev: any) => {
        return objectFilter({...prev, ...newFilter});
      });
    },
    [],
  );

  return (
    <>
      <JobListSearchSection
        addFilterKey={filterJobList}
        routeParamsFilters={filterJobListByRouteParams}
      />
      <StyledContainer maxWidth='lg' sx={{marginBottom: '25px'}}>
        <Grid container mt={4} justifyContent={'center'}>
          <Grid item md={12} mt={{xs: 4, md: 5}}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container justifyContent={'space-between'}>
                  {!isLoading && jobs && jobs?.length > 0 && (
                    <Grid item>
                      <H6 className={classes.titleStyle}>
                        <IntlMessages
                          id={'common.total_job_number'}
                          values={{
                            subject: formatNumber(jobs.length),
                          }}
                        />
                      </H6>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {isLoading ? (
                <PostLoadingSkeleton />
              ) : (
                jobs?.map((job: any) => {
                  return (
                    <Grid item xs={12} sm={12} md={12} key={job.id}>
                      <JobCardComponent job={job} isGridView={true} />
                    </Grid>
                  );
                })
              )}

              {(!jobs || (jobs && jobs.length <= 0)) && (
                <NoDataFoundComponent />
              )}
              {jobsMetaData?.total_page > 1 && (
                <Grid
                  item
                  md={12}
                  mt={4}
                  display={'flex'}
                  justifyContent={'center'}>
                  <Stack spacing={2}>
                    <Pagination
                      page={page.current}
                      count={jobsMetaData.total_page}
                      onChange={onPaginationChange}
                      color={'primary'}
                      shape='rounded'
                    />
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

export default CourseSkillMatchingJobs;
