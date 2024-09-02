import {Box, Card, CardContent, Divider, Grid, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {BorderColor, EmojiEventsOutlined, Schedule} from '@mui/icons-material';
import HorizontalLine from '../component/HorizontalLine';
import SkillInfo from '../SkillInfo';
import CircularProgressWithLabel from '../component/CircularProgressWithLabel';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import PersonalInformationEdit from './PersonalInformationEdit';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {useDispatch} from 'react-redux';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {
  getIntlNumber,
  isResponseSuccess,
} from '../../../../@core/utilities/helpers';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {
  FormPopupNotifyEnum,
  ThemeMode,
} from '../../../../shared/constants/AppEnums';
import {H1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import LocaleLanguage from '../../../../@core/utilities/LocaleLanguage';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'PersonalInfoSection';

const classes = {
  aboutYouth: `${PREFIX}-aboutYouth`,
  editButton: `${PREFIX}-editButton`,
  dividerStyle: `${PREFIX}-dividerStyle`,
  skillInfoGrid: `${PREFIX}-skillInfoGrid`,
  iconSizes: `${PREFIX}-iconSizes`,
  textColor: `${PREFIX}-textColor`,
  grayText: `${PREFIX}-grayText`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.aboutYouth}`]: {
    [theme.breakpoints.between('xs', 'sm')]: {
      justifyContent: 'center',
    },
  },
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },

  [`& .${classes.editButton}`]: {
    textAlign: 'right',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  [`& .${classes.iconSizes}`]: {
    width: '2.68rem',
    height: '2.68rem',
  },

  [`& .${classes.dividerStyle}`]: {
    margin: '10px 30px',
    borderWidth: 1,
    [theme.breakpoints.only('xs')]: {
      height: 25,
      marginLeft: 10,
      width: 1,
    },
  },

  [`& .${classes.skillInfoGrid}`]: {
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
    },
  },

  [`& .${classes.textColor}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
  },

  [`& .${classes.grayText}`]: {
    color: theme.palette.grey[500],
  },
}));

/** component loaded in /learner => first section */
const PersonalInfoSection = () => {
  const {messages, formatNumber, locale} = useIntl();
  const result = useCustomStyle();
  const [focusEl, setFocusEl] = useState(FormPopupNotifyEnum.FOCUS_NONE);
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();
  /*  console.log('profile ', authUser);*/
  useEffect(() => {
    if (focusEl !== FormPopupNotifyEnum.FOCUS_NONE) {
      let activeStepEl = document.getElementById(
        PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID,
      );
      if (activeStepEl) {
        activeStepEl.focus();
      }
    }
  }, [focusEl]);

  const [
    isOpenPersonalInformationEditForm,
    setIsOpenPersonalInformationEditForm,
  ] = useState<boolean>(false);

  const openPersonalInformationEditForm = useCallback(() => {
    setIsOpenPersonalInformationEditForm(true);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
  }, []);

  const closePersonalInformationEditForm = useCallback(
    (loadProfile: boolean) => {
      setIsOpenPersonalInformationEditForm(false);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
      if (loadProfile) updateProfile();
    },
    [],
  );

  const updateProfile = () => {
    (async () => {
      const response = await getYouthProfile();
      if (isResponseSuccess(response) && response.data) {
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: getYouthAuthUserObject({...authUser, ...response.data}),
        });
      }
    })();
  };

  const getName = () => {
    let firstName = authUser?.first_name;
    let lastName = authUser?.last_name;

    if (locale != LocaleLanguage.BN) {
      if (authUser?.first_name_en) {
        firstName = authUser.first_name_en;
        lastName = authUser?.last_name_en ? authUser?.last_name_en : '';
      }
    }

    return firstName + ' ' + lastName;
  };

  const getExperience = () => {
    let experience = authUser?.total_job_experience;
    if (experience) {
      let year = experience?.year;
      let month = experience?.month;
      if (year) {
        return month ? (
          <IntlMessages
            id={'common.year_month_experience'}
            values={{
              year: formatNumber(year),
              month: formatNumber(month),
            }}
          />
        ) : (
          <IntlMessages
            id={'common.year_experience'}
            values={{
              year: formatNumber(year),
            }}
          />
        );
      } else if (month) {
        return (
          <IntlMessages
            id={'common.month_experience'}
            values={{
              month: formatNumber(month),
            }}
          />
        );
      } else {
        return <IntlMessages id={'common.no_experience'} />;
      }
    } else {
      return <IntlMessages id={'common.no_experience'} />;
    }
  };

  // @ts-ignore
  return (
    <StyledBox>
      <span
        id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
        className={classes.visuallyHidden}
        tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}>
        {messages[`common.${focusEl}`]}
      </span>
      {isOpenPersonalInformationEditForm ? (
        <PersonalInformationEdit onClose={closePersonalInformationEditForm} />
      ) : (
        <Card>
          <CardContent>
            <Grid item container spacing={2} className={classes.aboutYouth}>
              <Grid item xs={12} sm={2}>
                <AvatarImageView
                  alt='learner profile picture'
                  title='learner profile picture'
                  src={authUser?.photo}
                  sx={{height: 100, width: 100, margin: 'auto'}}
                />
              </Grid>
              <Grid item xs={12} sm={10} md={10}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <Box>
                    <H1
                      sx={{
                        ...result.h5,
                      }}
                      tabIndex={0}
                      className={classes.textColor}>
                      {getName()}
                    </H1>
                    <Typography
                      variant={'subtitle2'}
                      tabIndex={0}
                      className={classes.grayText}>
                      {messages['common.email']}: {authUser?.email}
                    </Typography>
                    <Typography
                      variant={'subtitle2'}
                      tabIndex={0}
                      className={classes.grayText}>
                      {messages['common.mobile']}: {authUser?.mobile}
                    </Typography>
                  </Box>
                  <Box>
                    <CustomParabolaButton
                      title={messages['learner_profile.edit_profile'] as string}
                      aria-label={`${messages['learner_profile.edit_profile']} form popup open`}
                      icon={<BorderColor />}
                      onClick={openPersonalInformationEditForm}
                    />
                  </Box>
                </Box>
                <Typography
                  variant={'body1'}
                  mt={1}
                  tabIndex={0}
                  className={classes.grayText}>
                  {authUser?.bio}
                </Typography>
              </Grid>
            </Grid>

            <HorizontalLine />

            <Grid item xs={12} md={10}>
              {/** profile completed in percentage section */}
              <Grid container className={classes.skillInfoGrid}>
                <Grid item>
                  <SkillInfo
                    icon={
                      <CircularProgressWithLabel
                        value={authUser?.profile_completed || '0'}
                        text={getIntlNumber(
                          formatNumber,
                          authUser?.profile_completed || '0',
                        )}
                        size={'2.68rem'}
                      />
                    }
                    text1={messages['common.complete'] as string}
                    text2={messages['common.profile'] as string}
                  />
                </Grid>

                <Divider
                  orientation='vertical'
                  flexItem
                  className={classes.dividerStyle}
                />

                {/** year_of_experience section */}
                <Grid item>
                  <SkillInfo
                    icon={
                      <Schedule
                        color={'primary'}
                        className={classes.iconSizes}
                      />
                    }
                    text1={getExperience()}
                  />
                </Grid>
                <Divider
                  orientation='vertical'
                  flexItem
                  className={classes.dividerStyle}
                />

                {/** total_certificates section */}
                <Grid item>
                  <SkillInfo
                    icon={
                      <EmojiEventsOutlined
                        aria-hidden={true}
                        tabIndex={-1}
                        color={'primary'}
                        className={classes.iconSizes}
                      />
                    }
                    text1={
                      getIntlNumber(
                        formatNumber,
                        authUser?.total_certificates
                          ? authUser.total_certificates
                          : '0',
                      ) +
                      ' ' +
                      (messages['common.certificate'] as string)
                    }
                    text2={messages['common.achieved'] as string}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </StyledBox>
  );
};

export default PersonalInfoSection;
