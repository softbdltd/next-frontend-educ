import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React, {useContext} from 'react';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const NearByTrainingCenters = asyncComponent(
  () => import('../../../modules/learner/training/AllNearbyTrainingCenter'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.training']}
      />
      <NearByTrainingCenters />
    </>
  );
});
