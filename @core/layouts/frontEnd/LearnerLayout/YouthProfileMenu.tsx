import {
  AdminPanelSettings,
  DesktopMac,
  KeyboardArrowDown,
  Logout,
  Person,
  Receipt,
  Work,
} from '@mui/icons-material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LockResetIcon from '@mui/icons-material/LockReset';
import {
  Button,
  Card,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import {Base64} from 'js-base64';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {loadAuthenticateUser} from '../../../../redux/actions/AuthUserLoad';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {
  LINK_FRONTEND_BLOG_AND_SUCCESS_STORIES,
  LINK_FRONTEND_LEARNER_MY_COURSES,
  LINK_FRONTEND_LEARNER_MY_CV,
  LINK_FRONTEND_LEARNER_MY_JOBS,
  LINK_FRONTEND_LEARNER_ROOT,
  LINK_FRONTEND_LEARNER_UPDATE_PASSWORD,
} from '../../../common/appLinks';
import {getSSOLogoutUrl} from '../../../common/SSOConfig';
import Divider from '../../../components/Divider/Divider';
import {Link} from '../../../elements/common';
import {getAuthAccessTokenFromCookie} from '../../../libs/cookieHelpers';

const YouthProfileMenu = () => {
  const {messages} = useIntl();
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();

  const onGotoAdminClick = useCallback(async () => {
    try {
      await loadAuthenticateUser(dispatch, false);
    } catch (error) {
      console.log('user load failed: ', error);
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  let isCDAPUser =
    authUser?.learner_auth_source && Number(authUser.learner_auth_source) == 1;
  let authAccessToken = getAuthAccessTokenFromCookie();
  // let authRefreshToken = getAuthRefreshTokenFromCookie();

  try {
    const tokenData = JSON.parse(
      Base64.decode((authAccessToken || '..').split('.')[1]),
    );

    if (tokenData?.sub && !tokenData?.sub.includes('-')) {
      isCDAPUser = true;
    }
  } catch (e) {
    console.log('Failed to parse access token');
  }

  // let isMyGovLogin = false;
  // if (isCDAPUser && authAccessToken) {
  //   isMyGovLogin = true;
  // }

  // const getSwitchToMyGovUrl = () => {
  //   if (isMyGovLogin) {
  //     return MYGOV_LOGIN_URL;
  //   } else {
  //     return MYGOV_LOGIN_URL_USING_EDUC;
  //   }
  // };
  // const rplNavigationhandler = () => {
  //   if ((authUser?.total_passed_rpl_assessments || 0) > 0) {
  //     return getRPLRedirectUrl(authAccessToken, authRefreshToken);
  //   } else {
  //     return (
  //       RPL_DASHBOARD_REDIRECT_URL + LINK_FRONTEND_ERPL_ROOT_RPL_ASSESSMENT
  //     );
  //   }
  // };

  return (
    <div>
      <Button
        id='my-profile-button'
        aria-controls='my-profile-menu'
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}>
        {messages['learner_feed_menu.label']}
      </Button>

      {open && (
        <Card
          id='my-profile-menu'
          sx={(theme) => {
            return {
              position: 'absolute',
              marginTop: '10px',
              boxShadow:
                '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
              zIndex: 9999999,
              [`${theme.breakpoints.down('lg')}`]: {
                right: '10px',
              },
            };
          }}>
          <div
            style={{
              background: 'none',
              padding: 0,
              margin: 0,
              border: 0,
              outline: 0,
              appearance: 'none',
              textAlign: 'unset',
            }}>
            <Link href={LINK_FRONTEND_LEARNER_ROOT}>
              <MenuItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText>
                  {messages['learner_feed_menu.my_profile']}
                </ListItemText>
              </MenuItem>
            </Link>

            {authUser?.admin_access_type &&
              authUser?.admin_access_type.length > 0 && <Divider />}
            {authUser?.admin_access_type &&
              authUser?.admin_access_type.length > 0 && (
                <Link>
                  <MenuItem onClick={onGotoAdminClick}>
                    <ListItemIcon>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText>{messages['common.goto_admin']}</ListItemText>
                  </MenuItem>
                </Link>
              )}

            <Divider sx={{margin: '0 !important'}} />
            <Link href={LINK_FRONTEND_LEARNER_MY_CV}>
              <MenuItem>
                <ListItemIcon>
                  <Receipt />
                </ListItemIcon>
                <ListItemText>{messages['learner_feed_menu.my_cv']}</ListItemText>
              </MenuItem>
            </Link>
            <Divider />
            <Link href={LINK_FRONTEND_LEARNER_MY_COURSES}>
              <MenuItem>
                <ListItemIcon>
                  <DesktopMac />
                </ListItemIcon>
                <ListItemText>
                  {messages['learner_feed_menu.my_courses']}
                </ListItemText>
              </MenuItem>
            </Link>
            <Divider />
            {/*<Link href={LINK_FRONTEND_LEARNER_MY_APPRENTICESHIPS}>*/}
            {/*  <MenuItem>*/}
            {/*    <ListItemIcon>*/}
            {/*      <GrassRoundedIcon />*/}
            {/*    </ListItemIcon>*/}
            {/*    <ListItemText>*/}
            {/*      {messages['learner_feed_menu.my_apprenticeship']}*/}
            {/*    </ListItemText>*/}
            {/*  </MenuItem>*/}
            {/*</Link>*/}
            {/*<Divider />*/}
            <Link href={LINK_FRONTEND_LEARNER_MY_JOBS}>
              <MenuItem>
                <ListItemIcon>
                  <Work />
                </ListItemIcon>
                <ListItemText>
                  {messages['learner_feed_menu.my_jobs']}
                </ListItemText>
              </MenuItem>
            </Link>
            <Divider />
            {/*<Link href={LINK_FRONTEND_LEARNER_FREELANCE_CORNER}>*/}
            {/*  <MenuItem>*/}
            {/*    <ListItemIcon>*/}
            {/*      <Score />*/}
            {/*    </ListItemIcon>*/}
            {/*    <ListItemText>*/}
            {/*      {messages['learner_feed_menu.freelance_corner']}*/}
            {/*    </ListItemText>*/}
            {/*  </MenuItem>*/}
            {/*</Link>*/}
            {/*<Divider />*/}
            <Link href={LINK_FRONTEND_BLOG_AND_SUCCESS_STORIES}>
              <MenuItem sx={{whiteSpace: 'pre-wrap'}}>
                <ListItemIcon>
                  <AutoStoriesIcon />
                </ListItemIcon>
                <ListItemText>
                  {messages['menu.blog_and_success_stories']}
                </ListItemText>
              </MenuItem>
            </Link>
            <Divider />
            {/*<Link href={rplNavigationhandler()}>*/}
            {/*  <MenuItem>*/}
            {/*    <ListItemIcon>*/}
            {/*      <DesktopMac />*/}
            {/*    </ListItemIcon>*/}
            {/*    <ListItemText>{messages['rpl.redirect_to']}</ListItemText>*/}
            {/*  </MenuItem>*/}
            {/*</Link>*/}
            {!isCDAPUser && <Divider />}
            {!isCDAPUser && (
              <Link href={LINK_FRONTEND_LEARNER_UPDATE_PASSWORD}>
                <MenuItem>
                  <ListItemIcon>
                    <LockResetIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {messages['learner.update_passord_label']}
                  </ListItemText>
                </MenuItem>
              </Link>
            )}
            <Divider />
            {/*<Link href={getSwitchToMyGovUrl()} target={'_blank'}>*/}
            {/*  <MenuItem>*/}
            {/*    <ListItemIcon>*/}
            {/*      <Avatar*/}
            {/*        src={'./images/mygov_logo.png'}*/}
            {/*        sx={{*/}
            {/*          width: '1.2em',*/}
            {/*          height: '1em',*/}
            {/*          '& img': {*/}
            {/*            objectFit: 'contain',*/}
            {/*          },*/}
            {/*        }}*/}
            {/*      />*/}
            {/*    </ListItemIcon>*/}
            {/*    <ListItemText>{messages['learner.my_gov_login']}</ListItemText>*/}
            {/*  </MenuItem>*/}
            {/*</Link>*/}
            {/*<Divider />*/}
            <Link href={getSSOLogoutUrl()}>
              <MenuItem>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText>{messages['common.logout']}</ListItemText>
              </MenuItem>
            </Link>
          </div>
        </Card>
      )}
      {open && (
        <div
          title={messages['menu_button.accessibility_close_message'] as string}
          style={{
            background: '#8880',
            position: 'fixed',
            zIndex: 999999,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={() => handleClose()}
          onWheel={() => handleClose()}>
          {''}
        </div>
      )}
    </div>
  );
};

export default YouthProfileMenu;
