import React from 'react';
import {DialogContent, DialogActions} from '@mui/material';
import CustomMuiModal, {DialogTitle} from '../CustomMuiModal/CustomMuiModal';

interface HookFormMuiModalPopupProps {
  title: React.ReactNode | string;
  actions?: React.ReactNode;
  handleSubmit?: any;
  open: boolean;
  onClose: (e?:any) => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const HookFormMuiModal: React.FC<HookFormMuiModalPopupProps> = ({
  handleSubmit,
  children,
  actions,
  ...props
}) => {
  return (
    <CustomMuiModal {...props}>
      <DialogTitle onClose={props.onClose}>{props.title}</DialogTitle>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <DialogContent dividers>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </form>
    </CustomMuiModal>
  );
};

export default HookFormMuiModal;
