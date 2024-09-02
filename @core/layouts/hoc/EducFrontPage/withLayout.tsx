import React from 'react';
import EducLayout from '../../frontEnd/EducLayout';
import {responsiveFontSizes, useTheme} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../../themes/educ';

const withLayout = (ComposedComponent: any) => (props: any) => {
  const defaultTheme = useTheme();
  return (
    <ThemeProvider theme={responsiveFontSizes(theme(defaultTheme))}>
      <EducLayout>
        <ComposedComponent {...props} />
      </EducLayout>
    </ThemeProvider>
  );
};
export default withLayout;
