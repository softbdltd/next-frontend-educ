import React from 'react';
import {responsiveFontSizes} from '@mui/material';
import {ThemeProvider, useTheme} from '@mui/material/styles';
import LearnerLayout from '../../frontEnd/LearnerLayout';
import theme from '../../themes/learner';

const withLayout = (ComposedComponent: any) => (props: any) => {
  return (
    <ThemeProvider theme={responsiveFontSizes(theme(useTheme()))}>
      <LearnerLayout>
        <ComposedComponent {...props} />
      </LearnerLayout>
    </ThemeProvider>
  );
};
export default withLayout;
