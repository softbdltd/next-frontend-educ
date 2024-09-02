import {styled} from '@mui/material/styles';
import {
  Box,
  Chip,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Stack,
} from '@mui/material';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {H1, H2} from '../../../@core/elements/common';
import SearchIcon from '@mui/icons-material/Search';
import GalleryItemCardView from './GalleryItemCardView';
import {
  useFetchPublicGalleryAlbum,
  useFetchPublicGalleryAlbumContents,
  useFetchPublicGalleryAlbums,
} from '../../../services/cmsManagement/hooks';
import {useRouter} from 'next/router';
import ContentItemCard from './ContentItemCard';
import CustomizedDialogs from '../Components/ImageDialog';
import RowStatus from '../../../@core/utilities/RowStatus';
import PageSizes from '../../../@core/utilities/PageSizes';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import CustomPaginationWithPageNumber from '../../learner/training/components/CustomPaginationWithPageNumber';
import {
  objectFilter,
  urlParamsUpdate,
} from '../../../@core/utilities/helpers';

const PREFIX = 'GalleryAlbumDetails';

const classes = {
  searchIcon: `${PREFIX}-searchIcon`,
  coverImageBox: `${PREFIX}-coverImageBox`,
  coverImage: `${PREFIX}-coverImage`,
  coverTitle: `${PREFIX}-coverTitle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  padding: '0 !important',
  position: 'relative',
  marginBottom: '20px',
  [`& .${classes.searchIcon}`]: {
    position: 'absolute',
    right: 0,
  },
  [`& .${classes.coverImageBox}`]: {
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('xl')]: {
      height: 550,
    },
    [theme.breakpoints.down('sm')]: {
      height: 150,
    },
  },
  [`& .${classes.coverImage}`]: {
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    height: 400,
    position: 'absolute',
    objectFit: 'unset',
    [theme.breakpoints.up('xl')]: {
      height: 550,
    },
    [theme.breakpoints.down('sm')]: {
      height: 150,
    },
  },
  [`& .${classes.coverTitle}`]: {
    // background: theme.palette.common.white,
    // color: theme.palette.primary.main,
    margin: 'auto',
    zIndex: 1,
    padding: '10px',
    fontSize: '2.25rem',
    fontWeight: 'bold',
  },
}));

const GalleryAlbumDetails = () => {
  const {messages, formatNumber} = useIntl();
  const router = useRouter();
  const {albumDetailsId: galleryAlbumId}: any = router.query;

  const inputFieldRef = useRef<any>();
  /** Data fetching for child gallery albums **/

  const [childGalleryAlbumFilter, setChildGalleryAlbumFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: childGalleryAlbums, isLoading: isLoadingChildGalleryAlbums} =
    useFetchPublicGalleryAlbums(childGalleryAlbumFilter);
  /** data fetching for current gallery album **/
  const {data: currentGalleryAlbum, isLoading} =
    useFetchPublicGalleryAlbum(galleryAlbumId);

  /** Data fetching for  gallery album contents **/
  const [pageInfo, setPageInfo] = useState<any>(null);
  const {
    data: galleryAlbumContents,
    isLoading: isLoadingGalleryAlbumContents,
    metaData,
  } = useFetchPublicGalleryAlbumContents(pageInfo);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    if (galleryAlbumId) {
      setChildGalleryAlbumFilter((prev: any) => {
        return {...prev, ...{parent_gallery_album_id: galleryAlbumId}};
      });

      setPageInfo((prev: any) => {
        return objectFilter({...prev, ...{gallery_album_id: galleryAlbumId}});
      });
    }
  }, [galleryAlbumId]);

  useEffect(() => {
    setPageInfo(
      objectFilter({
        ...router.query,
        page_size:
          Number(router.query?.page_size) > 0
            ? Number(router.query?.page_size)
            : PageSizes.EIGHT,
        page: router.query?.page ? Number(router.query?.page) : 1,
        search_text: (router.query?.search_text as string) ?? '',
        gallery_album_id: router.query?.albumDetailsId,
      }),
    );
  }, [router.query]);

  useEffect(() => {
    if (router.query?.page == '1') return;
    if (isLoadingGalleryAlbumContents !== false) return;
    if (
      Object.keys(router.query).length > 0 &&
      galleryAlbumContents?.length === 0
    ) {
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
  }, [galleryAlbumContents]);

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

  const onSearch = useCallback(() => {
    setPageInfo((params: any) => {
      return objectFilter({
        ...params,
        ...{search_text: inputFieldRef.current?.value},
      });
    });

    /*todo: it will apply after add reset button*/
    /*const obj = objectFilter({
      ...router.query,
      search_text: inputFieldRef.current?.value ?? '',
    });

    urlParamsUpdate(router, obj);*/
  }, []);

  const onCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // TODO: css issue - fix grid responsiveness

  return (
    <>
      <StyledContainer maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {isLoading ? (
              <Skeleton variant='rectangular' width={'100%'} height={350} />
            ) : (
              <Stack spacing={3}>
                <Box className={classes.coverImageBox}>
                  <CardMediaImageView
                    image={currentGalleryAlbum?.main_image_path}
                    className={classes.coverImage}
                    alt={
                      currentGalleryAlbum?.image_alt_title
                        ? currentGalleryAlbum?.image_alt_title
                        : currentGalleryAlbum?.title
                    }
                    title={currentGalleryAlbum?.title}
                  />
                </Box>
                <H1 gutterBottom className={classes.coverTitle}>
                  {currentGalleryAlbum?.title}
                </H1>
              </Stack>
            )}
          </Grid>
          {isLoadingChildGalleryAlbums ? (
            <Grid
              item
              xs={12}
              sx={{display: 'flex', justifyContent: 'space-evenly'}}>
              <Skeleton variant='rectangular' width={'23%'} height={140} />
              <Skeleton variant='rectangular' width={'23%'} height={140} />
              <Skeleton variant='rectangular' width={'23%'} height={140} />
              <Skeleton variant='rectangular' width={'23%'} height={140} />
            </Grid>
          ) : (
            childGalleryAlbums &&
            childGalleryAlbums?.length > 0 && (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <H2 style={{fontSize: '1.875rem'}}>
                      {messages['common.gallery_album']}
                    </H2>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={5}>
                      {childGalleryAlbums?.map((data: any) => (
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
              </Grid>
            )
          )}
          {/*Todo: this margin top is a temporary fix for design*/}
          <Grid item xs={12} sx={{marginTop: '100px'}}>
            <Grid container>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <H2
                    style={{fontSize: '1.875rem'}}
                    display={'flex'}
                    alignItems={'center'}>
                    {messages['total_result.institute']}
                    <Chip
                      label={formatNumber(
                        galleryAlbumContents ? galleryAlbumContents.length : 0,
                      )}
                      color={'primary'}
                      sx={{marginLeft: '5px'}}
                    />
                  </H2>
                  <Paper
                    style={{
                      padding: '7px 0px',
                    }}>
                    <InputBase
                      size={'small'}
                      style={{
                        paddingLeft: '20px',
                      }}
                      placeholder={messages['common.search'] as string}
                      inputProps={{'aria-label': 'Search'}}
                      inputRef={inputFieldRef}
                      onKeyDown={(event) => {
                        if (event.code == 'Enter') onSearch();
                      }}
                    />
                    <IconButton
                      sx={{p: '5px'}}
                      aria-label='search'
                      onClick={onSearch}>
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </Box>
              </Grid>
              {isLoadingGalleryAlbumContents ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    marginTop: '15px',
                  }}>
                  <Skeleton variant='rectangular' width={'23%'} height={140} />
                  <Skeleton variant='rectangular' width={'23%'} height={140} />
                  <Skeleton variant='rectangular' width={'23%'} height={140} />
                  <Skeleton variant='rectangular' width={'23%'} height={140} />
                </Grid>
              ) : galleryAlbumContents && galleryAlbumContents?.length > 0 ? (
                <Grid item xs={12}>
                  <Grid container spacing={5}>
                    {(galleryAlbumContents || []).map((data: any) => (
                      <Grid
                        item
                        md={3}
                        justifyContent={'center'}
                        mt={3}
                        key={data.id}>
                        <ContentItemCard
                          data={data}
                          onClick={(eventData: any) => {
                            setVideoData(eventData);
                            setOpenDialog(true);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12} textAlign={'center'}>
                  <NoDataFoundComponent messageTextType={'h6'} />
                </Grid>
              )}
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
      </StyledContainer>
      {openDialog && videoData && (
        <CustomizedDialogs data={videoData} onClose={onCloseDialog} />
      )}
    </>
  );
};

export default GalleryAlbumDetails;
