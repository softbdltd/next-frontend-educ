import React from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {Fonts} from '../../../shared/constants/AppEnums';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import {Link} from '../../../@core/elements/common';

const PREFIX = 'PictureSlider';

const classes = {
  moreDetailsBtn: `${PREFIX}-moreDetailsBtn`,
  titleStyle: `${PREFIX}-titleStyle`,
};

const StyledStack = styled(Stack)(({theme}) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '360px',
  justifyContent: 'flex-end',
  padding: '35px 16px',
  color: theme.palette.common.white,
  borderRadius: 20,
  marginBottom: 8,

  [`& .${classes.titleStyle}`]: {
    fontWeight: Fonts.BOLD,
  },
  [`& .${classes.moreDetailsBtn}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    textTransform: 'none',
    [`&:hover,&:focus,&.active`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
}));

const PictureSlider = ({banner}: any) => {
  const {
    banner_image_path,
    button_text,
    title,
    sub_title,
    is_button_available,
    banner_template_code,
    link,
    image_alt_title,
  } = banner || {};

  return (
    <StyledStack
      spacing={2}
      aria-label={`${image_alt_title ? image_alt_title : ''} slider image`}
      sx={{
        backgroundImage: `url(${
          FILE_SERVER_FILE_VIEW_ENDPOINT + banner_image_path
        })`,
      }}>
      {banner_template_code === 'BT_OB' && (
        <>
          <Typography
            tabIndex={0}
            className={classes.titleStyle}
            variant={'h2'}>
            {title}
          </Typography>
          <Typography tabIndex={0} variant={'body1'}>
            {sub_title}
          </Typography>
          {is_button_available && button_text ? (
            <Box>
              <Link href={link}>
                <Button
                  className={classes.moreDetailsBtn}
                  variant={'contained'}>
                  {button_text}
                </Button>
              </Link>
            </Box>
          ) : (
            <></>
          )}
        </>
      )}
    </StyledStack>
  );
};

export default PictureSlider;
