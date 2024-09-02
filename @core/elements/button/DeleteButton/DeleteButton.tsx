import React, {useCallback, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import ConfirmationDialog from '../../../../@core/core/ConfirmationDialog';
import {Button} from '@mui/material';
import {FiTrash2} from 'react-icons/fi';
import {ButtonProps} from '@mui/material/Button/Button';

interface DeleteButtonProps extends ButtonProps {
  deleteAction: () => void;
  deleteTitle: string;
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  deleteAction,
  deleteTitle,
  className,
  ...extra
}) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onConfirm = useCallback(() => {
    deleteAction();
    setDeleteDialogOpen(false);
  }, [setDeleteDialogOpen, deleteAction]);

  const onDeny = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  return (
    <>
      <Tooltip title={<IntlMessages id='common.delete_btn' />}>
        <Button
          startIcon={<FiTrash2 />}
          onClick={() => setDeleteDialogOpen(true)}
          sx={extra?.color && {color: 'error.main'}}
          color={'error'}
          className={className}
          {...extra}>
          {<IntlMessages id='common.delete_btn' />}
        </Button>
      </Tooltip>
      {isDeleteDialogOpen ? (
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onDeny={onDeny}
          onConfirm={onConfirm}
          title={deleteTitle}
          dialogTitle={<IntlMessages id='common.deleteItem' />}
        />
      ) : null}
    </>
  );
};

export default React.memo(DeleteButton);
