import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const YouthEnterBkashPinPage = asyncComponent(
  () => import('../../../modules/learner/enterBkashPin'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.enter_bkash_pin'] as string} />
      <YouthEnterBkashPinPage />
    </>
  );
});
