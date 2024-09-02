import {styled} from '@mui/material/styles';
import {Box, Button, Container, Grid} from '@mui/material';
import {ArrowRightAlt} from '@mui/icons-material';
import {Fade} from 'react-awesome-reveal';
import UnderlinedHeading from '../../@core/elements/common/UnderlinedHeading';
import CustomCarousel from '../../@core/elements/display/CustomCarousel/CustomCarousel';
import GalleryItemCardView from './gallery/GalleryItemCardView';
import {Link} from '../../@core/elements/common';
import {LINK_FRONTEND_INSTITUTE_GALLERY} from '../../@core/common/appLinks';
import {useIntl} from 'react-intl';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import React, {useState} from 'react';
import BoxCardsSkeleton from './Components/BoxCardsSkeleton';
import RowStatus from '../../@core/utilities/RowStatus';
import {useFetchPublicGalleryAlbums} from '../../services/cmsManagement/hooks';

const PREFIX = 'GallerySection';

const classes = {
  boxItem: `${PREFIX}-boxItem`,
  button: `${PREFIX}-button`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.boxItem}`]: {
    background: theme.palette.background.paper,
    borderRadius: 4 * parseInt(theme.shape.borderRadius.toString()),
    padding: '15px 10px 35px',
    margin: 0,
    [theme.breakpoints.down('xl')]: {
      padding: '20px 10px 30px 10px',
    },
  },

  [`& .${classes.button}`]: {
    borderRadius: 40,
  },
  '& .react-multi-carousel-list .react-multiple-carousel__arrow--left': {
    left: 0,
  },
  '& .react-multi-carousel-list .react-multiple-carousel__arrow--right': {
    right: 0,
  },
  '& .react-multi-carousel-list .react-multiple-carousel__arrow--left::before, & .react-multi-carousel-list .react-multiple-carousel__arrow--right::before':
    {
      color: '#fff',
    },
}));

const GallerySection = () => {
  const {messages} = useIntl();
  const pageSize = 10;
  const [galleryFilter] = useState<any>({
    only_parent_gallery_album: 1,
    page_size: pageSize,
    row_status: RowStatus.ACTIVE,
  });

  const {data: galleryItems, isLoading: isLoadingGallery} =
    useFetchPublicGalleryAlbums(galleryFilter);

  return (
    <StyledContainer maxWidth='lg'>
      <Grid container sx={{marginTop: '60px'}}>
        <Grid item xs={12}>
          <Fade direction='up'>
            <UnderlinedHeading>
              {messages['common.gallery_album']}
            </UnderlinedHeading>
            {isLoadingGallery ? (
              <BoxCardsSkeleton />
            ) : galleryItems && galleryItems.length ? (
              <Box>
                <Box>
                  <CustomCarousel>
                    {galleryItems.map((galleryItem: any, i: number) => (
                      <Box key={galleryItem.id} className={classes.boxItem}>
                        <GalleryItemCardView item={galleryItem} />
                      </Box>
                    ))}
                  </CustomCarousel>
                </Box>
                <Box display='flex' justifyContent='center'>
                  <Link href={LINK_FRONTEND_INSTITUTE_GALLERY}>
                    <Button
                      variant='outlined'
                      size='large'
                      endIcon={<ArrowRightAlt />}
                      className={classes.button}>
                      {messages['common.see_more']}
                    </Button>
                  </Link>
                </Box>
              </Box>
            ) : (
              <NoDataFoundComponent messageTextType={'h6'} />
            )}
          </Fade>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};
export default GallerySection;
