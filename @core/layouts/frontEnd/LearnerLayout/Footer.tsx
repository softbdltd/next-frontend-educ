import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Container, Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
// import {
//   CONTENT_ID_ABOUT_US,
//   CONTENT_ID_CAREER_ADVICE,
//   CONTENT_ID_GUIDELINES,
//   CONTENT_ID_PRIVACY_POLICY,
//   CONTENT_ID_TERMS_AND_CONDITIONS,
// } from '../../../utilities/StaticContentConfigs';
// import {
//   LINK_FRONTEND_LEARNER_FAQ,
//   LINK_LEARNER_FRONTEND_STATIC_CONTENT,
// } from '../../../common/appLinks';
// import {Link} from '../../../elements/common';
import GoToTop from '../../../../modules/goToTop';

const PREFIX = 'YouthFooter';

const classes = {
  footerImage: `${PREFIX}-footerImage`,
  softbdImage: `${PREFIX}-softbdImage`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  paddingTop: '30px',
  paddingBottom: '30px',
  background: '#F7F7F7',
  marginTop: '50px',

  [`& .${classes.footerImage}`]: {
    width: '280px',
  },

  [`& .${classes.softbdImage}`]: {
    //width: '147px',
  },
}));

const Footer = () => {
  const {messages} = useIntl();

  return (
    <StyledGrid container>
      <Container maxWidth='lg'>
        <Grid item container justifyContent={'space-between'}>
          {/*<Grid item md={2}> // Todo: commented on 04-09-2022 Ramim vai feedback for production
            <Typography variant='subtitle2' gutterBottom={true}>
              <Box component={'span'} fontWeight='fontWeightBold'>
                {messages['footer.about_us']}
              </Box>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={LINK_LEARNER_FRONTEND_STATIC_CONTENT + CONTENT_ID_ABOUT_US}
                component={'span'}
                mt={2}>
                {messages['footer.about_us']}
              </Link>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={
                  LINK_LEARNER_FRONTEND_STATIC_CONTENT +
                  CONTENT_ID_TERMS_AND_CONDITIONS
                }
                component={'span'}
                mt={2}>
                {messages['footer.terms_and_condition']}
              </Link>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={
                  LINK_LEARNER_FRONTEND_STATIC_CONTENT + CONTENT_ID_PRIVACY_POLICY
                }
                component={'span'}
                mt={2}>
                {messages['footer.privacy_policy']}
              </Link>
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Typography variant='subtitle2' gutterBottom={true}>
              <Box component={'span'} fontWeight='fontWeightBold'>
                {messages['footer.for_job_seeker']}
              </Box>
            </Typography>
            <Typography gutterBottom={true}>
              <Box component={'span'} mt={2}>
                {messages['footer.bio_edit']}
              </Box>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={
                  LINK_LEARNER_FRONTEND_STATIC_CONTENT + CONTENT_ID_CAREER_ADVICE
                }
                component={'span'}
                mt={2}>
                {messages['footer.career_advice']}
              </Link>
            </Typography>
            <Typography gutterBottom={true}>
              <Box component={'span'} mt={2}>
                {messages['footer.my_jobs']}
              </Box>
            </Typography>
            <Typography gutterBottom={true}>
              <Link href={LINK_FRONTEND_LEARNER_FAQ} component={'span'} mt={2}>
                {messages['footer.faq']}
              </Link>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={
                  LINK_LEARNER_FRONTEND_STATIC_CONTENT + CONTENT_ID_GUIDELINES
                }
                component={'span'}
                mt={2}>
                {messages['footer.guideline']}
              </Link>
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Typography variant='subtitle2' gutterBottom={true}>
              <Box component={'span'} fontWeight='fontWeightBold'>
                {messages['footer.job_provider']}
              </Box>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={LINK_LEARNER_FRONTEND_STATIC_CONTENT + CONTENT_ID_ABOUT_US}
                component={'span'}
                mt={2}>
                {messages['footer.about_us']}
              </Link>
            </Typography>
            <Typography gutterBottom={true}>
              <Link
                href={
                  LINK_LEARNER_FRONTEND_STATIC_CONTENT +
                  CONTENT_ID_TERMS_AND_CONDITIONS
                }
                component={'span'}
                mt={2}>
                {messages['footer.terms_and_condition']}
              </Link>
            </Typography>
          </Grid>*/}
          <Grid item md={4}>
            <Typography variant='subtitle2' gutterBottom={true}>
              <Box component={'span'} fontWeight='fontWeightBold'>
                {messages['footer.in_implementation']}
              </Box>
            </Typography>
            <a
              target='_blank'
              href='https://a2i.com/'
              aria-label={'a2i.com open in new tab'}
              rel='noopener noreferrer'>
              <Box component={'span'}>
                <img
                  src={'/images/footer-img.png'}
                  alt='A2i'
                  className={classes.footerImage}
                />
              </Box>
            </a>
          </Grid>
          <Grid item md={2} textAlign={'right'}>
            <Typography variant='subtitle2' gutterBottom={true}>
              <Box component={'span'} fontWeight='fontWeightBold'>
                {messages['common.technical_support']}
              </Box>
            </Typography>
            <a
              target='_blank'
              href='https://vendor.com/'
              aria-label={'vendor.com open in new tab'}
              rel='noopener noreferrer'>
              <Box component={'span'}>
                <img
                  src={'/images/softbd.png'}
                  alt='SoftBD Ltd.'
                  className={classes.softbdImage}
                />
              </Box>
            </a>
          </Grid>
          <GoToTop />
        </Grid>
      </Container>
    </StyledGrid>
  );
};

export default Footer;
