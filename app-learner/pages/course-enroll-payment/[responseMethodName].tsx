import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import AuthenticatedBlankPage from '../../../@core/layouts/hoc/AuthenticatedBlankPage';
import {responsiveFontSizes, ThemeProvider} from '@mui/material';
import theme from '../../../@core/layouts/themes/learner';
import {useTheme} from '@mui/material/styles';

const CourseEnrollmentSuccessPage = asyncComponent(
  () => import('../../../modules/learner/courseRegistrationSuccess'),
);
export default AuthenticatedBlankPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.course_registration']} />
      <ThemeProvider theme={responsiveFontSizes(theme(useTheme()))}>
        <CourseEnrollmentSuccessPage />
      </ThemeProvider>
    </>
  );
});
