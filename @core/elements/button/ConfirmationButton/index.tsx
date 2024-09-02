import React, {useCallback, useState} from 'react';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {Button} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import {Fonts} from '../../../../shared/constants/AppEnums';
import DialogContentText from '@mui/material/DialogContentText';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import {grey} from '@mui/material/colors';
import {Check, Clear, Close} from '@mui/icons-material';
import {H4} from '../../common';
import clsx from 'clsx';
import Slide from '@mui/material/Slide';
import {FiTrash2} from 'react-icons/fi';
import {processServerSideErrors} from '../../../utilities/validationErrorHandler';
import useNotiStack from '../../../hooks/useNotifyStack';

const PREFIX = 'ConfirmDialog';

const classes = {
  btn: `${PREFIX}-btn`,
  btn_no: `${PREFIX}-btn_no`,
  btn_red: `${PREFIX}-btn_red`,
  btn_green: `${PREFIX}-btn_green`,
  mainWrapper: `${PREFIX}-mainWrapper`,
  contentText: `${PREFIX}-contentText`,
  iconWrapper: `${PREFIX}-iconWrapper`,
};

const StyledButton = styled(Button)(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    ['&.show-icon']: {
      minWidth: 0,
      boxShadow: '0px 5px 6px rgb(155 155 155 / 42%)',
      ['& .MuiButton-startIcon']: {
        margin: 0,
      },
    },
  },
}));

const StyledDialog = styled(Dialog)(({theme}) => ({
  [`& .${classes.btn}`]: {
    fontWeight: Fonts.MEDIUM,
    width: '100%',
    borderRadius: '0px',
    color: theme.palette.common.white,
    '&.Mui-disabled': {
      backgroundColor: '#d2d2d2 !important',
      color: '#7e7e7e !important',
    },
  },
  [`& .${classes.btn_no}`]: {
    backgroundColor: '#b0b0b0',
    '&:hover': {
      backgroundColor: '#888888',
    },
  },
  [`& .${classes.btn_red}`]: {
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: '#cf1313',
    },
  },
  [`& .${classes.btn_green}`]: {
    backgroundColor: '#19b919',
    '&:hover': {
      backgroundColor: '#138613',
    },
  },
  [`& .${classes.mainWrapper}`]: {
    padding: '25px',
    minWidth: '370px',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '25px 50px',
      minWidth: 'auto',
    },
  },
  [`& .${classes.contentText}`]: {
    color: grey[600],
  },
  [`& .${classes.iconWrapper}`]: {
    marginBottom: '10px',
    '& svg': {
      height: '60px',
      width: '60px',
    },
    '& img': {
      height: '60px',
      width: '60px',
    },
  },
}));

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction='up' ref={ref} {...props} />;
});

type ButtonType = 'delete' | 'publish' | 'reject' | 'approve';

const buttonTextMessageKey = {
  delete: 'common.delete',
  publish: 'common.publish',
  reject: 'common.reject',
  approve: 'common.approve',
};

const dialogTitleKey = {
  delete: 'common.delete_item',
  publish: 'common.publish_item',
  reject: 'common.reject_item',
  approve: 'common.approve_item',
};
const buttonIcons = {
  delete: <FiTrash2 style={{color: 'red'}} />,
  publish: <Check sx={{color: 'green'}} />,
  reject: <Clear sx={{color: 'red'}} />,
  approve: <Check sx={{color: 'green'}} />,
};

interface ConfirmationButtonProps {
  buttonType: ButtonType;
  labelMessageKey?: string;
  buttonIcon?: React.ReactNode;
  dialogTitle?: any;
  dialogBody?: any;
  dialogIcon?: any;
  confirmAction: () => Promise<any>;
  showIconOnly?: boolean;

  [x: string]: any;
}

const ConfirmationButton = ({
  labelMessageKey,
  buttonType,
  buttonIcon,
  dialogTitle,
  dialogBody,
  dialogIcon,
  confirmAction,
  showIconOnly = false,
  isRemark = false,
  ...props
}: ConfirmationButtonProps) => {
  const {errorStack} = useNotiStack();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onConfirm = useCallback(async () => {
    try {
      setIsProcessing(true);
      let retVal = await confirmAction();
      setIsProcessing(false);
      console.log('ret val', retVal);
      setDialogOpen(retVal === 2); // if retVal = 2, diaglog not closed.
      // setDialogOpen(!retVal);
    } catch (error: any) {
      setIsProcessing(false);
      setDialogOpen(false);
      processServerSideErrors({error, errorStack});
    }
  }, [confirmAction]);

  const onDeny = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const getButtonText = () => {
    let messageKey = labelMessageKey
      ? labelMessageKey
      : buttonTextMessageKey[buttonType];
    return <IntlMessages id={messageKey} />;
  };

  const getDialogTitle = () => {
    return dialogTitle ? (
      dialogTitle
    ) : (
      <IntlMessages id={dialogTitleKey[buttonType]} />
    );
  };

  return (
    <React.Fragment>
      <Tooltip arrow title={getButtonText()}>
        <StyledButton
          className={clsx(
            props?.className ? props?.className : '',
            showIconOnly ? 'show-icon' : '',
          )}
          color={
            buttonType == 'delete' || buttonType == 'reject'
              ? 'error'
              : 'success'
          }
          startIcon={buttonIcon ? buttonIcon : buttonIcons[buttonType]}
          onClick={() => setDialogOpen(true)}
          {...props}>
          {showIconOnly ? '' : getButtonText()}
        </StyledButton>
      </Tooltip>
      {isDialogOpen && (
        <StyledDialog
          open={true}
          TransitionComponent={Transition}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              onDeny();
            }
          }}>
          <Box className={classes.mainWrapper}>
            <Box className={classes.iconWrapper}>
              {dialogIcon ? dialogIcon : buttonIcons[buttonType]}
            </Box>
            <H4 sx={{marginBottom: '10px'}}>{getDialogTitle()}</H4>
            <Box>
              <DialogContentText
                className={classes.contentText}
                id='alert-dialog-description'>
                {dialogBody}
              </DialogContentText>
            </Box>
          </Box>
          <Box sx={{display: 'flex'}}>
            <Button
              className={clsx(classes.btn, classes.btn_no)}
              onClick={onDeny}
              color={'primary'}
              disabled={isProcessing}>
              <Close
                sx={{
                  marginRight: '10px',
                  alignSelf: 'flex-start',
                }}
              />
              <IntlMessages id='common.no' />
            </Button>
            {isRemark && (
              <Button
                className={clsx(classes.btn, classes.btn_no)}
                onClick={onDeny}
                color={'secondary'}
                disabled={isProcessing}>
                <Close
                  sx={{
                    marginRight: '10px',
                    alignSelf: 'flex-start',
                  }}
                />
                <IntlMessages id='common.remark' />
              </Button>
            )}
            <Button
              className={clsx(
                classes.btn,
                buttonType == 'delete' || buttonType == 'reject'
                  ? classes.btn_red
                  : classes.btn_green,
              )}
              onClick={onConfirm}
              autoFocus
              disabled={isProcessing}>
              <Check
                sx={{
                  marginRight: '10px',
                  alignSelf: 'flex-start',
                }}
              />
              <IntlMessages id='common.yes' />
            </Button>
          </Box>
        </StyledDialog>
      )}
    </React.Fragment>
  );
};

export default React.memo(ConfirmationButton);
