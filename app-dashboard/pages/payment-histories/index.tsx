import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const PaymentHistoryPage = asyncComponent(
  () =>
    import('../../../modules/dashboard/paymentHistories/PaymentHistoriesPage'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['common.payment_histories']} />
      <PaymentHistoryPage />
    </>
  );
});
