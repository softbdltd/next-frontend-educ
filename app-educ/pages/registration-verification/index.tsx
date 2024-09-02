import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import EducSecondaryPage from '../../../@core/layouts/hoc/EducSecondaryPage';

const RegistrationVerificationPage = asyncComponent(
  () => import('../../../modules/registrationVerification'),
);
export default EducSecondaryPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.verify'] as string} />
      <RegistrationVerificationPage />
    </>
  );
});
