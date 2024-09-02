import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {Box, Button, Container, Grid, Tooltip} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {
  MUKTOPATH_COURSE_DETAILS_REDIRECT,
  MUKTOPATH_COURSE_IMAGE_URL,
} from '../../../../@core/common/appLinks';
import {H1, Link} from '../../../../@core/elements/common';
import TagChip from '../../../../@core/elements/display/TagChip';
import {
  getCourseDuration,
  getIntlNumber,
} from '../../../../@core/utilities/helpers';

const PREFIX = 'CourseDetailsHeaderSection';

const classes = {
  courseFee: `${PREFIX}-courseFee`,
  courseFeeStyle: `${PREFIX}-courseFeeStyle`,
  certificateViewButton: `${PREFIX}-certificateViewButton`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.courseFee}`]: {
    textTransform: 'uppercase',
    marginTop: 25,
    display: 'flex',
    marginBottom: 10,
  },
  [`& .${classes.courseFeeStyle}`]: {
    marginLeft: 10,
    marginRight: 8,
    color: theme.palette.primary.main,
  },
  [`& .${classes.certificateViewButton}`]: {
    marginLeft: 10,
  },
}));

interface CourseDetailsHeaderProps {
  course: any;
}

const CourseDetailsHeaderSectionOfMuktopath: FC<CourseDetailsHeaderProps> = ({
  course,
}) => {
  const {messages, formatNumber} = useIntl();

  const getCourseFeeContent = (course: any) => {
    if (!course.course_fee && !course.admission_fee) {
      return (
        <Box className={classes.courseFee}>
          {messages['common.course_fee']}:{' '}
          <Box className={classes.courseFeeStyle}>
            <Box>{messages['common.free']}</Box>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box className={classes.courseFee}>
          {messages['common.course_fee']}:{' '}
          <Box className={classes.courseFeeStyle}>
            <Box>{formatNumber(course.course_fee) + ','}</Box>
          </Box>
          {messages['course.admission_fee']}:{' '}
          <Box className={classes.courseFeeStyle}>
            <Box>{'৳ ' + formatNumber(course.admission_fee)}</Box>
          </Box>
        </Box>
      );
    }
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Box className={classes.courseFee}>{getCourseFeeContent(course)}</Box>
          <H1 mb={1} style={{fontWeight: 'bold', fontSize: '1.640625rem'}}>
            {course?.title}
          </H1>
          <Tooltip
            title={
              <IntlMessages
                id={'course.online_institute'}
                values={{
                  subject: course?.institute_title,
                }}
              />
            }>
            <Button
              variant={'text'}
              color={'primary'}
              sx={{display: 'block', mb: 6}}>
              {course?.institute_title}
            </Button>
          </Tooltip>

          {course?.duration && course?.uuid && (
            <TagChip
              icon={<AccessTimeIcon sx={{fontSize: '18px'}} />}
              label={`${course?.duration}`}
            />
          )}

          {course?.duration && course?.id && (
            <TagChip
              icon={<AccessTimeIcon sx={{fontSize: '18px'}} />}
              label={getCourseDuration(course.duration, formatNumber, messages)}
            />
          )}
          {course?.lessons && (
            <TagChip
              label={
                <IntlMessages
                  id={'course_details.total_lesson'}
                  values={{
                    total: getIntlNumber(formatNumber, '4'),
                  }}
                />
              }
            />
          )}

          {course?.total_enroll > 0 && (
            <TagChip
              label={
                <IntlMessages
                  id={'course_details.enrolled'}
                  values={{
                    total: getIntlNumber(formatNumber, course.total_enroll),
                  }}
                />
              }
            />
          )}
          <Link
            href={`${MUKTOPATH_COURSE_DETAILS_REDIRECT}/${course?.uuid}`}
            target={'_blank'}>
            <Button variant={'contained'} color={'primary'}>
              {messages['common.enroll_now']}
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <img
            src={`${MUKTOPATH_COURSE_IMAGE_URL}/${course?.thumbnail_encoded_path}`}
            alt='National University'
            style={{
              height: 300,
              width: '100%',
              backgroundSize: '100%',
            }}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};
export default CourseDetailsHeaderSectionOfMuktopath;
