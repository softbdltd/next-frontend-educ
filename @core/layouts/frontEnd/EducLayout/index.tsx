import React from 'react';
import AppHeader from './AppHeader';
import Box from '@mui/material/Box';
import {classes, StyledBox} from './index.style';
import clsx from 'clsx';
import ContentView from '../../../../@core/core/ContentView';
import Footer from '../../../../modules/home/Footer';
import AccessibilityToolbar from '../../../components/accessibility/AccessibilityToolbar';
import Subscribe from '../../../elements/Subscribe/Subscribe';

interface HorLightNavProps {
  props?: any;
}

const EducLayout: React.FC<HorLightNavProps> = (props) => {
  return (
    <StyledBox className={clsx(classes.appMain, 'appMainHor')}>
      <AccessibilityToolbar />
      <AppHeader />
      <Box className={classes.mainContent}>
        <Box className={classes.mainContainer}>
          <ContentView>{props.children}</ContentView>
        </Box>
      </Box>
      <Subscribe />
      <Footer />
    </StyledBox>
  );
};

export default EducLayout;
