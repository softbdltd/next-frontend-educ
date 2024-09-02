import React from 'react';
import {Popover} from '@mui/material';
import AddButton from '../../button/AddButton/AddButton';
import EditButton from '../../button/EditButton/EditButton';
import DeleteButton from '../../button/DeleteButton/DeleteButton';
import DatatableButtonGroup from '../../button/DatatableButtonGroup/DatatableButtonGroup';
import {useIntl} from 'react-intl';

type Props = {
  id: string | undefined;
  open: boolean;
  anchorOrigin?: any;
  transformOrigin?: any;
  onClose: () => void;
};

const ActionPopUp = ({id, open, ...props}: Props) => {
  const {messages} = useIntl();
  return (
    <Popover
      id={id}
      open={open}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}>
      <DatatableButtonGroup>
        <AddButton onClick={() => alert('add')} />
        <EditButton onClick={() => alert('edit')} />
        <DeleteButton
          deleteAction={() => console.log('delete button')}
          deleteTitle={messages['common.delete_confirm'] as string}
        />
      </DatatableButtonGroup>
    </Popover>
  );
};

export default React.memo(ActionPopUp);
