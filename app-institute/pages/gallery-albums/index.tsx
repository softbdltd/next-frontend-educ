import asyncComponent from '../../../@core/utility/asyncComponent';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import React, {useContext} from 'react';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const InstituteGallery = asyncComponent(
  () => import('../../../modules/institute/gallery'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.gallery_album'] as string}
      />
      <InstituteGallery />
    </>
  );
});
