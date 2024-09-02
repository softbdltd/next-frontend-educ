import {Box, Typography} from '@mui/material';
import React from 'react';
import {styled} from '@mui/material/styles';
import {SeeMoreLinkButton} from '../../../@core/elements/common';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import {useIntl} from 'react-intl';

const PREFIX = 'LandingBannerTemplateCenterBackground';

const classes = {
  image: `${PREFIX}-image`,
  heading: `${PREFIX}-heading`,
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

  [`& .${classes.heading}`]: {
    color: theme.palette.background.paper,
    justifySelf: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
  },
}));

interface BannerProps {
  banner: any;
}

const LandingBannerTemplateCenterBackground = ({banner}: BannerProps) => {
  const {messages} = useIntl();
  return (
    <StyledBox>
      <CardMediaImageView
        image={banner?.banner_image_path}
        className={classes.image}
        alt={banner?.image_alt_title ? banner?.image_alt_title : banner?.title}
        title={banner?.title}
      />
      <Box sx={{position: 'absolute', display: 'flex', height: '100%'}}>
        <Box sx={{margin: 'auto'}}>
          <Typography variant='h3' className={classes.heading}>
            {banner?.title}
          </Typography>
          {banner?.is_button_available ? (
            <SeeMoreLinkButton
              href={banner?.link}
              label={messages['common.see_more'] as string}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
              variant='contained'
              color={'primary'}
            />
          ) : (
            ''
          )}
        </Box>
      </Box>
    </StyledBox>
  );
};

export default LandingBannerTemplateCenterBackground;
