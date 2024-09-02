import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import {useIntl} from 'react-intl';

const NearByTrainingCenters = asyncComponent(
  () => import('../../../modules/learner/training/AllNearbyTrainingCenter'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.skills']} />
      <NearByTrainingCenters />
    </>
  );
});
