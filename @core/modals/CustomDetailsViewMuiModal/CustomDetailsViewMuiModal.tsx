import React from 'react';
import {DialogContent, DialogActions} from '@mui/material';
import CustomMuiModal, {DialogTitle} from '../CustomMuiModal/CustomMuiModal';

interface CustomDetailsViewMuiModalPopupProps {
  title: React.ReactNode | string;
  actions?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CustomDetailsViewMuiModalPopup: React.FC<CustomDetailsViewMuiModalPopupProps> =
  ({children, actions, ...props}) => {
    return (
      <CustomMuiModal {...props}>
        <DialogTitle onClose={props.onClose}>{props.title}</DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </CustomMuiModal>
    );
  };

export default CustomDetailsViewMuiModalPopup;
