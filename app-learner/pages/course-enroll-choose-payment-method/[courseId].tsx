import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthSecondaryPage from '../../../@core/layouts/hoc/YouthSecondaryPage';

const YouthPaymentMethodPage = asyncComponent(
  () => import('../../../modules/learner/choosePaymentMethod'),
);
export default YouthSecondaryPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.payment_method'] as string} />
      <YouthPaymentMethodPage />
    </>
  );
});
