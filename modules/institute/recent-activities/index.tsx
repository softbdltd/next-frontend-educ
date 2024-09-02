import {Box, Container, Grid, Skeleton} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import RecentActivityCardView from './RecentActivityCardView';
import RecentActivityMasonryGroupView from './RecentActivityMasonryGroupView';
import React, {useCallback, useEffect, useState} from 'react';
import RowStatus from '../../../@core/utilities/RowStatus';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import {H1, H2} from '../../../@core/elements/common';
import PageSizes from '../../../@core/utilities/PageSizes';
import {
  useFetchPublicRecentActivities,
  useFetchPublicRecentActivitiesCollages,
} from '../../../services/cmsManagement/hooks';
import CustomPaginationWithPageNumber from '../../learner/training/components/CustomPaginationWithPageNumber';
import {useRouter} from 'next/router';

let defaultImage = '/images/recent_activity_blank.avif';

const PREFIX = 'RecentActivities';

const classes = {
  titleTypography: `${PREFIX}-titleTypography`,
  pagination: `${PREFIX}-pagination`,
  image: `${PREFIX}-image`,
  paginationBox: `${PREFIX}-paginationBox`,
};

const StyledContainer = styled(Container)(({theme}) => {
  return {
    [`& .${classes.titleTypography}`]: {
      color: theme.palette.primary.dark,
      fontSize: '1.640625rem',
      fontWeight: 'bold',
    },
    [`& .${classes.pagination}`]: {
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    [`& .${classes.image}`]: {
      overflow: 'hidden',
    },

    [`& .${classes.paginationBox}`]: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
    },
  };
});

const RecentActivities = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const [recentActivityMasonryFilter] = useState<any>({});
  const {
    data: collagesRecentActivities,
    isLoading: isLoadingCollagesRecentActivities,
  } = useFetchPublicRecentActivitiesCollages(recentActivityMasonryFilter);

  const [pageInfo, setPageInfo] = useState<any>(null);
  const [totalData, setTotalData] = useState<number>(0);

  const {
    data: recentActivities,
    metaData,
    isLoading: isLoadingRecentActivities,
  } = useFetchPublicRecentActivities(pageInfo);

  const [recentActivitiesMasonryList, setRecentActivitiesMasonryList] =
    useState<any>([]);

  const urlParamsUpdate = (params: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: params,
      },
      undefined,
      {shallow: true},
    );
  };

  useEffect(() => {
    if (metaData?.total > 0 && metaData?.total !== totalData)
      setTotalData(metaData?.total);
  }, [metaData]);

  useEffect(() => {
    let final = [];
    for (let i = 0; i < 4; i++) {
      final.push({
        collage_position: i + 1,
        collage_image_path: defaultImage,
      });
    }

    if (collagesRecentActivities) {
      for (let item of collagesRecentActivities) {
        let index = item.collage_position - 1;
        final[index] = {...item};
      }
    }

    setRecentActivitiesMasonryList(final);
  }, [collagesRecentActivities]);

  useEffect(() => {
    if (router.query?.page && router.query?.page_size) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router?.query,
          page: Number(router.query?.page) > 0 ? router.query?.page : 1,
          page_size:
            Number(router.query?.page_size) > 0
              ? router.query?.page_size
              : PageSizes.EIGHT,
        },
      },
      undefined,
      {shallow: true},
    );
  }, []);

  useEffect(() => {
    if (!router.query?.page || !router.query?.page_size) return;

    setPageInfo({
      page_size: router.query?.page_size
        ? Number(router.query?.page_size)
        : PageSizes.EIGHT,
      page: router.query?.page ? Number(router.query?.page) : 1,
      row_status: RowStatus.ACTIVE,
    });
  }, [router.query]);

  useEffect(() => {
    if (isLoadingRecentActivities !== false) return;

    const {page_size, page, ...others} = router.query;

    if (
      !others &&
      recentActivities?.length === 0 &&
      page &&
      page != '1' &&
      page_size
    ) {
      if (recentActivities?.length === 0) {
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
    }
  }, [recentActivities]);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      urlParamsUpdate({
        ...router.query,
        page: 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const onPaginationChange = useCallback(
    (event: any, currentPage: number) => {
      urlParamsUpdate({
        ...router.query,
        page: currentPage,
        page_size: router.query?.page_size ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container my={5}>
        <Grid item md={12}>
          <H1 className={classes.titleTypography} gutterBottom>
            {messages['recent_activities.label']}
          </H1>
          {isLoadingCollagesRecentActivities ? (
            <Skeleton variant={'rectangular'} width={1150} height={400} />
          ) : (
            <RecentActivityMasonryGroupView
              items={recentActivitiesMasonryList}
            />
          )}
        </Grid>
        <Grid item mt={8} xs={12}>
          <H2 className={classes.titleTypography} gutterBottom>
            {messages['all_activities.institute']}
          </H2>
          {isLoadingRecentActivities ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  marginTop: '20px',
                  justifyContent: 'space-around',
                }}>
                <Skeleton variant='rectangular' width={250} height={150} />
                <Skeleton variant='rectangular' width={250} height={150} />
                <Skeleton variant='rectangular' width={250} height={150} />
                <Skeleton variant='rectangular' width={250} height={150} />
              </Box>
            </>
          ) : recentActivities && recentActivities?.length > 0 ? (
            <Grid container spacing={3}>
              {recentActivities.map((activity: any) => (
                <Grid item xs={12} md={3} mt={3} key={activity.id}>
                  <RecentActivityCardView activity={activity} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoDataFoundComponent messageTextType={'h6'} />
          )}
        </Grid>
      </Grid>

      <CustomPaginationWithPageNumber
        metaData={metaData}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
        rowsPerPage={Number(router?.query?.page_size)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </StyledContainer>
  );
};

export default RecentActivities;
