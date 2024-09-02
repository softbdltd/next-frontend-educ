import React from 'react';
import InstituteDefaultLayout from '../../frontEnd/InstituteDefaultLayout';
import {responsiveFontSizes, useTheme} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../../themes/instituteDefault';

const withLayout = (ComposedComponent: any) => (props: any) => {
  const defaultTheme = useTheme();
  return (
    <ThemeProvider theme={responsiveFontSizes(theme(defaultTheme))}>
      <InstituteDefaultLayout>
        <ComposedComponent {...props} />
      </InstituteDefaultLayout>
    </ThemeProvider>
  );
};
export default withLayout;
