import React from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../shared/constants/AppEnums';
import Button from '@mui/material/Button';
import {useIntl} from 'react-intl';
import ClockIcon from './ClockIcon';
import MapIcon from './MapIcon';
import {JobPlaceTypes} from '../../dashboard/jobLists/jobPost/enums/JobPostEnums';
import moment from 'moment';
import Link from 'next/link';
import {LINK_FRONTEND_JOB_DETAILS} from '../../../@core/common/appLinks';

const PREFIX = 'JobCard';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  subHeading: `${PREFIX}-subHeading`,
  descriptionText: `${PREFIX}-descriptionText`,
  takaStyle: `${PREFIX}-takaStyle`,
  applyBtn: `${PREFIX}-applyBtn`,
  durationContainer: `${PREFIX}-durationContainer`,
  iconStyleStroke: `${PREFIX}-iconStyleStroke`,
  mapIconStyle: `${PREFIX}-mapIconStyle`,
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [`& .${classes.descriptionText}`]: {
    color: '#696969',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [`& .${classes.takaStyle}`]: {
    marginLeft: '5px',
  },
  [`& .${classes.applyBtn}`]: {
    color: '#565A5F',
    borderColor: '#565A5F',
  },
  [`& .${classes.durationContainer}`]: {
    width: 'fit-content',
    padding: '5px 10px',
    background: '#FFF3E5',
    borderRadius: '4px',
    color: '#FF921C',
  },

  [`&:hover, &:focus`]: {
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
    [`& .${classes.titleStyle}`]: {
      color: theme.palette.common.white,
    },
    [`& .${classes.iconStyleStroke}`]: {
      stroke: theme.palette.common.white,
    },
    [`& .${classes.mapIconStyle}`]: {
      fill: theme.palette.common.white,
    },
    [`& .${classes.durationContainer}`]: {
      background: '#1D8F53',
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
  [`& .${classes.iconStyleStroke}`]: {
    stroke: '#FF921C',
  },
  [`& .${classes.mapIconStyle}`]: {
    fill: '#696969',
  },
}));

interface JobCardProps {
  job: any;
  jobIdPrefix?: string;
}

const JobCard = ({job, jobIdPrefix = ''}: JobCardProps) => {
  const {messages, formatNumber} = useIntl();

  const getLocations = () => {
    if (
      job?.additional_job_information?.job_place_type ==
      JobPlaceTypes.OUTSIDE_BANGLADESH
    ) {
      let country = job?.additional_job_information?.country;
      return country
        ? country.title
        : job?.additional_job_information?.country_title ?? '';
    } else {
      let locations = job?.additional_job_information?.job_locations;
      return locations && locations.length > 0
        ? locations?.map((location: any) => location.title).join(', ')
        : messages['job.location_anywhere_in_bd'];
    }
  };

  const getRemainingTime = () => {
    const targetDate = moment(job?.application_deadline);

    const daysDiff = targetDate.diff(moment(), 'days');

    return `${messages['job.remaining']} ${formatNumber(daysDiff)} ${
      messages['common.days']
    }`;
  };

  return (
    <StyledBox>
      <Stack spacing={1}>
        <Stack
          className={classes.durationContainer}
          direction={'row'}
          spacing={1}>
          <ClockIcon className={classes.iconStyleStroke} />
          <Typography
            variant={'body2'}
            tabIndex={0}
            role='heading'
            aria-label={getRemainingTime()}>
            {getRemainingTime()}
          </Typography>
        </Stack>
        <Typography
          className={classes.titleStyle}
          tabIndex={0}
          area-label={job?.job_title}
          role={'heading'}
          variant={'h4'}
          title={job?.job_title}>
          {job?.job_title}
        </Typography>
        <Typography
          className={classes.subHeading}
          tabIndex={0}
          title={job?.organization_title}
          variant={'h6'}>
          {job?.organization_title}
        </Typography>
        <Stack direction={'row'} spacing={1}>
          <MapIcon className={classes.mapIconStyle} />
          <Typography
            className={classes.descriptionText}
            tabIndex={0}
            title={getLocations()}
            variant={'body1'}>
            {getLocations()}
          </Typography>
        </Stack>
        <Box>
          <Link
            href={`${LINK_FRONTEND_JOB_DETAILS}${jobIdPrefix + job?.job_id}`}
            passHref>
            <Button className={classes.applyBtn} variant={'outlined'}>
              {messages['common.apply_now']}
            </Button>
          </Link>
        </Box>
      </Stack>
    </StyledBox>
  );
};
export default JobCard;
