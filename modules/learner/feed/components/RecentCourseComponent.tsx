import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button} from '@mui/material';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {useIntl} from 'react-intl';
import Link from 'next/link';
import {H3} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import {LINK_FRONTEND_LEARNER_COURSE_DETAILS} from '../../../../@core/common/appLinks';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';

const PREFIX = 'RecentCourseComponent';

const classes = {
  courseProviderImage: `${PREFIX}-courseProviderImage`,
  courseTitle: `${PREFIX}-courseTitle`,
  courseProviderName: `${PREFIX}-courseProviderName`,
  detailsButton: `${PREFIX}-detailsButton`,
};

const StyledBox = styled(Box)(({theme}) => ({
  padding: '5px 10px 0px 20px',

  [`& .${classes.courseProviderImage}`]: {
    height: 45,
    width: 45,
    border: '1px solid ' + theme.palette.grey['300'],
    '& img': {
      objectFit: 'contain',
    },
  },

  [`& .${classes.courseTitle}`]: {
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.courseProviderName}`]: {
    color: theme.palette.grey['600'],
    marginBottom: 10,
  },
  [`& .${classes.detailsButton}`]: {
    backgroundColor: theme.palette.grey['300'],
    color: theme.palette.common.black,
    boxShadow: 'none',
  },
}));

const RecentCourseComponent = ({data: course}: any) => {
  const {messages} = useIntl();
  const result = useCustomStyle();

  return (
    <>
      <StyledBox display={'flex'}>
        <Box>
          <AvatarImageView
            alt='provider image'
            variant={'square'}
            src={course?.logo}
            className={classes.courseProviderImage}
          />
        </Box>
        <Box marginLeft={'10px'}>
          <H3 sx={{...result.body2}} className={classes.courseTitle}>
            {course.title}
          </H3>
          <Box className={classes.courseProviderName}>
            {course?.institute_title}
          </Box>

          <Box>
            <Link
              href={LINK_FRONTEND_LEARNER_COURSE_DETAILS + course.id}
              passHref>
              <Button
                variant='outlined'
                color='primary'
                size={'small'}
                style={{marginLeft: 10}}>
                {messages['common.details']}
              </Button>
            </Link>
          </Box>
        </Box>
      </StyledBox>
    </>
  );
};

export default RecentCourseComponent;
