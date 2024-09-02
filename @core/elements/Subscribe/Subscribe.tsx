import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Container, Grid, Select, Stack, Typography} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Hidden from '@mui/material/Hidden';
import {useIntl} from 'react-intl';
import {Controller, useForm} from 'react-hook-form';
import yup from '../../libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../utilities/validationErrorHandler';
import useNotiStack from '../../hooks/useNotifyStack';
import {learnerSubscribe} from '../../../services/learnerManagement/YouthService';
import {SubscriptionTypesEnum} from '../../../shared/constants/AppEnums';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {gotoLoginSignUpPage} from '../../common/constants';
import {LINK_LEARNER_SIGNUP} from '../../common/appLinks';
import {SUBSCRIPTION_DATA_KEY} from '../../../shared/constants/AppConst';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {UPDATE_AUTH_USER} from '../../../redux/types/actions/Auth.actions';

const PREFIX = 'Subscribe';

const classes = {
  fontStyle: `${PREFIX}-fontStyle`,
  fontStyleTwo: `${PREFIX}-fontStyleTwo`,
  containerStyle: `${PREFIX}-containerStyle`,
  menuItem: `${PREFIX}-menuItem`,
  styleInputBase: `${PREFIX}-styleInputBase`,
  styleInputBaseTwo: `${PREFIX}-styleInputBaseTwo`,
  styledPaper: `${PREFIX}-styledPaper`,
  inputBase: `${PREFIX}-inputBase`,
  notificationBtn: `${PREFIX}-notificationBtn`,
  notificationIconStyle: `${PREFIX}-notificationIconStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  marginBottom: '50px',
  textColor: theme.palette.common.white,
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '20px',
  [`& .${classes.containerStyle}`]: {
    maxWidth: '900px',
    paddingTop: 20,
    paddingBottom: 10,
    [theme.breakpoints.up('md')]: {
      maxWidth: '600px',
    },
  },
  [`& .${classes.fontStyle}`]: {
    color: theme.palette.common.white,
    fontWeight: 500,
    fontSize: 32,
  },
  [`& .${classes.inputBase}`]: {
    marginRight: 5,
    paddingRight: 5,
    paddingLeft: 5,
    flex: 1,
    borderRadius: 5,
  },
  [`& .${classes.fontStyleTwo}`]: {
    color: 'white',
    fontWeight: 400,
    fontSize: 18,
  },
  [`& .${classes.menuItem}`]: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    width: '100%',
    padding: '0',
    textAlign: 'start',
  },
  [`& .${classes.styleInputBase}`]: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5px',
  },
  [`& .${classes.styleInputBaseTwo}`]: {
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  [`& .${classes.styledPaper}`]: {
    backgroundColor: '##005C2C',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      width: '60px',
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  [`& .MuiSelect-select`]: {
    padding: '10px',
  },
  [`& .${classes.notificationBtn}`]: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '6px',
    padding: '6px 7px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid #eee',

    [`& .${classes.notificationIconStyle}`]: {
      fill: theme.palette.common.white,
      fontSize: '2rem',
    },
    [`&:hover, &:focus`]: {
      backgroundColor: theme.palette.common.white,
      [`& .${classes.notificationIconStyle}`]: {
        fill: theme.palette.primary.main,
      },
    },
  },
}));

const Subscribe = () => {
  const {messages} = useIntl();
  const authUser = useAuthUser();
  const dispatch = useDispatch();
  const router = useRouter();
  const {errorStack} = useNotiStack();
  const [select, setSelect] = useState(null);
  const [subscriptionMenuOptions, setSubscriptionMenuOptions] = useState<any[]>(
    [],
  );

  const allSubscriptionTypes = [
    SubscriptionTypesEnum.SUBSCRIPTION_TYPE_SKILL,
    SubscriptionTypesEnum.SUBSCRIPTION_TYPE_JOB,
  ];

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email(messages['validation.emailFormat'] as string)
        .required(messages['validation.emailRequired'] as string),
    });
  }, [messages]);

  const {handleSubmit, control, setError} = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const handleChange = (event: any) => {
    setSelect(event.target.value);
  };

  useEffect(() => {
    const auth_subscriptions = authUser?.learner_subscriptions ?? [];
    let filteredSubscriptionTypes: any[] = allSubscriptionTypes;

    if (auth_subscriptions?.length > 0 && auth_subscriptions?.length !== 3) {
      filteredSubscriptionTypes = allSubscriptionTypes?.filter(
        (item: any) => !auth_subscriptions?.find((i: any) => i?.type === item),
      );
    } else if (auth_subscriptions?.length === 3) {
      filteredSubscriptionTypes = [];
    }

    setSubscriptionMenuOptions(filteredSubscriptionTypes);
    if (filteredSubscriptionTypes?.length > 0) {
      setSelect(filteredSubscriptionTypes[0]);
    }
  }, [authUser]);

  const getSubscriptionTypeLabel = (subscriptionId: number) => {
    switch (subscriptionId) {
      case 1:
        return messages['subscribe.subscribe_for_skills'];

      case 2:
        return messages['subscribe.subscribe_for_jobs'];

      case 3:
        return messages['subscribe.subscribe_for_entrepreneurship'];

      default:
        return messages['subscribe.subscribe_for_all'];
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (select == SubscriptionTypesEnum.SUBSCRIPTION_TYPE_ALL) {
        data.type = allSubscriptionTypes?.filter(
          (item: any) =>
            !authUser?.learner_subscriptions?.find((i: any) => i?.type === item),
        );
      } else {
        data.type = [select];
      }

      if (authUser?.isYouthUser) {
        const response = await learnerSubscribe(data);
        if (response?.data) {
          const authSubscriptionTypes: any[] =
            authUser?.learner_subscriptions ?? [];
          dispatch({
            type: UPDATE_AUTH_USER,
            payload: {
              ...authUser,
              learner_subscriptions: [
                ...authSubscriptionTypes,
                ...response?.data,
              ],
            },
          });
        }
      } else {
        window.localStorage.setItem(
          SUBSCRIPTION_DATA_KEY,
          JSON.stringify(data),
        );

        await router.push(gotoLoginSignUpPage(LINK_LEARNER_SIGNUP));
      }
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const IconSubmitButton = (
    <Box
      onClick={handleSubmit(onSubmit)}
      tabIndex={0}
      aria-label={'Subscribe Button'}
      className={classes.notificationBtn}>
      <NotificationsNoneIcon className={classes.notificationIconStyle} />
    </Box>
  );

  const SelectMenuItem = (
    <Select
      sx={{width: '100%', textAlign: 'start'}}
      labelId='subscribe-select-label'
      id='subscribe-select'
      defaultValue={select}
      className={classes.menuItem}
      value={select}
      onChange={handleChange}>
      {subscriptionMenuOptions?.map((item: number, index: number) => (
        <MenuItem
          sx={{color: 'primary.main', fontWeight: 500}}
          key={index}
          value={item}>
          {getSubscriptionTypeLabel(item)}
        </MenuItem>
      ))}
      {subscriptionMenuOptions?.length > 0 && (
        <MenuItem
          sx={{color: 'primary.main', fontWeight: 500}}
          value={SubscriptionTypesEnum.SUBSCRIPTION_TYPE_ALL}>
          {messages['subscribe.subscribe_for_all']}
        </MenuItem>
      )}
    </Select>
  );

  return (
    <>
      {(!authUser ||
        (authUser?.isYouthUser && subscriptionMenuOptions?.length !== 0)) && (
        <Container maxWidth={'lg'} sx={{mt: 3}}>
          <StyledGrid container>
            <Grid item>
              <Container className={classes.containerStyle}>
                <Grid spacing={0.5} container>
                  <Grid item xs={12}>
                    <Typography tabIndex={0} className={classes.fontStyle}>
                      {messages['common.subscribe']}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      className={classes.fontStyleTwo}
                      tabIndex={0}
                      variant='body1'>
                      {messages['subscribe.subscribe_to_newsletter']}
                    </Typography>
                  </Grid>
                  <Hidden mdDown>
                    <Grid item xs={12}>
                      <Grid container spacing={2} mb={2} mt={0.1}>
                        <Grid sm={12} md={10.5} item>
                          <Grid
                            container
                            bgcolor={'white'}
                            p={'6px'}
                            borderRadius={'5px'}>
                            <Grid xs={5} item>
                              <Stack
                                className={classes.styleInputBase}
                                direction='row'>
                                <IconButton
                                  aria-hidden={true}
                                  tabIndex={-1}
                                  sx={{p: '10px'}}>
                                  <EmailIcon aria-hidden={true} />
                                </IconButton>
                                <Controller
                                  name='email'
                                  control={control}
                                  defaultValue={
                                    authUser?.email ? authUser?.email : ''
                                  }
                                  render={({
                                    field: {onChange, value},
                                    fieldState: {error},
                                  }) => (
                                    <InputBase
                                      type='email'
                                      value={value}
                                      onChange={onChange}
                                      error={!!error}
                                      className={classes.inputBase}
                                      sx={{
                                        border: error ? '2px solid red' : null,
                                      }}
                                      placeholder={
                                        messages['common.email'] as string
                                      }
                                    />
                                  )}
                                  rules={{required: 'Email required'}}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={7}>
                              {SelectMenuItem}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid xs={1.5} item>
                          <Hidden mdDown>{IconSubmitButton}</Hidden>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Hidden>
                  <Hidden mdUp>
                    <Grid item xs={12}>
                      <Stack
                        className={classes.styleInputBaseTwo}
                        direction='row'>
                        <IconButton sx={{p: '10px'}} aria-label='menu'>
                          <EmailIcon />
                        </IconButton>
                        <Controller
                          name='email'
                          control={control}
                          defaultValue=''
                          render={({
                            field: {onChange, value},
                            fieldState: {error},
                          }) => (
                            <InputBase
                              type='email'
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              placeholder={
                                messages['subscribe.enter_your_email'] as string
                              }
                            />
                          )}
                          rules={{required: 'Email required'}}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container columnSpacing={'3px'}>
                        <Grid
                          item
                          xs={10}
                          sx={{padding: '2px'}}
                          bgcolor={'white'}
                          borderRadius={'5px'}>
                          {SelectMenuItem}
                        </Grid>
                        <Grid xs={2} item>
                          {IconSubmitButton}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Hidden>
                </Grid>
              </Container>
            </Grid>
          </StyledGrid>
        </Container>
      )}
    </>
  );
};

export default Subscribe;
