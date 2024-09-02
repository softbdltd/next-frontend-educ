import asyncComponent from '../../../@core/utility/asyncComponent';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const InstituteFeedback = asyncComponent(
  () => import('../../../modules/institute/feedback'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.feedback']}
      />
      <InstituteFeedback />
    </>
  );
});
