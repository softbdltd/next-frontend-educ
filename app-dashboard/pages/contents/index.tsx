import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const NuMarketsPage = asyncComponent(
  () => import('../../../modules/dashboard/freelancingContent/contentPage'),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.audio_video_content']} />
      <NuMarketsPage />
    </>
  );
});
