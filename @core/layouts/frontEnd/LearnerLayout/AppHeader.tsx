import {Badge, CastForEducation, Home} from '@mui/icons-material';
import MoreIcon from '@mui/icons-material/MoreVert';
import WorkIcon from '@mui/icons-material/Work';
//import ListAltIcon from '@mui/icons-material/ListAlt';
import {Container, useMediaQuery} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import {Theme} from '@mui/system';
import clsx from 'clsx';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import LanguageSwitcher from '../../../../@core/core/LanguageSwitcher';
import Notifications from '../../../../@core/core/Notifications';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import AppLogo from '../../../../shared/components/AppLogo';
import {
  LINK_FRONTEND_LEARNER_FEED,
  LINK_FRONTEND_LEARNER_JOBS,
  LINK_FRONTEND_LEARNER_TRAINING,
} from '../../../common/appLinks';
//import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import {educDomain} from '../../../common/constants';
import {NavLink as Link} from '../../../elements/common';
import {classes, StyledAppBar, StyledMobileMenu} from './AppHeader.style';
import YouthProfileMenu from './YouthProfileMenu';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const authUser = useAuthUser<YouthAuthUser>();
  const isMDDown = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const {messages} = useIntl();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <StyledMobileMenu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={educDomain()}>
          <Home className={classes.menuIcons} /> {messages['menu.home']}{' '}
        </Link>
      </MenuItem>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_LEARNER_FEED}>
          <Badge className={classes.menuIcons} /> {messages['menu.feed']}
        </Link>
      </MenuItem>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_LEARNER_TRAINING}>
          <CastForEducation className={classes.menuIcons} />{' '}
          {messages['menu.training']}
        </Link>
      </MenuItem>
      {/*<MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_LEARNER_NOTICE_BOARD}>
          <ListAltIcon className={classes.menuIcons} />{' '}
          {messages['menu.notice']}
        </Link>
      </MenuItem>*/}
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_LEARNER_JOBS}>
          <WorkIcon className={classes.menuIcons} /> {messages['menu.jobs']}
        </Link>
      </MenuItem>
      {/*<MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_LEARNER_APPRENTICESHIP}>
          <ListAltIcon className={classes.menuIcons} />{' '}
          {messages['menu.apprenticeship']}
        </Link>
      </MenuItem>*/}
      {/*<MenuItem component='span' className={classes.menuItemMobile}>*/}
      {/*  <Link href={LINK_FRONTEND_LEARNER_RECENT_ACTIVITIES}>*/}
      {/*    <LocalActivityIcon className={classes.menuIcons} />{' '}*/}
      {/*    {messages['menu.recent_activity']}*/}
      {/*  </Link>*/}
      {/*</MenuItem>*/}
      {/*<MenuItem component='span' className={classes.menuItemMobile}>*/}
      {/*  <Link href={LINK_FRONTEND_LEARNER_CALENDAR}>*/}
      {/*    <CalendarViewMonth className={classes.menuIcons} />{' '}*/}
      {/*    {messages['menu.calendar']}*/}
      {/*  </Link>*/}
      {/*</MenuItem>*/}
      <MenuItem className={classes.menuItemRoot}>
        <Notifications />
      </MenuItem>
      <LanguageSwitcher />
    </StyledMobileMenu>
  );

  return (
    <>
      <StyledAppBar
        position='relative'
        color={'inherit'}
        className={clsx(classes.appBar, 'app-bar')}>
        <Toolbar className={classes.headerMain}>
          <Container maxWidth={'lg'}>
            <Box className={classes.headerMainFlex}>
              <Link href={'/'}>
                <AppLogo height={isMDDown ? 40 : 60} />
              </Link>

              <Box className={classes.grow} />

              <Box className={clsx(classes.sectionDesktop)}>
                <Box component='span' className={classes.menuItem}>
                  <Link href={educDomain()}>
                    <Home className={classes.menuIcons} sx={{fontSize: 42}} />{' '}
                    {messages['menu.home']}
                  </Link>
                </Box>
                <Box component='span' className={classes.menuItem}>
                  <Link href={LINK_FRONTEND_LEARNER_FEED}>
                    <Badge className={classes.menuIcons} sx={{fontSize: 42}} />{' '}
                    {messages['menu.feed']}
                  </Link>
                </Box>
                <Box component='span' className={classes.menuItem}>
                  <Link href={LINK_FRONTEND_LEARNER_TRAINING}>
                    <CastForEducation
                      className={classes.menuIcons}
                      sx={{fontSize: 42}}
                    />{' '}
                    {messages['menu.training']}
                  </Link>
                </Box>
                {/*<Box component='span' className={classes.menuItem}>
                  <Link href={LINK_FRONTEND_LEARNER_NOTICE_BOARD}>
                    <ListAltIcon
                      className={classes.menuIcons}
                      sx={{fontSize: 42}}
                    />{' '}
                    {messages['menu.notice']}
                  </Link>
                </Box>*/}
                <Box component='span' className={classes.menuItem}>
                  <Link href={LINK_FRONTEND_LEARNER_JOBS}>
                    <WorkIcon
                      className={classes.menuIcons}
                      sx={{fontSize: 42}}
                    />
                    {messages['menu.jobs']}
                  </Link>
                </Box>
                {/*<Box component='span' className={classes.menuItem}>
                  <Link href={LINK_FRONTEND_LEARNER_APPRENTICESHIP}>
                    <GrassRoundedIcon
                      className={classes.menuIcons}
                      sx={{fontSize: 42}}
                    />{' '}
                    {messages['menu.apprenticeship']}
                  </Link>
                </Box>*/}
                {/*<Box component='span' className={classes.menuItem}>*/}
                {/*  <Link href={LINK_FRONTEND_LEARNER_RECENT_ACTIVITIES}>*/}
                {/*    <LocalActivityIcon*/}
                {/*      className={classes.menuIcons}*/}
                {/*      sx={{fontSize: 42}}*/}
                {/*    />{' '}*/}
                {/*    {messages['menu.recent_activity']}*/}
                {/*  </Link>*/}
                {/*</Box>*/}
                {/*<Box component='span' className={classes.menuItem}>*/}
                {/*  <Link href={LINK_FRONTEND_LEARNER_CALENDAR}>*/}
                {/*    <CalendarViewMonth*/}
                {/*      className={classes.menuIcons}*/}
                {/*      sx={{fontSize: 42}}*/}
                {/*    />{' '}*/}
                {/*    {messages['menu.calendar']}*/}
                {/*  </Link>*/}
                {/*</Box>*/}
                <Notifications />
                <LanguageSwitcher />
              </Box>

              {authUser && <YouthProfileMenu />}
              <Box ml={1} className={classes.sectionMobile}>
                <IconButton
                  aria-label='show more'
                  aria-controls={mobileMenuId}
                  aria-haspopup='true'
                  onClick={handleMobileMenuOpen}
                  color='inherit'
                  size='large'>
                  <MoreIcon />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </StyledAppBar>
      {renderMobileMenu}
    </>
  );
};
export default AppHeader;
