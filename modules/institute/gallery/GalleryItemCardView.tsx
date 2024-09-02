import {Card, CardActionArea, CardContent, Typography} from '@mui/material';
import React from 'react';
import {Link} from '../../../@core/elements/common';
import {styled} from '@mui/material/styles';
import {LINK_FRONTEND_INSTITUTE_GALLERY} from '../../../@core/common/appLinks';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';

const StyledTypography = styled(Typography)(({theme}) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

function GalleryItemCardView({item}: any) {
  let path = LINK_FRONTEND_INSTITUTE_GALLERY;

  let image;
  if (item?.grid_image_path) {
    image = item?.grid_image_path;
  } else {
    image = item?.main_image_path;
  }

  return (
    <>
      <Link href={`${path}/${item.id}`} passHref>
        <Card>
          <CardActionArea>
            <CardMediaImageView
              height='150'
              image={image}
              sx={{objectFit: 'unset'}}
              alt={item?.image_alt_title ? item?.image_alt_title : item?.title}
              title={item?.title}
            />

            <CardContent>
              <StyledTypography gutterBottom variant='body1'>
                {item?.title}
              </StyledTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </>
  );
}

export default GalleryItemCardView;
