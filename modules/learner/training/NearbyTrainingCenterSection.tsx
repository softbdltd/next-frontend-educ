import {ChevronRight} from '@mui/icons-material';
import {Button, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {H2, Link} from '../../../@core/elements/common';
import {objectFilter} from '../../../@core/utilities/helpers';
import PageSizes from '../../../@core/utilities/PageSizes';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchPublicTrainingCenters} from '../../../services/instituteManagement/hooks';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import {urlParamsUpdate} from '../learnerConstants';
import CustomPaginationWithPageNumber from './components/CustomPaginationWithPageNumber';
import TrainingCenterCard from './components/TrainingCenterCard';
import NoticeOrNewsTypes from '../../../@core/utilities/NoticeOrNewsTypes';

const PREFIX = 'NearbyTrainingCenterSection';

export const classes = {
  subHeader: `${PREFIX}-subHeader`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.subHeader}`]: {
    fontSize: '1.421875rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

interface NearbyTrainingCenterSectionProps {
  showAllNearbyTrainingCenter: boolean;
}

const NearbyTrainingCenterSection = ({
  showAllNearbyTrainingCenter,
}: NearbyTrainingCenterSectionProps) => {
  const {messages} = useIntl();
  const authUser = useAuthUser<YouthAuthUser>();
  const router = useRouter();

  // const [nearbyTrainingCenterFilters, setNearbyTrainingCenterFilters] =
  //   useState<any>(null);

  const [pageInfo, setPageInfo] = useState<any>(null);

  const {
    data: nearbyTrainingCenters,
    isLoading: isLoadingNearbyTrainingCenter,
    metaData: trainingCentersMetaData,
  } = useFetchPublicTrainingCenters(pageInfo);

  useEffect(() => {
    if (showAllNearbyTrainingCenter) {
      setPageInfo(
        objectFilter({
          ...router.query,
          type: NoticeOrNewsTypes.NOTICE,
          district_id: authUser?.loc_district_id,
          loc_upazila_municipality_id: authUser?.loc_upazila_municipality_id,
          page_size: router.query?.page_size
            ? Number(router.query?.page_size)
            : PageSizes.EIGHT,
          page: router.query?.page ? Number(router.query?.page) : 1,
        }),
      );
    }
  }, [authUser, router.query]);

  useEffect(() => {
    if (router.query?.page == '1') return;
    if (isLoadingNearbyTrainingCenter !== false) return;
    const {type: _, ...others} = router.query;
    if (Object.keys(others).length > 0 && nearbyTrainingCenters?.length === 0) {
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
  }, [nearbyTrainingCenters]);

  const onPaginationChange = useCallback(
    (event: any, currentPage: number) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: currentPage ?? 1,
        page_size: router.query?.page_size ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageInfo((prev: any) => ({
        ...prev,
        page: router.query?.page ?? 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      }));
      urlParamsUpdate(router, {
        ...router.query,
        page: router.query?.page ?? 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  return (
    <StyledGrid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Grid container alignItems={'center'}>
          <Grid item xs={6} sm={9} md={10}>
            <H2 className={classes.subHeader}>
              {messages['common.nearby_training_center']}
            </H2>
          </Grid>
          {!showAllNearbyTrainingCenter && (
            <Grid item xs={6} sm={3} md={2} style={{textAlign: 'right'}}>
              <Link
                href={'/training/nearby-training-centers'}
                style={{display: 'inline-block'}}>
                <Button variant={'outlined'} size={'medium'} color={'primary'}>
                  {messages['common.see_all']}
                  <ChevronRight />
                </Button>
              </Link>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Grid container spacing={3}>
          {isLoadingNearbyTrainingCenter ? (
            <Grid item xs={12}>
              <BoxCardsSkeleton />
            </Grid>
          ) : nearbyTrainingCenters && nearbyTrainingCenters.length ? (
            <>
              {nearbyTrainingCenters.map((trainingCenter: any) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={trainingCenter.id}>
                    <TrainingCenterCard trainingCenter={trainingCenter} />
                  </Grid>
                );
              })}
            </>
          ) : (
            <NoDataFoundComponent />
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CustomPaginationWithPageNumber
          metaData={trainingCentersMetaData}
          pageInfo={pageInfo}
          onPaginationChange={onPaginationChange}
          rowsPerPage={Number(router.query.page_size)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </StyledGrid>
  );
};

export default NearbyTrainingCenterSection;
