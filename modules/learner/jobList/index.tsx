import React, {useCallback, useEffect, useState} from 'react';
import {Container, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import {H6} from '../../../@core/elements/common';
import {styled} from '@mui/material/styles';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import PostLoadingSkeleton from '../../learner/common/PostLoadingSkeleton';
import JobCardComponent from '../../../@core/elements/JobCardComponent';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useFetchPublicJobs} from '../../../services/IndustryManagement/hooks';
import JobCategory from '../../../@core/utilities/JobCategorie';
import {useRouter} from 'next/router';
import PageSizes from '../../../@core/utilities/PageSizes';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import JobListSearchSection from '../../industry/jobCircular/JobListSearchSection';
import {objectFilter} from '../../../@core/utilities/helpers';
import {ListAlt, Window} from '@mui/icons-material';
import {FilterItem} from '../../../shared/Interface/common.interface';
import CustomPaginationWithPageNumber from '../training/components/CustomPaginationWithPageNumber';

const PREFIX = 'JobList';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  activeStyle: `${PREFIX}-activeStyle`,
  viewIcon: `${PREFIX}-viewIcon`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.titleStyle}`]: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },

  [`& .${classes.activeStyle}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '2px',
    borderRadius: '3px',
    cursor: 'pointer',
  },

  [`& .${classes.viewIcon}`]: {
    cursor: 'pointer',
  },
}));

const urlParamsUpdate = (router: any, params: any) => {
  router.push(
    {
      pathname: router.pathname,
      query: params,
    },
    undefined,
    {shallow: true},
  );
};

const JobList = () => {
  const {formatNumber} = useIntl();
  const router = useRouter();
  const {jobCategory} = router.query;

  const authYouth = useAuthUser<YouthAuthUser>();
  const [learnerSkillIdArray, setYouthSkillIdArray] = useState<any>([]);
  const [viewType, setViewType] = useState(0); //viewType 1== grid view

  const [pageInfo, setPageInfo] = useState<any>(null);

  const {
    data: jobs,
    metaData: jobsMetaData,
    isLoading,
    mutate: mutateJobs,
  } = useFetchPublicJobs(pageInfo);

  useEffect(() => {
    if (authYouth?.skills) {
      const skillIds = authYouth.skills.map((skill: any) => skill.id);
      setYouthSkillIdArray(skillIds);
    }
  }, [authYouth]);

  useEffect(() => {
    switch (jobCategory) {
      case JobCategory.RECENT:
        setPageInfo({
          ...router.query,
          type: JobCategory.RECENT,
          page_size:
            Number(router.query?.page_size) > 0
              ? Number(router.query?.page_size)
              : PageSizes.EIGHT,
          page: router.query?.page ? Number(router.query?.page) : 1,
        });
        break;
      case JobCategory.POPULAR:
        setPageInfo({
          ...router.query,
          type: JobCategory.POPULAR,
          page_size:
            Number(router.query?.page_size) > 0
              ? Number(router.query?.page_size)
              : PageSizes.EIGHT,
          page: router.query?.page ? Number(router.query?.page) : 1,
        });
        break;
      case JobCategory.NEARBY:
        setPageInfo({
          ...router.query,
          page_size:
            Number(router.query?.page_size) > 0
              ? Number(router.query?.page_size)
              : PageSizes.EIGHT,
          page: router.query?.page ? Number(router.query?.page) : 1,
          loc_district_id: authYouth?.loc_district_id,
        });
        break;
      case JobCategory.SKILL_MATCHING:
        setPageInfo({
          ...router.query,
          page_size:
            Number(router.query?.page_size) > 0
              ? Number(router.query?.page_size)
              : PageSizes.EIGHT,
          page: router.query?.page ? Number(router.query?.page) : 1,
          skill_ids: learnerSkillIdArray,
        });
        break;
    }
  }, [jobCategory, learnerSkillIdArray, router.query]);

  useEffect(() => {
    if (router.query?.page == '1') return;
    if (isLoading !== false) return;
    if (Object.keys(router.query).length > 0 && jobs?.length === 0) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: 1,
          },
        },
        undefined,
        {shallow: true},
      );
    }
  }, [jobs]);

  const onPaginationChange = useCallback(
    (event: any, currentPage: number) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: currentPage,
        page_size: router.query?.page_size ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: router.query?.page,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const onPopupClose = () => {
    mutateJobs();
  };

  const filterJobList = useCallback((filterKey: any, filterValue: any) => {
    const newFilter: any = {};
    newFilter[filterKey] = filterValue;
    setPageInfo((prev: any) => {
      return objectFilter({...prev, ...newFilter});
    });
  }, []);

  const filterJobListByRouteParams = useCallback(
    (filters: Array<FilterItem>) => {
      const newFilter: any = {};
      filters.map((item) => {
        newFilter[item.filterKey] = item.filterValue;
      });

      setPageInfo((prev: any) => {
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
                  {!isLoading && (
                    <Grid item>
                      <H6 className={classes.titleStyle}>
                        <IntlMessages
                          id={'common.total_job_number'}
                          values={{
                            subject: formatNumber(jobs ? jobs.length : 0),
                          }}
                        />
                      </H6>
                    </Grid>
                  )}

                  <Grid item>
                    <ListAlt
                      color={'primary'}
                      fontSize={'medium'}
                      className={
                        viewType == 0 ? classes.activeStyle : classes.viewIcon
                      }
                      onClick={() => {
                        setViewType(0);
                      }}
                    />
                    <Window
                      color={'primary'}
                      fontSize={'medium'}
                      onClick={() => {
                        setViewType(1);
                      }}
                      className={
                        viewType == 1 ? classes.activeStyle : classes.viewIcon
                      }
                      sx={{marginLeft: '10px'}}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {isLoading ? (
                <PostLoadingSkeleton />
              ) : jobs && jobs.length ? (
                jobs?.map((job: any) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={viewType == 1 ? 6 : 12}
                      md={viewType == 1 ? 3 : 12}
                      key={job.id}>
                      <JobCardComponent
                        job={job}
                        onPopupClose={onPopupClose}
                        isGridView={viewType == 1}
                      />
                    </Grid>
                  );
                })
              ) : (
                <NoDataFoundComponent />
              )}
            </Grid>
          </Grid>
        </Grid>
        <CustomPaginationWithPageNumber
          metaData={jobsMetaData}
          pageInfo={pageInfo}
          onPaginationChange={onPaginationChange}
          rowsPerPage={Number(router.query.page_size)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledContainer>
    </>
  );
};

export default JobList;
