import React, {useContext, useState} from 'react';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {NavLink as Link, Text} from '../../../elements/common';
import {
  LINK_FRONTEND_INSTITUTE_CALENDAR,
  LINK_FRONTEND_INSTITUTE_CIRCULAR,
  LINK_FRONTEND_INSTITUTE_CONTACT,
  LINK_FRONTEND_INSTITUTE_COURSES,
  LINK_FRONTEND_INSTITUTE_FEEDBACK,
  LINK_FRONTEND_INSTITUTE_JOBS,
  LINK_FRONTEND_INSTITUTE_ROOT,
} from '../../../common/appLinks';
import {classes, StyledAppBar, StyledBox, StyledMenu} from './Header.style';
import {useIntl} from 'react-intl';
import {Container, Grid} from '@mui/material';
import LanguageSwitcher from '../../../../@core/core/LanguageSwitcher';
import GotoDashboardButton from '../../../elements/button/GotoDashboardButton/GotoDashboardButton';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import GotoSignInOrUpButton from '../../../elements/button/GotoSigninOrUpButton/GotoSignInOrUpButton';
import CardMediaImageView from '../../../elements/display/ImageView/CardMediaImageView';
import {InstituteDetailsProps} from './contexts/InstituteDetailsProps';
import InstituteDetailsContext from './contexts/InstituteDetailsContext';
import {AutoStories, CalendarMonth, Contacts, Feedback, Home,} from '@mui/icons-material';
import WorkIcon from '@mui/icons-material/Work';
import {DgnmDomains} from "../../../utilities/helpers";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PublicVerifyCertificateModal from "./PublicVerifyCertificateModal";

const MenuDivider = () => {
  return (
    <Divider
      orientation='vertical'
      flexItem
      light
      variant='middle'
      sx={{borderColor: '#c9c9c9', margin: '15px 0px'}}
    />
  );
};

interface AppHeaderProps {
}

const Header: React.FC<AppHeaderProps> = () => {
  const authUser = useAuthUser();
  const isDgnm = window && DgnmDomains.includes(String(window.location.hostname));
  const {messages} = useIntl();
  const institute = useContext<InstituteDetailsProps>(InstituteDetailsContext);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  // const redirectToSSO = useCallback(() => {
  //   window.location.href = getSSOLoginUrl();
  // }, []);

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const openCertificateVerifyModal = () => {
    setIsModalOpen(true);
  };

  const closeCertificateVerifyModal = () => {
    setIsModalOpen(false);
  };


  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <StyledMenu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_ROOT}>
          <Home className={classes.menuIcons}/> {messages['menu.first_page']}
        </Link>
      </MenuItem>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_COURSES}>
          <AutoStories className={classes.menuIcons}/>{' '}
          {messages['menu.courses']}
        </Link>
      </MenuItem>

      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_JOBS}>
          <WorkIcon className={classes.menuIcons}/> {messages['menu.jobs']}
        </Link>
      </MenuItem>

      <MenuItem sx={{cursor: 'pointer'}} onClick={openCertificateVerifyModal} component='span' className={classes.menuItemMobile}>
        <Box>
          <CardMembershipIcon className={classes.menuIcons}/> {messages['menu.certificate']}
        </Box>
      </MenuItem>
      {
        isDgnm && (
          <MenuItem component='span' className={classes.menuItemMobile}>
            <Link href={LINK_FRONTEND_INSTITUTE_CIRCULAR}>
              <WorkIcon className={classes.menuIcons}/> {messages['menu.circular']}
            </Link>
          </MenuItem>
        )
      }
      {/*<MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_VIDEOS}>
          <OndemandVideo className={classes.menuIcons} />{' '}
          {messages['menu.videos']}
        </Link>
      </MenuItem>*/}
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_FEEDBACK}>
          <Feedback className={classes.menuIcons}/> {messages['menu.feedback']}
        </Link>
      </MenuItem>
      {/* <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_FAQ}>
          <Quiz className={classes.menuIcons}/> {messages['menu.faq']}
        </Link>
      </MenuItem>*/}
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_CALENDAR}>
          <CalendarMonth className={classes.menuIcons}/>{' '}
          {messages['menu.calendar']}
        </Link>
      </MenuItem>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <Link href={LINK_FRONTEND_INSTITUTE_CONTACT}>
          <Contacts className={classes.menuIcons}/> {messages['menu.contact']}
        </Link>
      </MenuItem>
      <MenuItem component='span' className={classes.menuItemMobile}>
        <LanguageSwitcher/>
      </MenuItem>
    </StyledMenu>
  );

  return (
    <>
      <StyledBox>
        <Container
          maxWidth='lg'
          sx={{margin: 'auto', display: 'flex'}}
          className={classes.logoArea}
          style={{marginTop: '16px'}}>
          <Link
            href={LINK_FRONTEND_INSTITUTE_ROOT}
            className={classes.headerHalfLogo}>
            {institute?.logo && (
              <Box>
                <CardMediaImageView
                  className={classes.logoInstitute}
                  image={institute?.logo}
                  alt='institute logo'
                />
              </Box>
            )}
          </Link>

          <Grid item md={4} className={classes.instituteName}>
            <Text
              fontWeight={'bold'}
              style={{color: '#6C91C5', fontWeight: '700'}}>
              {institute?.title}
            </Text>
          </Grid>

          <Grid item md={4} className={classes.headerHalf} mr={5}>
            <img
              className={classes.logoInstitute}
              src='/images/EDUC-SSP3.png'
              alt='institute logo'
            />
          </Grid>
        </Container>
      </StyledBox>
      <StyledAppBar
        position='relative'
        color={'inherit'}
        className={clsx(classes.appBar, 'app-bar')}>
        <Toolbar
          className={clsx(classes.headerMain, classes.headerFixedHeight)}>
          <Container
            maxWidth={'lg'}
            className={clsx(classes.headerMainFlex, classes.headerFixedHeight)}>
            {/*<Box className={classes.grow} />*/}
            <Box
              className={clsx(
                classes.sectionDesktop,
                classes.headerFixedHeight,
              )}>
              <Box className={classes.headerMenu}>
                <Box className={classes.headerMenuGroup}>
                  <Link
                    href={LINK_FRONTEND_INSTITUTE_ROOT}
                    className={classes.firstMenuItem}>
                    <Home className={classes.menuIcons} fontSize={'large'}/>
                    {messages['menu.first_page']}
                  </Link>
                  <MenuDivider/>
                  <Link
                    href={LINK_FRONTEND_INSTITUTE_COURSES}
                    className={classes.menuItem}>
                    <AutoStories className={classes.menuIcons}/>
                    {messages['menu.courses']}
                  </Link>
                  <MenuDivider/>
                  <Link
                    href={LINK_FRONTEND_INSTITUTE_JOBS}
                    className={classes.menuItem}>
                    <WorkIcon className={classes.menuIcons}/>
                    {messages['menu.jobs']}
                  </Link>
                  <MenuDivider/>
                  <Box
                    sx={{cursor: 'pointer'}}
                    onClick={openCertificateVerifyModal}
                    className={classes.menuItem}>
                    <CardMembershipIcon className={classes.menuIcons}/>
                    {messages['menu.certificate']}
                  </Box>
                  <MenuDivider/>
                  {
                    isDgnm && (
                      <Link
                        href={LINK_FRONTEND_INSTITUTE_CIRCULAR}
                        className={classes.menuItem}>
                        <WorkIcon className={classes.menuIcons}/>
                        {messages['menu.circular']}
                      </Link>
                    )
                  }
                  {/*<Link
                    href={LINK_FRONTEND_INSTITUTE_VIDEOS}
                    className={classes.menuItem}>
                    <OndemandVideo className={classes.menuIcons} />
                    {messages['menu.videos']}
                  </Link>*/}
                  <MenuDivider/>
                  <Link
                    href={LINK_FRONTEND_INSTITUTE_FEEDBACK}
                    className={classes.menuItem}>
                    <Feedback className={classes.menuIcons}/>
                    {messages['menu.feedback']}
                  </Link>
                  <MenuDivider/>
                  {/* <Link
                    href={LINK_FRONTEND_INSTITUTE_FAQ}
                    className={classes.menuItem}>
                    <Quiz className={classes.menuIcons}/>
                    {messages['menu.faq']}
                  </Link>
                  <MenuDivider/>*/}
                  <Link
                    href={LINK_FRONTEND_INSTITUTE_CALENDAR}
                    className={classes.menuItem}>
                    <CalendarMonth className={classes.menuIcons}/>
                    {messages['menu.calendar']}
                  </Link>
                  <MenuDivider/>
                  <Link
                    href={LINK_FRONTEND_INSTITUTE_CONTACT}
                    className={classes.menuItem}>
                    <Contacts className={classes.menuIcons}/>
                    {messages['menu.contact']}
                  </Link>
                  <MenuDivider/>
                </Box>
              </Box>
            </Box>

            <Box className={classes.headerMenuGroup}>
              <Box sx={{height: '100%'}} className={classes.languageSwitcher}>
                <LanguageSwitcher/>
              </Box>
              {authUser ? <GotoDashboardButton/> : <GotoSignInOrUpButton/>}
            </Box>

            <Box ml={1} className={classes.sectionMobile}>
              <IconButton
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                // color='inherit'
                className={classes.mobileMenuButton}
                size='large'>
                <MoreIcon/>
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
        {
          isModalOpen && (
            <PublicVerifyCertificateModal isModalOpen={isModalOpen}
                                          closeCertificateVerifyModal={closeCertificateVerifyModal}/>
          )
        }
      </StyledAppBar>
      {renderMobileMenu}
    </>
  );
};
export default Header;
