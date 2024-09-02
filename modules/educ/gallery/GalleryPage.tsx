import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Container, Grid, Typography} from '@mui/material';
import SectionHeading from '../../../@core/elements/common/SectionHeading';
import {useIntl} from 'react-intl';
import RowStatus from '../../../@core/utilities/RowStatus';
import {useFetchPublicGalleryAlbums} from '../../../services/global/hooks';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import GalleryPageSkeleton from './GalleryPageSkeleton';
import {LINK_FRONTEND_INSTITUTE_GALLERY} from '../../../@core/common/appLinks';
import Link from 'next/link';
import PaginationComponent from '../../home/components/PaginationComponent';

const PREFIX = 'GalleryPage';

const classes = {
  headerTitle: `${PREFIX}-headerTitle`,
  paginationContainer: `${PREFIX}-paginationContainer`,
  imageStyle: `${PREFIX}-imageStyle`,
  albumContainer: `${PREFIX}-albumContainer`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  justifyContent: 'center',

  [`& .${classes.headerTitle}`]: {
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
  },
  [`& .${classes.imageStyle}`]: {
    height: '200px',
    borderRadius: '10px',
  },
  [`& .${classes.paginationContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.albumContainer}`]: {
    cursor: 'pointer',
  },
}));

const GalleryPage = () => {
  const {messages} = useIntl();

  const [galleryAlbumFilters, setGalleryAlbumFilters] = useState<any>({
    only_parent_gallery_album: 1,
    row_status: RowStatus.ACTIVE,
    show_in: ShowInTypes.NICE3,
  });
  const {
    data: galleryAlbums,
    isLoading: isLoadingGalleryAlbums,
    metaData,
  } = useFetchPublicGalleryAlbums(galleryAlbumFilters);

  const getImagePath = (item: any) => {
    let image;
    if (item?.grid_image_path) {
      image = item?.grid_image_path;
    } else {
      image = item?.main_image_path;
    }
    return image;
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container spacing={3} mb={4} mt={{xs: 0, md: 4}}>
        <Grid item xs={12}>
          <SectionHeading
            className={classes.headerTitle}
            title={messages['common.gallery'] as string}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {isLoadingGalleryAlbums ? (
              <GalleryPageSkeleton />
            ) : galleryAlbums?.length > 0 ? (
              <>
                {galleryAlbums?.map((galleryItem: any, index: number) => (
                  <Link
                    href={
                      LINK_FRONTEND_INSTITUTE_GALLERY + `/${galleryItem.id}`
                    }
                    passHref>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      key={index}
                      className={classes.albumContainer}>
                      <CardMediaImageView
                        image={getImagePath(galleryItem)}
                        className={classes.imageStyle}
                        title={galleryItem?.title}
                        alt={
                          galleryItem?.image_alt_title
                            ? galleryItem?.image_alt_title
                            : galleryItem?.title
                        }
                      />
                      <Typography
                        tabIndex={0}
                        variant={'h6'}
                        mt={1}
                        textAlign={'center'}>
                        {galleryItem?.title}
                      </Typography>
                    </Grid>
                  </Link>
                ))}
              </>
            ) : (
              <NoDataFoundComponent />
            )}
          </Grid>
        </Grid>
        <Grid item className={classes.paginationContainer} xs={12}>
          {galleryAlbums &&
            metaData?.total_page &&
            galleryAlbums?.length > 0 && (
              <PaginationComponent
                setPaginationFilter={setGalleryAlbumFilters}
                pageMetaData={metaData}
              />
            )}
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default GalleryPage;
