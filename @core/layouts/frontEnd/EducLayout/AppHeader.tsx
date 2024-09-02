import MoreIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Container,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {Theme} from '@mui/system';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import LanguageToggle from '../../../../@core/core/LanguageToggle';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import AppLogo from '../../../../shared/components/AppLogo';
import {
  LINK_FRONTEND_CAREER_SERVICES,
  LINK_FRONTEND_ENTREPRENEURSHIP_ACCESS_TO_MARKET,
  LINK_FRONTEND_ENTREPRENEURSHIP_ACCESS_TO_SKILL,
  LINK_FRONTEND_GALLERY,
  LINK_FRONTEND_JOBS,
  LINK_FRONTEND_NEWS,
  LINK_FRONTEND_EDUC_PUBLICATIONS,
  LINK_FRONTEND_EDUC_ROOT,
  LINK_FRONTEND_EDUC_SKILLS,
  LINK_FRONTEND_PARTNERSHIP,
  LINK_FRONTEND_RESOURCES,
} from '../../../common/appLinks';
import GotoDashboardButton from '../../../elements/button/GotoDashboardButton/GotoDashboardButton';
import GotoSignInOrUpButton from '../../../elements/button/GotoSigninOrUpButton/GotoSignInOrUpButton';
import {NavLink as Link} from '../../../elements/common';
import Hidden from '../../../elements/Hidden';
import {classes, StyledAppBar, StyledContainer} from './AppHeader.style';
import NestedHeaderMenus from './NestedHeaderMenus';
import NestedHeaderMobileMenus from './NestedHeaderMobileMenus';

interface AppHeaderProps {}

const menuItems = [
  {href: LINK_FRONTEND_EDUC_ROOT, messageKey: 'menu.home'},
  {href: LINK_FRONTEND_EDUC_SKILLS, messageKey: 'common.skills'},
  {href: LINK_FRONTEND_JOBS, messageKey: 'menu.jobs'},
  {
    isInvalid: false,
    messageKey: 'menu.entrepreneurship',
    subMenus: [
      {
        href: LINK_FRONTEND_ENTREPRENEURSHIP_ACCESS_TO_SKILL,
        messageKey: 'common.access_to_skill',
      },
      {
        href: LINK_FRONTEND_ENTREPRENEURSHIP_ACCESS_TO_MARKET,
        messageKey: 'common.access_to_market',
      },
      {
        href: 'https://www.bb.org.bd/en/index.php/links/links/2',
        messageKey: 'common.access_to_finance',
        isOpenNewTab: true,
      },
      {
        href: 'https://www.m.com/services?category=sector&data=service-sector-45',
        messageKey: 'common.access_to_service',
        isOpenNewTab: true,
      },
    ],
  },
  {href: LINK_FRONTEND_CAREER_SERVICES, messageKey: 'menu.career_services'},
  {href: LINK_FRONTEND_PARTNERSHIP, messageKey: 'menu.partnership'},
  {
    href: LINK_FRONTEND_RESOURCES,
    messageKey: 'menu.resources',
    subMenus: [
      {
        href: LINK_FRONTEND_EDUC_PUBLICATIONS,
        messageKey: 'menu.publications',
      },
      {
        href: LINK_FRONTEND_NEWS,
        messageKey: 'footer.news',
      },
      {
        href: LINK_FRONTEND_GALLERY,
        messageKey: 'menu.gallery',
      },
    ],
  },
];

const AppHeader: React.FC<AppHeaderProps> = () => {
  const authUser = useAuthUser();
  const router = useRouter();
  const currentPath = router.pathname;
  const isRegistrationPage = currentPath.includes('/learner-fair-registration');
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
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}>
      {menuItems?.map((menuItem: any, index) => {
        if (!menuItem?.subMenus) {
          return (
            <MenuItem
              key={index}
              component='span'
              className={classes.menuItemMobile}>
              <Link href={menuItem?.href}>
                {messages[menuItem?.messageKey]}
              </Link>
            </MenuItem>
          );
        } else {
          return (
            <NestedHeaderMobileMenus
              key={index}
              items={menuItem?.subMenus}
              title={messages[menuItem?.messageKey] as string}
              onClick={handleMobileMenuClose}
            />
          );
        }
      })}
    </Menu>
  );

  return (
    <>
      <StyledContainer maxWidth={'lg'}>
        <Grid
          container
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{height: '70px'}}>
          <Grid item sx={{ml: {xs: 1.2, md: 0}}}>
            <Grid container alignItems={'center'} spacing={1}>
              <Grid item>
                <Link href={LINK_FRONTEND_EDUC_ROOT}>
                  <AppLogo height={isMDDown ? 40 : 60} />
                </Link>
              </Grid>
              <Hidden mdDown>
                <Grid item>
                  <Typography
                    tabIndex={0}
                    variant={'h6'}
                    className={classes.educTitle}>
                    {messages['educ.title_description']}
                  </Typography>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>

          <Grid item>
            <Stack
              direction='row'
              spacing={2}
              alignItems='center'
              sx={(theme) => {
                return {
                  [`& #my-profile-button`]: {
                    height: '40px',
                    [`${theme.breakpoints.only('xs')}`]: {
                      padding: '10px',
                    },
                  },
                };
              }}>
              <LanguageToggle />
              <Hidden mdDown>
                {authUser ? (
                  <GotoDashboardButton />
                ) : (
                  !isRegistrationPage && <GotoSignInOrUpButton />
                )}
              </Hidden>
              <Hidden mdUp>
                {authUser ? (
                  <GotoDashboardButton />
                ) : (
                  !isRegistrationPage && <GotoSignInOrUpButton />
                )}
              </Hidden>
              <Hidden mdUp>
                <Box>
                  <IconButton
                    aria-label='show more'
                    aria-controls={mobileMenuId}
                    aria-haspopup='true'
                    onClick={handleMobileMenuOpen}
                    color='inherit'
                    size='large'
                    sx={(theme) => {
                      return {
                        [`${theme.breakpoints.only('xs')}`]: {
                          padding: '0px',
                          marginLeft: '-12px',
                          paddingRight: '5px',
                        },
                      };
                    }}>
                    <MoreIcon />
                  </IconButton>
                </Box>
              </Hidden>
            </Stack>
          </Grid>
        </Grid>
      </StyledContainer>

      <Hidden mdDown>
        <StyledAppBar position='relative'>
          <Toolbar>
            <Container maxWidth={'lg'}>
              <Stack
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                mx={3}
                spacing={6}>
                {menuItems?.map((menu: any, index) => {
                  if (!menu?.subMenus) {
                    return (
                      <Box key={index} className={classes.menuItem}>
                        <Link href={menu.href}>
                          {messages[menu.messageKey]}
                        </Link>
                      </Box>
                    );
                  } else {
                    return (
                      <NestedHeaderMenus
                        key={index}
                        buttonTitle={menu.messageKey}
                        subMenus={menu.subMenus}
                      />
                    );
                  }
                })}
              </Stack>
            </Container>
          </Toolbar>
        </StyledAppBar>
      </Hidden>
      {renderMobileMenu}
    </>
  );
};
export default AppHeader;
