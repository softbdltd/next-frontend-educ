import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import asyncComponent from '../../../@core/utility/asyncComponent';
import {DomainDetailsContext} from '../../../@core/contexts/domain';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';

const JobDetailsPage = asyncComponent(
  () => import('../../../modules/industry/circularDetails'),
);
export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);

  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.job_details']}
      />
      <JobDetailsPage />
    </>
  );
});
