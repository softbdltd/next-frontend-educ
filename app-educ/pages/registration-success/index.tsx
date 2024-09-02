import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import EducSecondaryPage from '../../../@core/layouts/hoc/EducSecondaryPage';

const RegistrationSuccessPage = asyncComponent(
  () => import('../../../modules/registrationSuccess'),
);
export default EducSecondaryPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.registration_success'] as string} />
      <RegistrationSuccessPage />
    </>
  );
});
