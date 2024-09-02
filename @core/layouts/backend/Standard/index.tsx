import React, {useContext} from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import {ContentView, ThemeSetting} from '../../../../@core';
import Box from '@mui/material/Box';
import {classes, StyledBox} from './index.style';
import clsx from 'clsx';
import AppContext from '../../../../@core/utility/AppContext';
import AppFixedFooter from './AppFixedFooter';
import {LayoutType} from '../../../../shared/constants/AppEnums';
import AppContextPropsType from '../../../../redux/types/AppContextPropsType';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Theme} from '@mui/system';
import CremaThemeProvider from '../../../../@core/utility/CremaThemeProvider';

interface StandardLayoutProps {
  props?: any;
}

const StandardLayout: React.FC<StandardLayoutProps> = (props) => {
  const {footer, layoutType, footerType, showSideBar} =
    useContext<AppContextPropsType>(AppContext);

  const breakpointMDUp = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(showSideBar ? 'md' : 'xl'),
  );

  return (
    <CremaThemeProvider>
      <StyledBox
        className={clsx(
          classes.appMain,
          layoutType === LayoutType.BOXED ? classes.boxedLayout : '',
          {
            appMainFooter: footer && footerType === 'fluid',
            appMainFixedFooter: footer && footerType === 'fixed',
          },
        )}>
        {showSideBar && <AppSidebar />}

        <Box
          className={classes.mainContent}
          sx={showSideBar ? {} : {marginLeft: '0px !important'}}>
          {breakpointMDUp ? (
            <Box
              className={classes.mainContainer}
              sx={showSideBar ? {} : {width: '100vw !important'}}>
              <AppHeader />
              <ContentView>{props.children}</ContentView>
              <AppFixedFooter />
            </Box>
          ) : (
            <Box className={classes.mainContainerFull}>
              <AppHeader />
              <ContentView>{props.children}</ContentView>
              <AppFixedFooter />
            </Box>
          )}
        </Box>
        <ThemeSetting />
      </StyledBox>
    </CremaThemeProvider>
  );
};

export default StandardLayout;
