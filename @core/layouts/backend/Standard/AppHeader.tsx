import React, {useContext, useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import LanguageSwitcher from '../../../../@core/core/LanguageSwitcher';
import {toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch} from 'react-redux';
import Box from '@mui/material/Box';
import SearchBar from '../../../../@core/core/SearchBar';
import {classes, StyledAppBar, StyledToolbar} from './AppHeader.style';
import Notifications from '../../../../@core/core/Notifications';
import AppLogo from '../../../../shared/components/AppLogo';
import clsx from 'clsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Theme} from '@mui/system';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {useIntl} from 'react-intl';
import {Body1, Link} from '../../../elements/common';
import {Button} from '@mui/material';
import {CommonAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AppContextPropsType from '../../../../redux/types/AppContextPropsType';
import AppContext from '../../../../@core/utility/AppContext';
import {styled} from '@mui/material/styles';
import {getNascibDomain} from '../../../utilities/helpers';

interface AppHeaderProps {}

const StyledMenu = styled(Menu)(({theme}) => ({
  ['& .MuiPaper-root']: {
    overflow: 'unset',
  },
}));

const AppHeader: React.FC<AppHeaderProps> = () => {
  const dispatch = useDispatch();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const authUser = useAuthUser<CommonAuthUser>();
  const {updateSidebarShowHide, showSideBar} =
    useContext<AppContextPropsType>(AppContext);
  const {messages} = useIntl();
  const [paymentURL, setPaymentURL] = useState<string | null>(null);

  const homePageUrl = `${window?.location?.protocol}//${
    authUser?.domain ? authUser?.domain : ''
  }`;

  useEffect(() => {
    if (
      authUser &&
      authUser?.organization &&
      authUser.organization?.additional_information?.payment_page_url
    ) {
      const paymentUrl =
        window.location.protocol +
        '//' +
        getNascibDomain(window.location.hostname) +
        authUser.organization.additional_information.payment_page_url;
      setPaymentURL(paymentUrl);
    }
  }, [authUser]);

  const breakpointMDUp = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('md'),
  );

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

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
      <MenuItem className={classes.menuItemRoot}>
        <Notifications />
      </MenuItem>
      <LanguageSwitcher />
    </StyledMenu>
  );

  return (
    <>
      <StyledAppBar
        color='inherit'
        className={clsx(classes.appBar, 'app-bar')}
        sx={showSideBar ? {} : {width: '100vw !important'}}>
        <StyledToolbar className={classes.appToolbar}>
          {!breakpointMDUp && (
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='open drawer'
              onClick={() => dispatch(toggleNavCollapsed())}
              size='large'>
              <MenuIcon className={classes.menuIcon} />
            </IconButton>
          )}
          {/* <AppNavLink to='http://educ.asm'>
            <AppLogo />
          </AppNavLink> */}
          <Box
            sx={{
              alignSelf: 'center',
              marginTop: '10px',
              cursor: 'pointer',
              marginRight: breakpointMDUp ? '10px' : 0,
            }}
            onClick={() => {
              if (updateSidebarShowHide) {
                updateSidebarShowHide(!showSideBar);
              }
            }}>
            {breakpointMDUp &&
              (showSideBar ? (
                <ArrowBackIosNewIcon sx={{color: '#313541'}} />
              ) : (
                <ArrowForwardIosIcon sx={{color: '#313541'}} />
              ))}
          </Box>
          <Link href={homePageUrl}>
            <AppLogo />
          </Link>
          <Box className={classes.grow} />
          <SearchBar borderLight placeholder='Search…' />
          <Box className={classes.sectionDesktop}>
            <Notifications />
            <LanguageSwitcher />
          </Box>
          <Box className={classes.sectionMobile}>
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

          {paymentURL && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  background: 'red',
                  padding: '3px',
                  width: '500px',
                  border: '1px solid red',
                  color: '#fff',
                  top: '10px',
                  left: 'calc(50vw - 250px)',
                  zIndex: '1101',
                  textAlign: 'center',
                  borderRadius: '5px',
                }}>
                {paymentURL.includes('member-registration-payment-method') ? (
                  <Body1 centered={true}>
                    {messages['payment.incomplete_text']}
                  </Body1>
                ) : (
                  <Body1 centered={true}>
                    {messages['common.renewal_payment']}
                  </Body1>
                )}

                <Button variant={'contained'} color={'primary'}>
                  <Link href={paymentURL} passHref={true}>
                    {messages['common.pay_now']}
                  </Link>
                </Button>
              </Box>
            </>
          )}
        </StyledToolbar>
      </StyledAppBar>
      {renderMobileMenu}
    </>
  );
};
export default AppHeader;
