import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const UpdatePasswordPage = asyncComponent(
  () => import('../../../modules/learner/updatePassword'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['update_password.label']} />
      <UpdatePasswordPage />
    </>
  );
});
