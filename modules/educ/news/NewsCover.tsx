import React from 'react';
import {Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {Fonts} from '../../../shared/constants/AppEnums';
import {Link} from '../../../@core/elements/common';
import {useIntl} from 'react-intl';
import {LINK_FRONTEND_NEWS_DETAILS} from '../../../@core/common/appLinks';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';

const PREFIX = 'NewsCover';

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
  borderRadius: '20px',
  [`& .${classes.titleStyle}`]: {
    fontWeight: Fonts.MEDIUM,
    fontSize: '2.25rem',
    marginBottom: '14px',
  },
  [`& .${classes.moreDetailsBtn}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    fontSize: '1.25rem',
    textTransform: 'none',
    [`&:hover,&:focus,&.active`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
}));

const NewsCover = ({featuredItem}: any) => {
  const {messages, formatDate} = useIntl();

  return (
    <StyledStack
      spacing={1}
      aria-label={featuredItem?.image_alt_title}
      role={'heading'}
      tabIndex={0}
      sx={{
        backgroundImage: `url(${
          featuredItem?.main_image_path
            ? FILE_SERVER_FILE_VIEW_ENDPOINT + featuredItem?.main_image_path
            : '/images/blank_image.png'
        })`,
      }}>
      <Typography tabIndex={0} variant={'h6'}>
        {getIntlDateFromString(formatDate, featuredItem?.created_at)}
      </Typography>
      <Typography tabIndex={0} className={classes.titleStyle} variant={'h4'}>
        {featuredItem?.title}
      </Typography>
      <Link href={LINK_FRONTEND_NEWS_DETAILS + featuredItem?.id} passHref>
        <Button
          className={classes.moreDetailsBtn}
          variant={'contained'}
          size={'large'}
          endIcon={<KeyboardArrowRightIcon />}>
          {messages['common.read_more_details']}
        </Button>
      </Link>
    </StyledStack>
  );
};

export default NewsCover;
