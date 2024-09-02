import React, {FC} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  DialogActions,
  IconButton,
} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import {H5} from '../../../../@core/elements/common';

interface CustomHookFormProps {
  title: React.ReactNode | string;
  actions?: React.ReactNode;
  handleSubmit: any;
  onClose?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const   CustomHookForm: FC<CustomHookFormProps> = ({
  handleSubmit,
  children,
  actions,
  ...props
}) => {
  return (
    <Card>
      <CardHeader
        action={
          props.onClose && (
            <IconButton aria-label='close' tabIndex={0} onClick={props.onClose} size='large'>
              <CloseIcon />
            </IconButton>
          )
        }
        title={<H5>{props.title}</H5>}
      />
      <CardContent sx={{position: 'relative'}}>
        <form onSubmit={handleSubmit} autoComplete='off'>
          {children}
          {actions && <DialogActions>{actions}</DialogActions>}
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomHookForm;
