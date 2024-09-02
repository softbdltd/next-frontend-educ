import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import {useIntl} from 'react-intl';

const NewsPage = asyncComponent(
  () => import('../../../modules/educ/news/NewsPage'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['notice_type.news']} />
      <NewsPage />
    </>
  );
});
