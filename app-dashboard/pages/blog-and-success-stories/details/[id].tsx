import React from 'react';
import {useIntl} from 'react-intl';
import asyncComponent from '../../../../@core/utility/asyncComponent';
import DashboardPage from '../../../../@core/layouts/hoc/DashboardPage';
import PageMeta from '../../../../@core/core/PageMeta';

const BlogAndStoriesViewPage = asyncComponent(
  () =>
    import(
      '../../../../modules/learner/blogAndSuccessStories/BlogAndSuccessStoriesDetails'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta
        title={messages['blog_and_success_stories.details'] as string}
      />
      <BlogAndStoriesViewPage />
    </>
  );
});
