import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const YouthSettingsPage = asyncComponent(
  () => import('../../../modules/learner/settings/Settings'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.settings'] as string} />
      <YouthSettingsPage />
    </>
  );
});
