import React from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {MUKTOPATH_PRIFIX} from '../../../@core/common/constants';
import {Fonts} from '../../../shared/constants/AppEnums';
import Button from '@mui/material/Button';
import {useIntl} from 'react-intl';
import clsx from 'clsx';
import Link from 'next/link';
import {LINK_FRONTEND_COURSE_DETAILS} from '../../../@core/common/appLinks';

const PREFIX = 'SkillCard';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  subHeading: `${PREFIX}-subHeading`,
  descriptionText: `${PREFIX}-descriptionText`,
  takaStyle: `${PREFIX}-takaStyle`,
  applyBtn: `${PREFIX}-applyBtn`,
  durationContainer: `${PREFIX}-durationContainer`,
  iconStyleStroke: `${PREFIX}-iconStyleStroke`,
  // mapIconStyle: `${PREFIX}-mapIconStyle`,
};

const StyledBox = styled(Box)(({theme}) => ({
  border: '1.12313px solid #D7D7D7',
  borderRadius: '6px',
  padding: '18px 14px',
  height: '100%',

  [`& .${classes.titleStyle}`]: {
    fontSize: '1.625rem',
    fontWeight: Fonts.BOLD,
    lineHeight: '33.8px',
    color: '#2C2C2C',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [`& .${classes.subHeading}`]: {
    color: theme.palette.primary.main,
    fontSize: '1.125rem',
    fontWeight: Fonts.MEDIUM,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    WebkitLineClamp: '2',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
  },
  [`& .${classes.descriptionText}`]: {
    color: '#696969',
  },
  [`& .${classes.takaStyle}`]: {
    marginLeft: '5px',
  },
  [`& .${classes.applyBtn}`]: {
    color: '#565A5F',
    borderColor: '#565A5F',
  },

  [`&:hover, &:focus`]: {
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
    [`& .${classes.titleStyle}`]: {
      color: theme.palette.common.white,
    },
    [`& .${classes.subHeading}`]: {
      color: theme.palette.common.white,
    },
    [`& .${classes.descriptionText}`]: {
      color: theme.palette.common.white,
    },
    [`& .${classes.applyBtn}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface SkillCardProps {
  id: number;
  title: string;
  institute_title: string;
  course_fee: number;
  isCourseOnlineType?: boolean;
}

const SkillCard = ({
  id,
  title,
  institute_title,
  course_fee,
  isCourseOnlineType,
}: SkillCardProps) => {
  const {messages, formatNumber} = useIntl();
  return (
    <StyledBox>
      <Stack spacing={1}>
        <Typography
          tabIndex={0}
          className={classes.titleStyle}
          variant={'h4'}
          title={title}>
          {title}
        </Typography>

        {institute_title && (
          <Typography
            tabIndex={0}
            className={classes.subHeading}
            variant={'h6'}
            title={institute_title}>
            {institute_title}
          </Typography>
        )}
        <Stack direction={'row'} spacing={1}>
          <Typography
            className={clsx(classes.descriptionText, classes.takaStyle)}
            aria-hidden={true}
            variant={'body1'}>
            ৳
          </Typography>
          <Typography
            tabIndex={0}
            role='heading'
            aria-label={`${
              course_fee ? formatNumber(course_fee) : messages['common.free']
            }`}
            className={classes.descriptionText}
            variant={'body1'}>
            {course_fee ? formatNumber(course_fee) : messages['common.free']}
          </Typography>
        </Stack>
        <Box>
          {isCourseOnlineType ? (
            <Link
              href={LINK_FRONTEND_COURSE_DETAILS + '/' + MUKTOPATH_PRIFIX + id}>
              <Button className={classes.applyBtn} variant={'outlined'}>
                {messages['common.apply_now']}
              </Button>
            </Link>
          ) : (
            <Link href={LINK_FRONTEND_COURSE_DETAILS + id} passHref>
              <Button className={classes.applyBtn} variant={'outlined'}>
                {messages['common.apply_now']}
              </Button>
            </Link>
          )}
        </Box>
      </Stack>
    </StyledBox>
  );
};

export default SkillCard;
