import React, {useCallback, useEffect, useState} from 'react';
import {useFetchMyJobs} from '../../../services/learnerManagement/hooks';
import PageSizes from '../../../@core/utilities/PageSizes';
import JobListSearchSection from '../../industry/jobCircular/JobListSearchSection';
import {objectFilter} from '../../../@core/utilities/helpers';
import {Container, Grid} from '@mui/material';
import {H6} from '../../../@core/elements/common';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {ListAlt, Window} from '@mui/icons-material';
import PostLoadingSkeleton from '../common/PostLoadingSkeleton';
import JobCardComponent from '../../../@core/elements/JobCardComponent';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {FilterItem} from '../../../shared/Interface/common.interface';
import CustomPaginationWithPageNumber from '../training/components/CustomPaginationWithPageNumber';
import {useRouter} from 'next/router';

const PREFIX = 'MyJobs';

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

const MyJobsPage = () => {
  const {formatNumber} = useIntl();
  const router = useRouter();

  const [pageInfo, setPageInfo] = useState<{
    page_size: number;
    page: number;
    search_text?: string;
  } | null>(null);

  const {
    data: jobs,
    metaData: jobsMetaData,
    isLoading,
    mutate: mutateJobs,
  } = useFetchMyJobs(pageInfo);

  const [viewType, setViewType] = useState(0); //viewType 1== grid view

  useEffect(() => {
    setPageInfo({
      ...router.query,
      page_size:
        Number(router.query?.page_size) > 0
          ? Number(router.query?.page_size)
          : PageSizes.EIGHT,
      page: router.query?.page ? Number(router.query?.page) : 1,
    });
  }, [router.query]);

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
    <React.Fragment>
      <JobListSearchSection
        addFilterKey={filterJobList}
        routeParamsFilters={filterJobListByRouteParams}
      />
      <StyledContainer maxWidth='lg' sx={{marginBottom: '25px'}}>
        <Grid container mt={4} justifyContent={'center'}>
          <Grid item md={12} mt={{xs: 4, md: 5}}>
            <Grid container spacing={4}>
              {isLoading ? (
                <PostLoadingSkeleton />
              ) : !jobs || jobs.length == 0 ? (
                <NoDataFoundComponent />
              ) : (
                <>
                  <Grid item xs={12}>
                    <Grid container justifyContent={'space-between'}>
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
                      <Grid item>
                        <ListAlt
                          color={'primary'}
                          fontSize={'medium'}
                          className={
                            viewType == 0
                              ? classes.activeStyle
                              : classes.viewIcon
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
                            viewType == 1
                              ? classes.activeStyle
                              : classes.viewIcon
                          }
                          sx={{marginLeft: '10px'}}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {jobs.map((job: any) => {
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
                          isShowingInMyJobs={true}
                        />
                      </Grid>
                    );
                  })}
                </>
              )}
              <Grid item xs={12}>
                <CustomPaginationWithPageNumber
                  metaData={jobsMetaData}
                  pageInfo={pageInfo}
                  onPaginationChange={onPaginationChange}
                  rowsPerPage={Number(router.query.page_size)}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </StyledContainer>
    </React.Fragment>
  );
};

export default MyJobsPage;
