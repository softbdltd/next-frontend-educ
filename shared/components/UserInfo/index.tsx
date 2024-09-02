import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Divider} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import {orange} from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {styled} from '@mui/material/styles';
import React, {useCallback, useContext, useState} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';
import AppContext from '../../../@core/utility/AppContext';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {
  LINK_FRONTEND_ASSOCIATION_PROFILE,
  LINK_FRONTEND_ENTREPRENEURSHIP_PROFILE,
  LINK_FRONTEND_INSTITUTE_PROFILE,
  LINK_FRONTEND_ORGANIZATION_PROFILE,
  LINK_FRONTEND_TRAINING_CENTER_PROFILE,
} from '../../../@core/common/appLinks';
import {getSSOLogoutUrl} from '../../../@core/common/SSOConfig';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import {Link} from '../../../@core/elements/common';
import AvatarImageView from '../../../@core/elements/display/ImageView/AvatarImageView';
import {getBrowserCookie} from '../../../@core/libs/cookieInstance';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {loadAuthenticateUser} from '../../../redux/actions/AuthUserLoad';
import AppContextPropsType from '../../../redux/types/AppContextPropsType';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {COOKIE_KEY_LEARNER_USER_AS_TRAINER} from '../../constants/AppConst';
import {Fonts, ThemeMode} from '../../constants/AppEnums';
import UserInfoDetailsPopup from './UserInfoDetailsPopup';
import UserInfoEditPopup from './UserInfoEditPopup';

const PREFIX = 'UserInfo';

const classes = {
  profilePic: `${PREFIX}-profilePic`,
  userInfo: `${PREFIX}-userInfo`,
  userName: `${PREFIX}-userName`,
  designation: `${PREFIX}-designation`,
  pointer: `${PREFIX}-pointer`,
};

const StyledBox = styled(Box)(({theme}) => {
  const {themeMode} = useContext<AppContextPropsType>(AppContext);

  return {
    paddingLeft: '20px',
    paddingRight: '20px',
    backgroundColor: 'rgba(0,0,0,.08)',
    paddingTop: 9,
    paddingBottom: 9,
    minHeight: 56,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 10,
      paddingBottom: 10,
      minHeight: 50,
      maxHeight: 50,
    },
    [`& .${classes.userInfo}`]: {
      width: 'calc(100% - 75px)',
    },
    [`& .${classes.profilePic}`]: {
      fontSize: '1.5rem',
      backgroundColor: orange[500],
      width: '35px',
      height: '35px',
    },
    [`& .${classes.userName}`]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: '1rem',
      fontWeight: Fonts.MEDIUM,
      color:
        themeMode === ThemeMode.LIGHT
          ? theme.palette.grey['500']
          : theme.palette.grey['400'],
    },
    [`& .${classes.designation}`]: {
      marginTop: -2,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color:
        themeMode === ThemeMode.LIGHT
          ? theme.palette.grey['500']
          : theme.palette.grey['400'],
    },
    [`& .${classes.pointer}`]: {
      cursor: 'pointer',
    },
  };
});

const UserInfo: React.FC = () => {
  // const router = useRouter();

  const {themeMode} = useContext<AppContextPropsType>(AppContext);
  const {
    institute: institutePermission,
    training_center: trainingCenterPermission,
    organization: organizationPermission,
    industry_association: industryAssociationPermission,
  } = useContext<PermissionContextPropsType>(PermissionContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const user: CommonAuthUser | null = useAuthUser();
  const {messages, locale} = useIntl();
  const dispatch = useDispatch();
  const [isYouthAsTrainerUser] = useState<any>(
    getBrowserCookie(COOKIE_KEY_LEARNER_USER_AS_TRAINER),
  );

  const gotoYouthProfile = useCallback(async () => {
    try {
      await loadAuthenticateUser(dispatch, true);
    } catch (error) {
      console.log('user load failed: ', error);
    }
  }, []);

  const closeEditModal = useCallback(() => {
    setIsOpenEditModal(false);
  }, []);

  const openEditModal = useCallback(() => {
    setIsOpenDetailsModal(false);
    setIsOpenEditModal(true);
  }, []);
  const openDetailsModal = useCallback(() => {
    setAnchorEl(null);
    setIsOpenDetailsModal(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUserAvatar = () => {
    if (user && user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

  // const gotoRpl = () => {
  //   let authAccessToken = getAuthAccessTokenFromCookie();
  //   let authRefreshToken = getAuthRefreshTokenFromCookie();
  //   router.push(getRPLRedirectUrl(authAccessToken, authRefreshToken));
  // };

  return (
    <StyledBox>
      <Box display='flex' alignItems='center'>
        {user && user?.profile_pic ? (
          <AvatarImageView
            className={classes.profilePic}
            src={user?.profile_pic}
          />
        ) : (
          <Avatar className={classes.profilePic}>{getUserAvatar()}</Avatar>
        )}
        <Box ml={4} className={classes.userInfo}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            <Box mb={0} className={classes.userName}>
              {user &&
                (locale == LocaleLanguage.EN
                  ? user.displayName ?? ''
                  : user.name ?? '')}
            </Box>
            <Box
              className={classes.pointer}
              color={themeMode === 'light' ? '#313541' : 'white'}>
              <ExpandMoreIcon onClick={handleClick} />
              <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={openDetailsModal}>
                  {messages['my_account.label']}
                </MenuItem>
                {isYouthAsTrainerUser && isYouthAsTrainerUser == '1' && (
                  <Divider sx={{margin: '0 !important'}} />
                )}
                {isYouthAsTrainerUser && isYouthAsTrainerUser == '1' && (
                  <MenuItem onClick={gotoYouthProfile}>
                    {messages['common.goto_learner']}
                  </MenuItem>
                )}

                {user?.isRegisteredTrainingOrganizationUser && (
                  <Divider sx={{margin: '0 !important'}} />
                )}
                {/*{user?.isRegisteredTrainingOrganizationUser && (*/}
                {/*  <MenuItem onClick={gotoRpl}>*/}
                {/*    {messages['rpl.redirect_to']}*/}
                {/*  </MenuItem>*/}
                {/*)}*/}

                {user?.isIndustryAssociationUser &&
                  industryAssociationPermission.canReadProfile && (
                    <Divider sx={{margin: '0 !important'}} />
                  )}
                {user?.isIndustryAssociationUser &&
                  industryAssociationPermission.canReadProfile && (
                    <MenuItem>
                      <Link href={LINK_FRONTEND_ASSOCIATION_PROFILE}>
                        {messages['association.association_profile']}
                      </Link>
                    </MenuItem>
                  )}
                {user?.isOrganizationUser &&
                  user?.organization?.is_sme_member == 1 && (
                    <Divider sx={{margin: '0 !important'}} />
                  )}
                {user?.isOrganizationUser &&
                  user?.organization?.is_sme_member == 1 && (
                    <MenuItem>
                      <Link href={LINK_FRONTEND_ENTREPRENEURSHIP_PROFILE}>
                        {messages['menu.entrepreneurship_profile']}
                      </Link>
                    </MenuItem>
                  )}
                {user?.isOrganizationUser &&
                  user?.organization?.is_nascib_member == 1 && (
                    <MenuItem>
                      <Link href={LINK_FRONTEND_ENTREPRENEURSHIP_PROFILE}>
                        {messages['menu.entrepreneurship_profile']}
                      </Link>
                    </MenuItem>
                  )}
                {user?.isInstituteUser &&
                  institutePermission.canReadProfile && (
                    <Divider sx={{margin: '0 !important'}} />
                  )}
                {user?.isInstituteUser && institutePermission.canReadProfile && (
                  <MenuItem>
                    <Link href={LINK_FRONTEND_INSTITUTE_PROFILE}>
                      {messages['institute_profile.label']}
                    </Link>
                  </MenuItem>
                )}
                {user?.isTrainingCenterUser &&
                  trainingCenterPermission.canReadProfile && (
                    <Divider sx={{margin: '0 !important'}} />
                  )}
                {user?.isTrainingCenterUser &&
                  trainingCenterPermission.canReadProfile && (
                    <MenuItem>
                      <Link href={LINK_FRONTEND_TRAINING_CENTER_PROFILE}>
                        {messages['training_center_profile.label']}
                      </Link>
                    </MenuItem>
                  )}
                {user?.isOrganizationUser &&
                  organizationPermission.canReadProfile && (
                    <Divider sx={{margin: '0 !important'}} />
                  )}
                {user?.isOrganizationUser &&
                  organizationPermission.canReadProfile && (
                    <MenuItem>
                      <Link href={LINK_FRONTEND_ORGANIZATION_PROFILE}>
                        {messages['common.organization_profile']}
                      </Link>
                    </MenuItem>
                  )}
                <Divider sx={{margin: '0 !important'}} />
                <Link href={getSSOLogoutUrl()}>
                  <MenuItem>{messages['common.logout']}</MenuItem>
                </Link>
              </Menu>
            </Box>
          </Box>
          {/*<Box className={classes.designation}>
            {getUserTypeName()} {messages['user.label']}
          </Box>*/}
        </Box>
      </Box>
      {isOpenDetailsModal && (
        <UserInfoDetailsPopup
          key={1}
          onClose={closeDetailsModal}
          openEditModal={openEditModal}
        />
      )}
      {isOpenEditModal && (
        <UserInfoEditPopup key={1} onClose={closeEditModal} />
      )}
    </StyledBox>
  );
};

export default UserInfo;
