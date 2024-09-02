import asyncComponent from '../../../@core/utility/asyncComponent';
import React from 'react';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';
import {useIntl} from 'react-intl';
import PageMeta from '../../../@core/core/PageMeta';

const YouthFAQ = asyncComponent(() => import('../../../modules/institute/faq'));

export default YouthFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['menu.faq']} />
      <YouthFAQ />
    </>
  );
});
