import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import SideMenu from '../../../@core/elements/YouthSideMenu';
import SettingOptions from './SettingOptions';
import ChangeUserIdView from './ChangeUserIdView';
import ChangePasswordView from './ChangePasswordView';
import DeleteAccountView from './DeleteAccountView';
import {useIntl} from 'react-intl';

const PREFIX = 'Settings';

const classes = {
  settingBox: `${PREFIX}-settingBox`,
  boxItem: `${PREFIX}-boxItem`,
  userItem: `${PREFIX}-userItem`,
  passwordItem: `${PREFIX}-passwordItem`,
  deleteItem: `${PREFIX}-deleteItem`,
  iconStyle: `${PREFIX}-iconStyle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.settingBox}`]: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      '& .textUser': {
        transition: 'color 0.5s',
        color: theme.palette.secondary.main,
      },
      '& .textPassword': {
        transition: 'color 0.5s',
        color: theme.palette.primary.main,
      },
      '& .textDelete': {
        transition: 'color 0.5s',
        color: theme.palette.error.main,
      },
      '& .icon': {
        transition: 'color 0.5s',
        color: '#fff !important',
      },
      '& $userItem': {
        transition: 'background 0.5s',
        color: theme.palette.secondary.main,
      },
      '& $passwordItem': {
        transition: 'background 0.5s',
        color: theme.palette.primary.main,
      },
      '& $deleteItem': {
        transition: 'background 0.5s',
        color: theme.palette.error.main,
      },
    },
  },

  [`& .${classes.boxItem}`]: {
    minWidth: '70px',
    height: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',
  },
  [`& .${classes.userItem}`]: {
    background: theme.palette.secondary.light,
  },

  [`& .${classes.passwordItem}`]: {
    background: theme.palette.primary.light,
  },

  [`& .${classes.deleteItem}`]: {
    background: theme.palette.error.light,
  },
  [`& .${classes.iconStyle}`]: {
    fontSize: 'large',
    color: theme.palette.common.white,
  },
}));

const Settings = () => {
  const {messages} = useIntl();
  const [isSettingsOpened, setIsSettingsOpened] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('');

  const showView = (view: string) => {
    setIsSettingsOpened(false);
    setCurrentView(view);
  };
  const getView = () => {
    switch (currentView) {
      case SettingOptions.CHANGE_USER_ID:
        return <ChangeUserIdView onBack={handleBack} />;
      case SettingOptions.CHANGE_PASSWORD:
        return <ChangePasswordView onBack={handleBack} />;
      case SettingOptions.DELETE_ACCOUNT:
        return <DeleteAccountView onBack={handleBack} />;
      default:
        return <React.Fragment />;
    }
  };

  const handleBack = () => {
    setIsSettingsOpened(true);
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container mt={{xs: 1}} spacing={{xs: 1, md: 5}}>
        <Grid item sm={4}>
          <SideMenu />
        </Grid>

        <Grid item sm={8}>
          {isSettingsOpened ? (
            <Card>
              <CardHeader title={messages['common.settings']} />
              <CardContent>
                <Grid container spacing={6}>
                  {/** change user id */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      className={classes.settingBox}
                      onClick={() => showView(SettingOptions.CHANGE_USER_ID)}>
                      <Box
                        className={clsx(
                          classes.boxItem,
                          classes.userItem,
                          classes.iconStyle,
                          'icon',
                        )}>
                        <PeopleAltIcon />
                      </Box>
                      <Typography className='textUser'>
                        {messages['common.change_user_id']}
                      </Typography>
                    </Box>
                  </Grid>
                  {/** change password */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      className={classes.settingBox}
                      onClick={() => showView(SettingOptions.CHANGE_PASSWORD)}>
                      <Box
                        className={clsx(
                          classes.boxItem,
                          classes.passwordItem,
                          classes.iconStyle,
                          'icon',
                        )}>
                        <VpnKeyIcon />
                      </Box>
                      <Typography className='textPassword'>
                        {messages['common.change_password']}
                      </Typography>
                    </Box>
                  </Grid>
                  {/** delete account */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      className={classes.settingBox}
                      onClick={() => showView(SettingOptions.DELETE_ACCOUNT)}>
                      <Box
                        className={clsx(
                          classes.boxItem,
                          classes.deleteItem,
                          classes.iconStyle,
                          'icon',
                        )}>
                        <DeleteIcon />
                      </Box>
                      <Typography className='textDelete'>
                        {messages['common.delete_account']}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            getView()
          )}
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Settings;
