import {styled} from '@mui/material/styles';
import {Container, Grid, Paper, Skeleton} from '@mui/material';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {H1} from '../../../@core/elements/common';
import GalleryItemCardView from './GalleryItemCardView';
import PageSizes from '../../../@core/utilities/PageSizes';
import {useFetchPublicGalleryAlbums} from '../../../services/cmsManagement/hooks';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import CustomPaginationWithPageNumber from '../../learner/training/components/CustomPaginationWithPageNumber';
import {useRouter} from 'next/router';

const PREFIX = 'InstituteGallery';

const classes = {
  searchIcon: `${PREFIX}-searchIcon`,
  filterIcon: `${PREFIX}-filterIcon`,
  resetButton: `${PREFIX}-resetButton`,
  heading: `${PREFIX}-heading`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  padding: '0 !important',
  [`& .${classes.searchIcon}`]: {
    position: 'absolute',
    right: 0,
  },
  [`& .${classes.heading}`]: {
    boxShadow: '0px 2px 2px #8888',
  },
  [`& .${classes.filterIcon}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.resetButton}`]: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: '3% !important',
    },
  },
}));

const InstituteGallery = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const [pageInfo, setPageInfo] = useState<{
    page_size: number;
    page: number;
  } | null>(null);

  const [totalData, setTotalData] = useState<number>(0);

  const {
    data: galleryItems,
    isLoading: isLoadingGalleryItems,
    metaData,
  } = useFetchPublicGalleryAlbums(pageInfo);

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
    if (metaData?.total > 0 && metaData?.total !== totalData)
      setTotalData(metaData?.total);
  }, [metaData]);

  useEffect(() => {
    if (!router.query?.page || !router.query?.page_size) return;

    setPageInfo({
      page_size: router.query?.page_size
        ? Number(router.query?.page_size)
        : PageSizes.EIGHT,
      page: router.query?.page ? Number(router.query?.page) : 1,
    });
  }, [router.query]);

  useEffect(() => {
    if (isLoadingGalleryItems !== false) return;

    const {page_size, page, ...others} = router.query;

    if (!others && galleryItems?.length === 0 && page && page_size) {
      if (galleryItems?.length === 0) {
        let pageNo = Number(
          Math.ceil(Number(totalData / Number(router.query.page_size))),
        );
        pageNo = pageNo > 0 ? pageNo : 1;

        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              page: pageNo,
            },
          },
          undefined,
          {shallow: true},
        );
      }
    }
  }, [galleryItems]);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      urlParamsUpdate({
        ...router.query,
        page: router.query?.page,
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
    <>
      <Grid container sx={{maxWidth: '100%'}}>
        <Grid item xs={12} textAlign={'center'}>
          <Paper>
            <H1 py={3} style={{fontWeight: 'bold', fontSize: '2.25rem'}}>
              {messages['common.gallery_album']}
            </H1>
          </Paper>
        </Grid>
      </Grid>
      <StyledContainer maxWidth='lg'>
        <Grid container justifyContent={'center'}>
          {isLoadingGalleryItems ? (
            <Grid
              item
              xs={12}
              sx={{display: 'flex', justifyContent: 'space-evenly'}}>
              <Skeleton variant='rectangular' width={'22%'} height={140} />
              <Skeleton variant='rectangular' width={'22%'} height={140} />
              <Skeleton variant='rectangular' width={'22%'} height={140} />
              <Skeleton variant='rectangular' width={'22%'} height={140} />
            </Grid>
          ) : galleryItems && galleryItems?.length > 0 ? (
            <Grid item md={12} mt={{xs: 1, md: 2}}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid container spacing={5}>
                    {galleryItems?.map((data: any) => (
                      <Grid
                        item
                        md={3}
                        justifyContent={'center'}
                        mt={3}
                        key={data.id}>
                        <GalleryItemCardView item={data} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

              <CustomPaginationWithPageNumber
                metaData={metaData}
                pageInfo={pageInfo}
                onPaginationChange={onPaginationChange}
                rowsPerPage={Number(router?.query?.page_size)}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          ) : (
            <Grid container justifyContent={'center'}>
              <Grid item>
                <NoDataFoundComponent messageTextType={'h6'} />
              </Grid>
            </Grid>
          )}
        </Grid>
      </StyledContainer>
    </>
  );
};

export default InstituteGallery;
