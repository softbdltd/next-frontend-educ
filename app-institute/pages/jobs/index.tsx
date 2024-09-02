import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const JobsPage = asyncComponent(
  () => import('../../../modules/industry/jobCircular'),
);
export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.jobs']}
      />
      <JobsPage />
    </>
  );
});
