import React from 'react';
import {styled} from '@mui/material/styles';
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import Slide from '@mui/material/Slide';

const PREFIX = 'CustomMuiModal';

const classes = {
  pageTitle: `${PREFIX}-pageTitle`,
  closeButton: `${PREFIX}-closeButton`,
};

const StyledDialog = styled(Dialog)(({theme}) => ({
  margin: 0,
  padding: theme.spacing(3),

  [`& .${classes.pageTitle}`]: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: '12px',
    },
  },

  [`& .${classes.closeButton}`]: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  ['.landing-page-without-bg-popup-notice .CustomMuiModal-closeButton']: {
    background: theme.palette.primary.main,
  },
}));

export interface DialogTitleProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const DialogTitle = (props: DialogTitleProps) => {
  const {children, onClose, ...other} = props;

  return (
    <MuiDialogTitle {...other}>
      <Typography className={classes.pageTitle}>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
          size='large'>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction='up' ref={ref} {...props} />;
});

interface CustomMuiModalProps {
  open: boolean;
  onClose: () => any;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  classNames?: string;
}

const CustomMuiModal: React.FC<CustomMuiModalProps> = ({
  onClose,
  children,
  maxWidth = 'md',
  open,
  classNames,
}) => {
  return (
    <StyledDialog
      aria-labelledby='simple-modal-title'
      TransitionComponent={Transition}
      aria-describedby='simple-modal-description'
      PaperProps={{
        className: classNames ?? '',
      }}
      open={open}
      maxWidth={maxWidth}
      fullWidth
      scroll={'body'}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}>
      {children}
    </StyledDialog>
  );
};

export default CustomMuiModal;
