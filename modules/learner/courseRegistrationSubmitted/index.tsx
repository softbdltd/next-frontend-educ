import {Box, Button, CardMedia, Container, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRouter} from 'next/router';
import React from 'react';
import {useIntl} from 'react-intl';
import {
  LINK_FRONTEND_LEARNER_COURSE_DETAILS,
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD,
} from '../../../@core/common/appLinks';
import {SECONDARY_APP_HEADER_HEIGHT} from '../../../@core/common/constants';
import {Link} from '../../../@core/elements/common';

const StyledContainer = styled(Container)(({theme}) => ({
  display: 'flex',
  height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
  marginTop: '20px',
}));

const YouthCourseRegistrationSubmittedPage = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const {courseId, enrollment_id, is_course_paid}: any = router.query;

  return (
    <StyledContainer maxWidth={'lg'}>
      <Box sx={{textAlign: 'center', margin: 'auto'}}>
        <Box sx={{margin: 'auto', maxWidth: '700px'}}>
          <CardMedia
            component='img'
            alt='Registration form submitted'
            height='350'
            image='/images/success.png'
          />
        </Box>
        {is_course_paid === '2' ? (
          <Typography
            variant={'h5'}
            align={'center'}
            style={{marginTop: '10px', marginBottom: '10px'}}>
            {messages['course_enroll.submitted_for_free']}
          </Typography>
        ) : (
          <Typography
            variant={'h5'}
            align={'center'}
            style={{marginTop: '10px', marginBottom: '10px'}}>
            {messages['course_enroll.submitted_for_paid']}
          </Typography>
        )}

        {is_course_paid === '2' ? (
          <Link href={LINK_FRONTEND_LEARNER_COURSE_DETAILS + courseId}>
            <Button color='primary' variant={'contained'}>
              {messages['course_enroll.go_to_course']}
            </Button>
          </Link>
        ) : (
          <Link
            href={
              LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD +
              courseId +
              `?enrollment_id=${enrollment_id}&is_course_paid=${is_course_paid}`
            }>
            <Button color='primary' variant={'contained'}>
              {messages['common.next']}
            </Button>
          </Link>
        )}
      </Box>
    </StyledContainer>
  );
};

export default YouthCourseRegistrationSubmittedPage;
