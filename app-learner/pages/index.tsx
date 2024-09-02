import asyncComponent from '../../@core/utility/asyncComponent';
import PageMeta from '../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../@core/layouts/hoc/YouthFrontPage';

const YouthProfilePage = asyncComponent(
  () => import('../../modules/learner/profile/YouthProfilePage'),
);

export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['learner_profile.label']} />
      <YouthProfilePage />
    </>
  );
});
