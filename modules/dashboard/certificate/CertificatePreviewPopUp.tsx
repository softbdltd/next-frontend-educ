import React from 'react';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconCourse from '../../../@core/icons/IconCourse';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import dynamic from 'next/dynamic';
import {Grid} from '@mui/material';
import {RecoilRoot} from 'recoil';

const CertificatePreview = dynamic(() => import('./editor/CertificateView'), {
  ssr: false,
});
type Props = {
  itemId: number;
  onClose: () => void;
};

const CertificatePreviewPopup = ({itemId, ...props}: Props) => {
  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconCourse />
            <IntlMessages id='course.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} />
          </>
        }>
        <Grid container>
          <RecoilRoot>
            <CertificatePreview templateId={itemId} />
          </RecoilRoot>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default CertificatePreviewPopup;
