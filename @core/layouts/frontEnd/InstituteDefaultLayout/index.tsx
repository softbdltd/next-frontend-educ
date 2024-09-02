import React from 'react';
import {styled} from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import {ContentView} from '../../../../@core';
import Box from '@mui/material/Box';
import AccessibilityToolbar from '../../../components/accessibility/AccessibilityToolbar';

const PREFIX = 'InstituteDefaultLayout';

const classes = {
  mainContent: `${PREFIX}-mainContent`,
  mainContainer: `${PREFIX}-mainContainer`,
};

const StyledBox = styled(Box)(({theme}) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  // alignItems: 'center',

  [`& .${classes.mainContent}`]: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  [`& .${classes.mainContainer}`]: {
    flex: 1,
    width: '100%',
    color: theme.palette.text.primary,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
}));

interface InstituteDefaultLayoutProps {
  props?: any;
}

const InstituteDefaultLayout: React.FC<InstituteDefaultLayoutProps> = (
  props,
) => {
  return (
    <StyledBox className={'appMainHor'}>
      <AccessibilityToolbar />
      <Header />
      <Box className={classes.mainContent}>
        <Box className={classes.mainContainer}>
          <ContentView>{props.children}</ContentView>
        </Box>
      </Box>
      <Footer />
    </StyledBox>
  );
};

export default InstituteDefaultLayout;
