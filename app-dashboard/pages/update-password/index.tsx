import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import AuthenticatedBlankPage from '../../../@core/layouts/hoc/AuthenticatedBlankPage';
import {responsiveFontSizes, ThemeProvider} from '@mui/material';
import theme from '../../../@core/layouts/themes/learner';
import {useTheme} from '@mui/material/styles';
const UpdatePasswordPage = asyncComponent(
  () => import('../../../modules/dashboard/updatePassword/UpdatePasswordPage'),
);

export default AuthenticatedBlankPage(() => {
  const {messages} = useIntl();
  return (
    <ThemeProvider theme={responsiveFontSizes(theme(useTheme()))}>
      <PageMeta title={messages['update_password.label']} />
      <UpdatePasswordPage />
    </ThemeProvider>
  );
});
