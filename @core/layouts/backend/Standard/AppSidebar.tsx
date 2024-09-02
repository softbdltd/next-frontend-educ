import React, {useContext} from 'react';
import clsx from 'clsx';
import UserInfo from '../../../../shared/components/UserInfo';
import Navigation from '../../../../@core/core/Navigation/VerticleNav';
import {toggleNavCollapsed} from '../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import {classes, StyledBox, StyledDrawer} from './AppSidebar.style';
import Scrollbar from '../../../../@core/core/Scrollbar';
import {AppState} from '../../../../redux/store';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Theme} from '@mui/system';
import {ThemeMode} from '../../../../shared/constants/AppEnums';
import AppContextPropsType from '../../../../redux/types/AppContextPropsType';
import {AppContext} from '../../../../@core';

interface AppSidebarProps {
  position?: 'left' | 'bottom' | 'right' | 'top';
  variant?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  position = 'left',
  variant = '',
}) => {
  const {themeMode, sidebarColors} =
    useContext<AppContextPropsType>(AppContext);
  const dispatch = useDispatch();
  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );

  const handleToggleDrawer = () => {
    dispatch(toggleNavCollapsed());
  };

  let sidebarClasses = classes.sidebarStandard;

  const breakpointMDUp = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('md'),
  );
  return (
    <>
      {breakpointMDUp ? (
        <StyledBox
          height='100%'
          className={clsx(classes.container, 'app-sidebar')}>
          <Box
            className={sidebarClasses}
            sx={{
              backgroundColor:
                themeMode === ThemeMode.SEMI_DARK
                  ? sidebarColors?.bgColor
                  : themeMode === ThemeMode.LIGHT
                  ? 'white'
                  : '#313541',
            }}>
            <UserInfo />
            <Scrollbar className={classes.scrollAppSidebar}>
              <Navigation />
            </Scrollbar>
          </Box>
        </StyledBox>
      ) : (
        <StyledDrawer
          anchor={position}
          open={navCollapsed}
          onClose={() => handleToggleDrawer()}
          classes={{
            root: clsx(variant),
            paper: clsx(variant),
          }}
          style={{position: 'absolute'}}>
          <Box height='100%' className={classes.container}>
            <Box
              className={sidebarClasses}
              sx={{
                backgroundColor:
                  themeMode === ThemeMode.SEMI_DARK
                    ? sidebarColors?.bgColor
                    : themeMode === ThemeMode.LIGHT
                    ? 'white'
                    : '#313541',
              }}>
              <UserInfo />
              <Scrollbar className={classes.drawerScrollAppSidebar}>
                <Navigation />
              </Scrollbar>
            </Box>
          </Box>
        </StyledDrawer>
      )}
    </>
  );
};

export default AppSidebar;
