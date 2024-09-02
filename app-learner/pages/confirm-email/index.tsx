import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const YouthConfirmEmailPage = asyncComponent(
  () => import('../../../modules/learner/confirmEmail/YouthConfirmEmail'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.confirm_email'] as string} />
      <YouthConfirmEmailPage />
    </>
  );
});
