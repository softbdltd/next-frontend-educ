import {Box, Button, Container, Grid} from '@mui/material';
import Modal from '@mui/material/Modal';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT,
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD,
  LINK_LEARNER_SIGNUP,
} from '../../../@core/common/appLinks';
import {
  gotoLoginSignUpPage,
  learnerDomain,
} from '../../../@core/common/constants';
import {getSSOLoginUrl} from '../../../@core/common/SSOConfig';
import ConfirmationStatus from '../../../@core/components/JobScheduleResponsePopup/ConfirmationStatus';
import {Body1, H1, Link} from '../../../@core/elements/common';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import TagChip from '../../../@core/elements/display/TagChip';
import {
  getCourseDuration,
  getFormatMessage,
  getIntlNumber,
} from '../../../@core/utilities/helpers';
import {useFetchPublicYouthIssuedCertificateList} from '../../../services/learnerManagement/hooks';
import CertificatePopup from './CertificatePopup';
import {
  CoursePaymentTypes,
  EnrollementSteps,
  PaymentStatus,
} from './CourseDetailsEnums';
import EnrolementInfoPopup from './EnrolementInfoPopup';

const PREFIX = 'CourseDetailsHeaderSection';

const classes = {
  courseFee: `${PREFIX}-courseFee`,
  courseFeeStyle: `${PREFIX}-courseFeeStyle`,
  certificateViewButton: `${PREFIX}-certificateViewButton`,
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 280,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
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

const CourseDetailsHeaderSection: FC<CourseDetailsHeaderProps> = ({course}) => {
  const {messages, formatNumber, formatMessage} = useIntl();
  const authUser = useAuthUser();
  const [lastEnrollInfo, setLastEnrollInfo] = useState<any>({});
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenViewCertificateModal, setIsOpenViewCertificateModal] =
    useState(false);
  const [enrollmentStage, setEnrollmentStage] = useState<any>(undefined);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onCloseViewModal = useCallback(() => {
    setIsOpenViewModal(false);
  }, []);
  const onCloseViewCertificateModal = useCallback(() => {
    setIsOpenViewCertificateModal(false);
  }, []);

  const isCourseFree = course?.admission_fee === 0 && course?.course_fee === 0;
  const isCoursePaymentEnabled = !isCourseFree && course?.is_payment_enabled;

  const handleView = () => {
    setIsOpenViewModal(true);
  };

  const handleViewCertificate = () => {
    setIsOpenViewCertificateModal(true);
  };

  useEffect(() => {
    if (course?.enrollments?.length > 0) {
      setLastEnrollInfo(course?.enrollments[course?.enrollments?.length - 1]);
    }
  }, [course]);

  const learnerId = authUser && authUser?.isYouthUser ? authUser?.learnerId : null;

  const getEnrollmentStage = (course: any) => {
    if (course?.enrollable) {
      // not enrolled before
      if (course?.enrollments?.length == 0) {
        return EnrollementSteps.GOTO_ENROLLMENT_FIRST_TIME;
      }

      // enrollment rejected, so he can enrollment again
      if (lastEnrollInfo?.row_status == ConfirmationStatus.REJECTED) {
        return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
      }
      // course payment is disabled, so all course will be free
      if (!isCoursePaymentEnabled) {
        console.log('step 1');
        return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
      } else {
        //  course payment is enabled
        // COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN, already paid admission fee
        console.log('step 2');
        if (
          course?.payment_type ==
            CoursePaymentTypes.COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN ||
          course?.payment_type ==
            CoursePaymentTypes.COURSE_FEE_WITH_ADMISSION_FEE
        ) {
          console.log('step 3', lastEnrollInfo);
          if (
            (course?.admission_fee || course?.course_fee) &&
            !lastEnrollInfo?.batch_id &&
            (lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID ||
              lastEnrollInfo?.payment_status == PaymentStatus.PARTIAL)
          ) {
            console.log('step 4');
            return EnrollementSteps.GOTO_PAYMENT_PAGE;
          }

          // got a batch, but payment pending or partial
          if (
            lastEnrollInfo?.batch_id &&
            (lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID ||
              lastEnrollInfo?.payment_status != PaymentStatus.SUCCESS ||
              lastEnrollInfo?.payment_status == PaymentStatus.PARTIAL)
          ) {
            console.log('step 5');
            return EnrollementSteps.GOTO_PAYMENT_PAGE;
          }
          console.log('step 6');
          // payment clear, multiple enrollment
          return EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE;
        }

        if (
          lastEnrollInfo?.payment_status == PaymentStatus.UN_PAID &&
          course?.payment_type ==
            CoursePaymentTypes.COURSE_FEE_PAYMENT_AFTER_BATCH_ASSIGN
        ) {
          console.log('step 7');
          return EnrollementSteps.GOTO_PAYMENT_PAGE;
        }
      }
      if (course?.enrollments) {
        console.log('step 8');
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
    console.log('lastEnrollInfo effect', lastEnrollInfo, stage);
    setEnrollmentStage(stage);
  }, [lastEnrollInfo, course]);

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
        case EnrollementSteps.GOTO_PREVIOUS_ENROLLMENT:
          content = (
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={handleView}>
              {messages['common.previous_enroll']}
            </Button>
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
              onClick={handleView}>
              {messages['common.enroll_now']}
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
  }, [authUser, course, enrollmentStage, messages]);

  const [issuedCertificateFilter, setIssuedCertificateFilter] =
    useState<any>(null);

  const {data: certificateList} = useFetchPublicYouthIssuedCertificateList(
    Number(learnerId),
    issuedCertificateFilter,
  );

  const getCourseFeeContent = (course: any) => {
    if (!course.course_fee && !course.admission_fee) {
      return (
        <Box className={classes.courseFee}>
          {messages['common.course_fee']}:{' '}
          <Box
            tabIndex={0}
            aria-label={`${messages['common.course_fee']}: ${messages['common.free']}`}
            role={'heading'}
            className={classes.courseFeeStyle}>
            <Box>{messages['common.free']}</Box>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box
          tabIndex={0}
          aria-label={`${messages['common.course_fee']} `}
          role={'heading'}
          className={classes.courseFee}>
          {messages['common.course_fee']}:{' '}
          <Box
            tabIndex={0}
            aria-label={`${formatNumber(course.course_fee) + ','}`}
            role={'heading'}
            className={classes.courseFeeStyle}>
            <Box>{formatNumber(course.course_fee) + ','}</Box>
          </Box>
          {messages['course.admission_fee']}:{' '}
          <Box
            tabIndex={0}
            aria-label={`${messages['course.admission_fee']}: ${
              '৳ ' + formatNumber(course.admission_fee)
            }`}
            role={'heading'}
            className={classes.courseFeeStyle}>
            <Box>{'৳ ' + formatNumber(course.admission_fee)}</Box>
          </Box>
        </Box>
      );
    }
  };

  useEffect(() => {
    if (course && course?.enrollments?.length > 0) {
      const batch_ids = course?.enrollments
        ?.map((item: any) => item.batch_id)
        .filter((batchId: any) => batchId != null);
      if (batch_ids.length > 0) setIssuedCertificateFilter({batch_ids});
    }
  }, [course]);

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Box className={classes.courseFee}>{getCourseFeeContent(course)}</Box>
          <H1 mb={1} style={{fontWeight: 'bold', fontSize: '1.640625rem'}}>
            {course?.title}
          </H1>
          <Body1
            tabIndex={0}
            aria-label={`${course?.institute_title}`}
            role={'heading'}
            mb={6}>
            {course?.institute_title}
          </Body1>
          {course?.duration && (
            <TagChip
              label={getCourseDuration(course.duration, formatNumber, messages)}
            />
          )}
          {course?.lessons && (
            <TagChip
              label={getFormatMessage(
                formatMessage,
                'course_details.total_lesson',
                {
                  total: getIntlNumber(formatNumber, '4'),
                },
              )}
            />
          )}

          {course?.enroll_count > 0 && (
            <TagChip
              label={getFormatMessage(
                formatMessage,
                'course_details.enrolled',
                {
                  total: getIntlNumber(formatNumber, course.enroll_count),
                },
              )}
            />
          )}
          <Box sx={{display: 'flex', gap: 1}}>
            {/*multiple enrolment feature*/}
            {(!authUser || authUser?.isYouthUser) && (
              <Box mt={4} mb={3}>
                {authUser ? (
                  renderPage()
                ) : course?.enrollable ? (
                  <>
                    <Button
                      onClick={handleOpen}
                      variant={'contained'}
                      color={'primary'}>
                      {messages['common.enroll_now']}
                    </Button>
                    <Modal open={open} onClose={handleClose}>
                      <Box sx={style}>
                        <Typography
                          pt={'30px'}
                          pb={'15px'}
                          tabIndex={0}
                          id='modal-modal-title'
                          variant='h3'
                          component='h2'>
                          {messages['common.course_apply_one']}
                          {messages['common.course_apply_two']}
                          {messages['common.course_apply_three']}
                        </Typography>
                        <Link
                          href={getSSOLoginUrl({
                            redirected_from: window?.location?.href,
                          })}>
                          <Button variant={'contained'} color={'primary'}>
                            {messages['common.login']}
                          </Button>
                        </Link>
                        <Grid
                          pt={'15px'}
                          spacing={0.5}
                          container
                          alignItems='center'
                          justifyContent='center'>
                          <Grid item>
                            <Typography variant='body2'>
                              {messages['common.no_account']}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Link href={gotoLoginSignUpPage(LINK_LEARNER_SIGNUP)}>
                              <Typography fontWeight={'bold'} variant='body2'>
                                {messages['common.signup']}
                              </Typography>
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                  </>
                ) : (
                  <CustomChip
                    label={messages['common.not_enrollable']}
                    color={'primary'}
                  />
                )}
              </Box>
            )}

            {certificateList && certificateList?.length > 0 && (
              <Box mt={4} mb={3}>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  onClick={handleViewCertificate}>
                  {messages['common.certificate_view']}
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardMediaImageView
            image={course?.cover_image}
            sx={{height: 300, width: '100%', backgroundSize: '100%'}}
            title={course?.title}
            alt={course?.title}
          />
        </Grid>
      </Grid>
      {isOpenViewModal && (
        <EnrolementInfoPopup
          onClose={onCloseViewModal}
          enrollments={course?.enrollments}
          lastEnrollInfo={lastEnrollInfo}
          courseId={course?.id}
          isEnrollable={
            enrollmentStage === EnrollementSteps.GOTO_ENROLLMENT_MULTIPLE
          }
          isCoursePaymentEnabled={isCoursePaymentEnabled}
        />
      )}
      {isOpenViewCertificateModal && (
        <CertificatePopup
          onClose={onCloseViewCertificateModal}
          certificateLists={certificateList}
        />
      )}
    </StyledContainer>
  );
};
export default CourseDetailsHeaderSection;
