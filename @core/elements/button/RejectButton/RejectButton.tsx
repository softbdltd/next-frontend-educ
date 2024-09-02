import React, {useCallback, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';

import {Button} from '@mui/material';
import {FiUserX} from 'react-icons/fi';
import {ButtonProps} from '@mui/material/Button/Button';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import ConfirmationDialog from '../../../../@core/core/ConfirmationDialog';

interface RejectButtonProps extends ButtonProps {
  rejectAction: (itemId: any) => void;
  rejectTitle: string;
  className?: string;
  itemId?: any;
}

const RejectButton: React.FC<RejectButtonProps> = ({
  rejectAction,
  rejectTitle,
  className,
  itemId,
  ...extra
}) => {
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);

  const onConfirm = useCallback(() => {
    rejectAction(itemId);
    setRejectDialogOpen(false);
  }, [setRejectDialogOpen]);

  const onDeny = useCallback(() => {
    setRejectDialogOpen(false);
  }, []);

  return (
    <>
      <Tooltip title={<IntlMessages id='applicationManagement.reject' />}>
        <Button
          startIcon={<FiUserX style={{marginLeft: '5px'}} />}
          onClick={() => setRejectDialogOpen(true)}
          sx={extra?.color && {color: 'error.main'}}
          color={'error'}
          {...extra}>
          {<IntlMessages id='applicationManagement.reject' />}
        </Button>
      </Tooltip>

      {isRejectDialogOpen ? (
        <ConfirmationDialog
          open={isRejectDialogOpen}
          onDeny={onDeny}
          onConfirm={onConfirm}
          title={rejectTitle}
          dialogTitle={
            <IntlMessages id='applicationManagement.rejectApplication' />
          }
        />
      ) : null}
    </>
  );
};

export default React.memo(RejectButton);
