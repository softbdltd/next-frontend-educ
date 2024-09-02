import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';

const EducNoticeDetailsPage = asyncComponent(
  () => import('../../../shared/components/NoticeDetails'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.notice_details'] as string} />
      <EducNoticeDetailsPage />
    </>
  );
});
