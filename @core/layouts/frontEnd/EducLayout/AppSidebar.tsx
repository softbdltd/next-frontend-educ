import React from 'react';
import Hidden from '@mui/material/Hidden';
import clsx from 'clsx';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import {classes, StyledDrawer} from './AppSidebar.style';
import {AppState} from '../../../../redux/store';
import {Scrollbar} from '../../../../@core';
import {toggleNavCollapsed} from '../../../../redux/actions';
import UserInfo from '../../../../shared/components/UserInfo';
import Navigation from '../../../../@core/core/Navigation/VerticleNav';

interface AppSidebarProps {
  variant?: string;
  position?: 'left' | 'top' | 'right' | 'bottom';
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  position = 'left',
  variant,
}) => {
  const dispatch = useDispatch();
  const {navCollapsed} = useSelector<AppState, AppState['settings']>(
    ({settings}) => settings,
  );
  const handleToggleDrawer = () => {
    dispatch(toggleNavCollapsed());
  };

  return (
    <Hidden lgUp>
      <StyledDrawer
        anchor={position}
        open={navCollapsed}
        onClose={(ev) => handleToggleDrawer()}
        classes={{
          root: clsx(variant),
          paper: clsx(variant),
        }}
        style={{position: 'absolute'}}>
        <Box height='100%' className={classes.drawerContainer}>
          <Box
            height='100%'
            width='100%'
            color='primary.contrastText'
            className={classes.sidebarBg}>
            <UserInfo />
            <Scrollbar className={classes.drawerScrollAppSidebar}>
              <Navigation />
            </Scrollbar>
          </Box>
        </Box>
      </StyledDrawer>
    </Hidden>
  );
};

export default AppSidebar;
