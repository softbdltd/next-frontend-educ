import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import React from 'react';
import YouthFrontPage from '../../../../@core/layouts/hoc/YouthFrontPage';
import {useIntl} from 'react-intl';

const BlogAndSuccessStoriesDetails = asyncComponent(
  () =>
    import(
      '../../../../modules/learner/blogAndSuccessStories/BlogAndSuccessStoriesDetails'
    ),
);
export default YouthFrontPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['blog_and_success_stories.details']} />
      <BlogAndSuccessStoriesDetails />
    </>
  );
});
