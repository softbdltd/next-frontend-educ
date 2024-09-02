import asyncComponent from '../../../@core/utility/asyncComponent';
import React, {useContext} from 'react';
import PageMeta from '../../../@core/core/PageMeta';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';
import EducFrontPage from '../../../@core/layouts/hoc/EducFrontPage';

const InstituteGallery = asyncComponent(
  () => import('../../../modules/institute/gallery'),
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
      <InstituteGallery />
    </>
  );
});
