import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Card, LinearProgress} from '@mui/material';
import BasicInfoItemBox from './components/BasicInfoItemBox';
import {useIntl} from 'react-intl';
import {H4, Link} from '../../../@core/elements/common';
import {LINK_FRONTEND_LEARNER_ROOT} from '../../../@core/common/appLinks';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {getIntlNumber} from '../../../@core/utilities/helpers';
import AvatarImageView from '../../../@core/elements/display/ImageView/AvatarImageView';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';

const PREFIX = 'BasicInfo';

const classes = {
  container: `${PREFIX}-container`,
  topCover: `${PREFIX}-topCover`,
  userImage: `${PREFIX}-userImage`,
  userName: `${PREFIX}-userName`,
  designation: `${PREFIX}-designation`,
  completeProfile: `${PREFIX}-completeProfile`,
  fontColor: `${PREFIX}-fontColor`,
};

const StyledCard = styled(Card)(({theme}): any => ({
  [`& .${classes.container}`]: {
    padding: 20,
    position: 'relative',
  },

  [`& .${classes.topCover}`]: {
    height: 90,
    backgroundImage: 'linear-gradient(110deg, #129e55 60%, #048340 40%)',
  },

  [`& .${classes.userImage}`]: {
    position: 'absolute',
    height: 65,
    width: 65,
    left: 18,
    top: -38,
  },

  [`& .${classes.userName}`]: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
  },

  [`& .${classes.designation}`]: {fontSize: 14, fontWeight: 'normal'},

  [`& .${classes.fontColor}`]: {color: '#6E6D7A', marginTop: '8px'},

  [`& .${classes.completeProfile}`]: {
    marginTop: 20,
  },
}));

const BasicInfo = () => {
  const {messages, formatNumber, locale} = useIntl();
  const authUser = useAuthUser<YouthAuthUser>();

  return (
    <>
      <StyledCard>
        <Box className={classes.topCover} />
        <Box className={classes.container}>
          <AvatarImageView
            alt={'learner profile pic'}
            src={authUser?.photo}
            className={classes.userImage}
          />
          <H4 className={classes.userName}>
            {locale == LocaleLanguage.EN
              ? authUser?.first_name_en
              : authUser?.first_name}{' '}
            {locale == LocaleLanguage.EN
              ? authUser?.last_name_en
              : authUser?.last_name}
          </H4>
          <Box sx={{width: '100%'}}>
            <LinearProgress
              variant='determinate'
              value={authUser?.profile_completed || 0}
            />
            <Box className={classes.fontColor}>
              {messages['learner_feed.profile_progress']}{' '}
              {getIntlNumber(formatNumber, authUser?.profile_completed || '0')}%
            </Box>
          </Box>

          <BasicInfoItemBox learnerProfile={authUser} />

          <Box style={{textAlign: 'center'}}>
            <Link href={LINK_FRONTEND_LEARNER_ROOT}>
              <Button
                variant='outlined'
                color={'primary'}
                className={classes.completeProfile}>
                {messages['learner_feed.complete_profile']}
              </Button>
            </Link>
          </Box>
        </Box>
      </StyledCard>
    </>
  );
};

export default BasicInfo;
