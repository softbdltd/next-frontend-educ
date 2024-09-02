import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';

const GalleryAlbumDetails = asyncComponent(
  () => import('../../../modules/institute/gallery/GalleryAlbumDetails'),
);
export default EducFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.gallery_album'] as string}
      />
      <GalleryAlbumDetails />
    </>
  );
});
