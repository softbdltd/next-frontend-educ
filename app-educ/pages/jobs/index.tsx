import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import {useIntl} from 'react-intl';

const Jobs = asyncComponent(
  () => import('../../../modules/industry/jobCircular'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.jobs']} />
      <Jobs />
    </>
  );
});
