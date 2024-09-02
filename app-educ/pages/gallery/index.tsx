import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React from 'react';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';
import {useIntl} from 'react-intl';

const GalleryPage = asyncComponent(
  () => import('../../../modules/educ/gallery/GalleryPage'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta title={messages['common.gallery']} />
      <GalleryPage />
    </>
  );
});
