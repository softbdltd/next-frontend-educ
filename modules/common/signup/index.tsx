import React from 'react';
import {Box, Grid, Paper, Typography} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import clsx from 'clsx';
import {useIntl} from 'react-intl';
import {Link} from '../../@core/elements/common';
import {
  LINK_FRONTEND_INSTITUTE_ROOT,
  LINK_ORGANIZATION_SIGNUP,
  LINK_LEARNER_SIGNUP,
} from '../../@core/common/appLinks';
import {getSSOLoginUrl} from '../../@core/common/SSOConfig';
import {classes, StyledContainer} from './index.style';
import {useRouter} from 'next/router';
import {
  gotoLoginSignUpPage,
  SECONDARY_APP_HEADER_HEIGHT,
} from '../../@core/common/constants';
import BackButton from '../../@core/elements/button/BackButton';

const YouthSignupPage = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const onClickButton = (url: string) => {
    const redirectUrl: any = router?.query?.redirected_from;
    router.push(gotoLoginSignUpPage(url, redirectUrl));
  };
  const backUrl = router.query?.redirected_from;

  return (
    <StyledContainer
      sx={{
        display: 'flex',
        height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
      }}>
      <Paper className={classes.paperBox}>
        <Typography
          tabIndex={0}
          style={{fontSize: '1.5rem', fontWeight: 'bold'}}
          variant={'h6'}
          align={'center'}
          mb={4}>
          {messages['signup.label']}
        </Typography>
        <Grid container spacing={3} sx={{justifyContent: 'space-around'}}>
          <Grid item xs={12} sm={6} md={6}>
            <button
              tabIndex={0}
              style={{
                background: 'none',
                border: 'none',
                padding: '0px',
              }}
              onClick={() => onClickButton(LINK_LEARNER_SIGNUP)}>
              <Box className={clsx(classes.iconBoxYouth, classes.icon)}>
                <PeopleIcon sx={{color: '#fff'}} />
                <Typography className={classes.text}>
                  {messages['signup.learner']}
                </Typography>
              </Box>
            </button>
          </Grid>

          {/*<Grid item xs={12} sm={4} md={4}>
            <Link href={LINK_INSTITUTE_SIGNUP}>
              <Box className={clsx(classes.iconBoxTc, classes.icon)}>
                <BusinessIcon style={{color: '#ffffff'}} />
                <Typography className={classes.text}>
                  {messages['common.training_center']}
                </Typography>
              </Box>
            </Link>
          </Grid>*/}

          <Grid item xs={12} sm={6} md={6}>
            <button
              tabIndex={0}
              style={{
                background: 'none',
                border: 'none',
                padding: '0px',
              }}
              onClick={() => onClickButton(LINK_ORGANIZATION_SIGNUP)}>
              <Box className={clsx(classes.iconBoxIndustry, classes.icon)}>
                <BusinessIcon style={{color: '#ffffff'}} />
                <Typography className={classes.text}>
                  {messages['signup.industry']}
                </Typography>
              </Box>
            </button>
          </Grid>

          {/*<Grid item xs={12} sm={4} md={4}>
            <Link href={LINK_INDUSTRY_ASSOCIATION_SIGNUP}>
              <Box
                className={clsx(
                  classes.iconBoxIndustryAssociation,
                  classes.icon,
                )}>
                <BusinessIcon style={{color: '#ffffff'}} />
                <Typography className={classes.text}>
                  {messages['common.industry_association']}

                </Typography>
              </Box>
            </Link>
          </Grid>*/}
        </Grid>
        <Typography variant={'h6'} align={'right'} mt={4}>
          {messages['common.already_have_account']}{' '}
          <Link
            href={getSSOLoginUrl(router?.query)}
            className={classes.signInStyle}>
            {messages['common.signin_here']}
          </Link>
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'center', mt: '20px'}}>
          <BackButton
            url={(backUrl as string) || LINK_FRONTEND_INSTITUTE_ROOT}
          />
        </Box>
      </Paper>
    </StyledContainer>
  );
};

export default YouthSignupPage;
