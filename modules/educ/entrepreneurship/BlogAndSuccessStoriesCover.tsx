import React from 'react';
import {Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {Fonts} from '../../../shared/constants/AppEnums';
import {Link} from '../../../@core/elements/common';
import {useIntl} from 'react-intl';
import {LINK_FRONTEND_ENTREPRENEURSHIP_DETAILS} from '../../../@core/common/appLinks';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';

const PREFIX = 'BlogAndSuccessStoriesCover';

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

const BlogAndSuccessStoriesCover = ({featuredItem}: any) => {
  const {messages, formatDate} = useIntl();

  return (
    <StyledStack
      spacing={1}
      sx={{
        backgroundImage: `url(${
          featuredItem?.cover_image
            ? FILE_SERVER_FILE_VIEW_ENDPOINT + featuredItem?.cover_image
            : 'images/blank_image.png'
        })`,
      }}>
      <Typography variant={'h6'}>
        {getIntlDateFromString(formatDate, featuredItem?.created_at)}
      </Typography>
      <Typography className={classes.titleStyle} variant={'h2'}>
        {featuredItem?.title}
      </Typography>
      <Link
        href={LINK_FRONTEND_ENTREPRENEURSHIP_DETAILS + featuredItem?.id}
        passHref>
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

export default BlogAndSuccessStoriesCover;
