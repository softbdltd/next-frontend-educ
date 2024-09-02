import {Box} from '@mui/material';
import React from 'react';
import {styled} from '@mui/material/styles';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';

const PREFIX = 'LandingBannerTemplateCenterBackground';

const classes = {
  image: `${PREFIX}-image`,
};

const StyledBox = styled(Box)(({theme}) => ({
  height: 'auto',
  width: '100%',
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  zIndex: 0,

  [`& .${classes.image}`]: {
    zIndex: -1,
    objectFit: 'unset',
    height: 'auto',
    width: '100%',
  },
}));

interface BannerProps {
  banner: any;
}

const LandingBannerTemplateBackground = ({banner}: BannerProps) => {
  return (
    <StyledBox>
      <CardMediaImageView
        image={banner?.banner_image_path}
        className={classes.image}
        alt={banner?.image_alt_title ? banner?.image_alt_title : banner?.title}
        title={banner?.title}
      />
    </StyledBox>
  );
};

export default LandingBannerTemplateBackground;
