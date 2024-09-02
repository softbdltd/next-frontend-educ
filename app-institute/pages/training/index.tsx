import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React, {useContext} from 'react';
import InstituteFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const EDUCTrainingPage = asyncComponent(
  () => import('../../../modules/learner/training'),
);
export default InstituteFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.training']}
      />
      <EDUCTrainingPage />
    </>
  );
});
