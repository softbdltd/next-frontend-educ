import {Box, Button, Card, Grid, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT,
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD,
} from '../../../../@core/common/appLinks';
import {learnerDomain} from '../../../../@core/common/constants';
import ConfirmationStatus from '../../../../@core/components/JobScheduleResponsePopup/ConfirmationStatus';
import {H3, Link} from '../../../../@core/elements/common';
import CustomChip from '../../../../@core/elements/display/CustomChip/CustomChip';
import CardMediaImageView from '../../../../@core/elements/display/ImageView/CardMediaImageView';
import TagChip from '../../../../@core/elements/display/TagChip';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import {courseDuration} from '../../../../@core/utilities/helpers';
import {
  CoursePaymentTypes,
  EnrollementSteps,
  PaymentStatus,
} from '../../courseDetails/CourseDetailsEnums';

const PREFIX = 'CourseInfoBlock';

const classes = {
  jobProviderImage: `${PREFIX}-jobProviderImage`,
  totalEnrolled: `${PREFIX}-totalEnrolled`,
  titleStyle: `${PREFIX}-titleStyle`,
  colorGray: `${PREFIX}-colorGray`,
  enrollButton: `${PREFIX}-enrollButton`,
  courseDescription: `${PREFIX}-courseDescription`,
  tagChipStyle: `${PREFIX}-tagChipStyle`,
  courseDetailsButton: `${PREFIX}-courseDetailsButton`,
};

const StyledCard = styled(Card)(({theme}) => ({
  padding: 15,

  [`& .${classes.jobProviderImage}`]: {
    height: 60,
    width: 60,
    border: '1px solid ' + theme.palette.grey['300'],
    objectFit: 'contain',
  },

  [`& .${classes.totalEnrolled}`]: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.titleStyle}`]: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },

  [`& .${classes.colorGray}`]: {
    color: theme.palette.grey['600'],
    display: 'inline',
  },

  [`& .${classes.enrollButton}`]: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },

  [`& .${classes.courseDescription}`]: {
    marginTop: 15,
    marginBottom: 15,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  [`& .${classes.tagChipStyle}`]: {
    marginBottom: 0,
  },

  [`& .${classes.courseDetailsButton}`]: {
    position: 'absolute',
    left: 19,
    top: 19,
    width: '75%',
    fontSize: '0.87rem',
  },
}));

interface CourseInfoBlockProps {
  course: any;
  openEnrollmentViewModal: (course: any) => void;
}

const CourseInfoBlock: FC<CourseInfoBlockProps> = ({
  course,
  openEnrollmentViewModal,
}) => {
  const {messages, formatNumber} = useIntl();
  const result = useCustomStyle();

  const [lastEnrollInfo, setLastEnrollInfo] = useState<any>(undefined);
  const [enrollmentStage, setEnrollmentStage] = useState<any>(undefined);

  useEffect(() => {
    if (course?.enrollments?.length > 0) {
      setLastEnrollInfo(course?.enrollments[course?.enrollments?.length - 1]);
    }
  }, [course]);

  const getEnrollmentStage = (course: any) => {
    if (course?.enrollable) {
      if (course?.enrollments?.length == 0) {
        return EnrollementSteps.GOTO_ENROLLMENT_FIRST_TIME;
      }
      if (lastEnrollInfo?.row_status == ConfirmationStatus.REJECTED) {
        return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
      }
      // Payment after batch assign
      if (
        course?.payment_type ==
        CoursePaymentTypes.COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN
      ) {
        if (
          course?.admission_fee &&
          !lastEnrollInfo?.batch_id &&
          lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID
        )
          return EnrollementSteps.GOTO_PAYMENT_PAGE;
        if (
          !lastEnrollInfo?.batch_id &&
          lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID
        ) {
          return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
        }
        if (
          lastEnrollInfo?.batch_id &&
          lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID
        ) {
          return EnrollementSteps.GOTO_PAYMENT_PAGE;
        }
        if (
          lastEnrollInfo?.batch_id &&
          lastEnrollInfo?.payment_status == PaymentStatus.PARTIAL
        )
          return EnrollementSteps.GOTO_PAYMENT_PAGE;

        return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
      }

      // if (lastEnrollInfo?.verification_code_verified_at === null) {
      //   return EnrollementSteps.GOTO_VERIFY_PAGE;
      // }
      if (
        lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID &&
        course?.payment_type == 1
      ) {
        return EnrollementSteps.GOTO_PAYMENT_PAGE;
      }
      if (course?.enrollments) {
        return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
      }
    } else {
      if (course?.enrollments?.length == 0)
        return EnrollementSteps.NOT_ENROLLABLE;
      else if (course?.enrollments?.length > 0)
        return EnrollementSteps.GOTO_PREVIOUS_ENROLLMENT;
    }
  };

  useEffect(() => {
    const stage = getEnrollmentStage(course);
    setEnrollmentStage(stage);
  }, [lastEnrollInfo]);

  const renderPage = useCallback(() => {
    let content = null;

    if (enrollmentStage !== undefined) {
      switch (enrollmentStage) {
        case EnrollementSteps.GOTO_PAYMENT_PAGE:
          content = (
            <Link
              href={
                learnerDomain() +
                LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD +
                course?.id +
                `?enrollment_id=${lastEnrollInfo?.enrollment_id}`
              }>
              <Button variant={'contained'} color={'primary'}>
                {messages['common.pay_now']}
              </Button>
            </Link>
          );
          break;
        // case EnrollementSteps.GOTO_VERIFY_PAGE:
        //   content = (
        //     <Link
        //       href={
        //         learnerDomain() +
        //         LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_VERIFICATION +
        //         course?.id +
        //         `?enrollment_id=${lastEnrollInfo?.enrollment_id}`
        //       }>
        //       <Button variant={'contained'} color={'primary'}>
        //         {messages['common.verify_enrollment']}
        //       </Button>
        //     </Link>
        //   );
        //   break;
        case EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE:
          content = (
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={() => {
                openEnrollmentViewModal(course);
              }}>
              {messages['common.enroll_now']}
            </Button>
          );
          break;
        case EnrollementSteps.GOTO_PREVIOUS_ENROLLMENT:
          content = (
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={() => {
                openEnrollmentViewModal(course);
              }}>
              {messages['common.previous_enroll']}
            </Button>
          );
          break;
        case EnrollementSteps.GOTO_ENROLLMENT_FIRST_TIME:
          content = (
            <Link
              href={
                learnerDomain() +
                LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT +
                course?.id
              }>
              <Button variant={'contained'} color={'primary'}>
                {messages['common.enroll_now']}
              </Button>
            </Link>
          );
          break;
        default:
          content = (
            <CustomChip
              label={messages['common.not_enrollable']}
              color={'primary'}
            />
          );
      }
      return content;
    }
  }, [course, enrollmentStage, messages]);

  return (
    <StyledCard>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2} sx={{position: 'relative'}}>
          <CardMediaImageView
            alt={course?.title}
            image={course?.cover_image}
            height='100%'
            title={course?.title}
          />
          <Link href={`/course-details/${course?.id}`} passHref>
            <Button
              className={classes.courseDetailsButton}
              variant={'contained'}
              color={'primary'}
              size={'small'}>
              {messages['common.details']}
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={8}>
                  <Grid container>
                    <Grid item xs={2}>
                      <CardMediaImageView
                        alt={course?.title}
                        image={course?.logo}
                        className={classes.jobProviderImage}
                        title={course?.title}
                      />
                    </Grid>

                    <Grid item xs={10}>
                      <H3
                        sx={{...result.body2}}
                        mt={2}
                        ml={2}
                        className={classes.titleStyle}>
                        {course.title}
                      </H3>
                      <Box ml={2}>{course?.institute_title}</Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4} className={classes.totalEnrolled}>
                  <Box className={classes.colorGray}>
                    {messages['common.course_fee']}:
                  </Box>
                  <Typography variant={'h5'} fontWeight={'bold'}>
                    {course.course_fee
                      ? formatNumber(course.course_fee) + ' ৳'
                      : messages['common.free']}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} className={classes.courseDescription}>
              <Box
                mt={4}
                mb={4}
                className={classes.colorGray}
                title={course?.overview}>
                {course?.overview}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Grid container sx={{alignItems: 'flex-end'}}>
                <Grid item xs={8}>
                  <TagChip
                    label={courseDuration(
                      messages,
                      formatNumber,
                      course?.duration,
                    )}
                    className={classes.tagChipStyle}
                  />
                </Grid>
                <Grid item xs={4} className={classes.enrollButton}>
                  {renderPage()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default CourseInfoBlock;
