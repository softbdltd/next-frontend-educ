import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import {Body2, Caption, Link} from '../../@core/elements/common';
import {
  LINK_FRONTEND_INSTITUTE_FAQ,
  LINK_NATIONAL_PORTAL_LINK,
  LINK_NICE3_FRONTEND_STATIC_CONTENT,
} from '../../@core/common/appLinks';
import {
  CONTENT_ID_ABOUT_US,
  CONTENT_ID_PRIVACY,
} from '../../@core/utilities/StaticContentConfigs';
import {isBreakPointUp} from '../../@core/utility/Utils';
import {useFetchStaticPageAboutUs} from '../../services/cmsManagement/hooks';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';

const PREFIX = 'Footer';

const classes = {
  footerContainer: `${PREFIX}-footerContainer`,
  footerBottomContainer: `${PREFIX}-footerBottomContainer`,
  educTitle: `${PREFIX}-educTitle`,
  seeMoreButton: `${PREFIX}-seeMoreButton`,
  footerImage: `${PREFIX}-footerImage`,
  softbdImage: `${PREFIX}-softbdImage`,
  logoBackground: `${PREFIX}-logoBackground`,
  aboutUsTextStyle: `${PREFIX}-aboutUsTextStyle`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.footerContainer}`]: {
    backgroundColor: '#fff',
    // color: '#FFFFFF',
    padding: '1rem 0',
    boxShadow: '0px -2px 5px #e9e9e9',
  },
  [`& .${classes.educTitle}`]: {
    fontWeight: '600',
  },
  [`& .${classes.seeMoreButton}`]: {
    backgroundColor: '#FFFFFF',
    color: theme.palette.primary.main,
    textTransform: 'none',
    fontSize: '1rem',
    lineHeight: '25.75px',
    marginTop: '15px',

    [`:hover`]: {
      backgroundColor: theme.palette.primary.light,
      color: '#FFFFFF',
    },
  },
  [`& .${classes.footerImage}`]: {
    width: '255px',
  },
  [`& .${classes.softbdImage}`]: {
    width: '115px',
  },
  [`& .${classes.aboutUsTextStyle}`]: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    WebkitLineClamp: '2',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
  },
  [`& .${classes.footerBottomContainer}`]: {
    padding: '0.8rem 0',
    color: '#565A5F',
    fontSize: '0.875rem',
  },
  [`& .${classes.logoBackground}`]: {
    background: '#048340',
    height: '40px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
  },
}));

const Footer = () => {
  const {messages} = useIntl();
  const [params] = useState({});

  const {data: pageData, isLoading: isLoadingPageData} =
    useFetchStaticPageAboutUs(params);

  return (
    <StyledBox>
      <Grid container>
        <Grid item className={classes.footerContainer} xs={12}>
          <Container maxWidth={'lg'}>
            <Grid container spacing={isBreakPointUp('md') ? 8 : 2}>
              <Grid item xs={12} md={3}>
                <Stack>
                  <Typography
                    tabIndex={0}
                    className={classes.educTitle}
                    variant={'h4'}>
                    {messages['footer.about_educ']}
                  </Typography>
                  {isLoadingPageData ? (
                    <>
                      <Skeleton
                        animation={'wave'}
                        variant={'rectangular'}
                        sx={{width: 180, fontSize: '1.3rem'}}
                      />
                      <Skeleton
                        animation={'wave'}
                        variant={'rectangular'}
                        sx={{width: 180, fontSize: '1.5rem'}}
                      />
                    </>
                  ) : pageData?.content ? (
                    <Box
                      className={classes.aboutUsTextStyle}
                      dangerouslySetInnerHTML={{__html: pageData?.content}}
                    />
                  ) : (
                    <NoDataFoundComponent
                      messageTextType={'body1'}
                      sx={{textAlign: 'start'}}
                    />
                  )}
                  {pageData?.content && (
                    <Box>
                      <Link
                        href={
                          LINK_NICE3_FRONTEND_STATIC_CONTENT +
                          CONTENT_ID_ABOUT_US
                        }>
                        <Button
                          className={classes.seeMoreButton}
                          variant={'contained'}>
                          {messages['common.see_all']}
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6} md={3}>
                <Stack spacing={1}>
                  <Typography tabIndex={0} variant={'h6'}>
                    {messages['footer.important_links']}
                  </Typography>
                  <Typography>
                    <Link
                      href={LINK_NATIONAL_PORTAL_LINK}
                      component={'span'}
                      target='_blank'>
                      {messages['footer.national_portal']}
                    </Link>
                  </Typography>
                  <Typography>
                    <Link href={'/docs'} component={'span'}>
                      {messages['footer.supporting_documents']}
                    </Link>
                  </Typography>
                  <Typography>
                    <Link href={LINK_FRONTEND_INSTITUTE_FAQ} component={'span'}>
                      {messages['menu.faq']}
                    </Link>
                  </Typography>
                  <Typography>
                    <Link
                      href={
                        LINK_NICE3_FRONTEND_STATIC_CONTENT + CONTENT_ID_PRIVACY
                      }
                      component={'span'}>
                      {messages['footer.privacy']}
                    </Link>
                  </Typography>
                  <Typography>
                    <Link
                      href={
                        LINK_NICE3_FRONTEND_STATIC_CONTENT + CONTENT_ID_ABOUT_US
                      }
                      component={'span'}>
                      {messages['footer.sitemap']}
                    </Link>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} md={3}>
                <Stack spacing={1}>
                  <Typography tabIndex={0} variant={'h6'}>
                    {messages['footer.connect_us']}
                  </Typography>
                  <Stack spacing={1}>
                    <a
                      target='_blank'
                      aria-label={'facebook.com/educ.com open in new tab'}
                      href='https://www.facebook.com/educ.com'
                      rel='noopener noreferrer'>
                      <Box className={classes.logoBackground}>
                        <FacebookOutlinedIcon sx={{color: '#fff'}} />
                      </Box>
                    </a>
                    <Body2 tabIndex={0}>
                      {messages['common.for_support']}
                      <span>
                        <a href='tel:01896047111'>01896047111</a>
                      </span>
                    </Body2>
                    <Caption sx={{mt: '-2px!important'}}>
                      {messages['common.support_time_msg']}
                    </Caption>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Typography tabIndex={0} variant={'h6'}>
                    {messages['footer.in_implementation']}
                  </Typography>
                  <a
                    target='_blank'
                    href='https://a2i.com/'
                    aria-label={'a2i.com open in new tab'}
                    rel='noopener noreferrer'>
                    <Box component={'span'}>
                      <img
                        src={'/images/footer-img_2.png'}
                        alt='A2i'
                        className={classes.footerImage}
                      />
                    </Box>
                  </a>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={12} sx={{borderTop: '1px solid #d3d3d3'}}>
          <Container maxWidth={'lg'}>
            <Grid
              className={classes.footerBottomContainer}
              container
              spacing={1}
              rowSpacing={2}
              justifyContent={'space-between'}>
              <Grid item xs={12} md={9}>
                <Typography tabIndex={0} variant={'body1'}>
                  {messages['footer.copyright']}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction={'row'} spacing={1}>
                  <Typography tabIndex={0} variant={'body1'}>
                    {messages['footer.technical_support']}
                  </Typography>
                  <a
                    target='_blank'
                    href='https://vendor.com/'
                    aria-label={'vendor.com open in new tab'}
                    rel='noopener noreferrer'>
                    <Box component={'span'}>
                      <img
                        src={'/images/softbd.png'}
                        alt='SoftBd Ltd.'
                        className={classes.softbdImage}
                      />
                    </Box>
                  </a>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default Footer;
