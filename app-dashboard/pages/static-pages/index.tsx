import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const StaticPage = asyncComponent(
  () => import('../../../modules/dashboard/staticPages/StaticPage'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['static_page.label'] as string} />
      <StaticPage />
    </>
  );
});
