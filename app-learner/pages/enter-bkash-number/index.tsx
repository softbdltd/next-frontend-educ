import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const YouthEnterBkashNumberPage = asyncComponent(
  () => import('../../../modules/learner/enterBkashNumber'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.enter_bkash_number'] as string} />
      <YouthEnterBkashNumberPage />
    </>
  );
});
