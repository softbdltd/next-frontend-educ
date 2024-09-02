import asyncComponent from '../../../../@core/utility/asyncComponent';
import DashboardPage from '../../../../@core/layouts/hoc/DashboardPage';
import {useIntl} from 'react-intl';
import PageMeta from '../../../../@core/core/PageMeta';
import React from 'react';

/*const JobCandidatesPage = asyncComponent(
  () => import('../../../../modules/dashboard/candidates/CandidatePageV1'),
);*/

const JobCandidatesPage = asyncComponent(
  () => import('../../../../modules/dashboard/candidates/CandidatesPage'),
);

export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.candidates'] as string} />
      <JobCandidatesPage />
    </>
  );
});
