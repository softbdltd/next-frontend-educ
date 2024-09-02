import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import EducFrontPage from '../../../../@core/layouts/hoc/EducFrontPage';

const NewsDetailsPage = asyncComponent(
  () => import('../../../../modules/educ/news/NewsDetails'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['news.details']} />
      <NewsDetailsPage />
    </>
  );
});
