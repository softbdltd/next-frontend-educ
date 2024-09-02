import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import {useIntl} from 'react-intl';
import YouthFrontPage from '../../../@core/layouts/hoc/YouthFrontPage';

const BlogAndSuccessStories = asyncComponent(
  () => import('../../../modules/learner/blogAndSuccessStories'),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['blog_and_success_stories.label']} />
      <BlogAndSuccessStories />
    </>
  );
});
