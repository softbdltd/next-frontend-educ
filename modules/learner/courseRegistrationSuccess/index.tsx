import React, {useEffect, useState} from 'react';
import {Box, Button, CardMedia, Container, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import {Link} from '../../../@core/elements/common';
import {LINK_FRONTEND_LEARNER_COURSE_DETAILS} from '../../../@core/common/appLinks';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {
  getBrowserCookie,
  removeBrowserCookie,
} from '../../../@core/libs/cookieInstance';
import {COOKIE_KEY_COURSE_ID} from '../../../shared/constants/AppConst';
import {learnerDomain} from '../../../@core/common/constants';

const StyledContainer = styled(Container)(({theme}) => ({
  display: 'flex',
  marginTop: '20px',
}));

const YouthCourseRegistrationSuccessPage = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const {responseMethodName} = router.query;
  const [courseId, setCourseId] = useState<number | null>(null);

  useEffect(() => {
    const courseId = getBrowserCookie(COOKIE_KEY_COURSE_ID);
    if (courseId) {
      setCourseId(courseId);
      removeBrowserCookie(COOKIE_KEY_COURSE_ID);
    }
  }, []);

  const getResponseMessage = () => {
    switch (responseMethodName) {
      case 'success':
        return messages['course_enroll.success'];
      case 'failed':
        return messages['course_enroll.failed'];
      case 'cancelled':
        return messages['course_enroll.cancelled'];
      case 'payment-after-batch-assign':
        return messages['course_enroll.payment_after_batch_assign'];
      default:
        return '';
    }
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Box sx={{textAlign: 'center', margin: 'auto'}}>
        <Box sx={{margin: 'auto', maxWidth: '700px'}}>
          <CardMedia
            component='img'
            alt='Course enrollment success'
            height='350'
            image='/images/success.png'
          />
        </Box>
        <Typography
          variant={'h5'}
          align={'center'}
          style={{marginTop: '10px', marginBottom: '10px'}}>
          {getResponseMessage()}
        </Typography>
        {courseId ? (
          <Link href={LINK_FRONTEND_LEARNER_COURSE_DETAILS + courseId}>
            <Button color='primary' variant={'contained'}>
              {messages['course_enroll.go_to_course']}
            </Button>
          </Link>
        ) : (
          <Link href={learnerDomain()}>
            <Button color='primary' variant={'contained'}>
              {messages['common.goto_home']}
            </Button>
          </Link>
        )}
      </Box>
    </StyledContainer>
  );
};

export default YouthCourseRegistrationSuccessPage;
