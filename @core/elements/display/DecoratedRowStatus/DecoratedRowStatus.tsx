import React from 'react';
import {useIntl} from 'react-intl';
import {Chip} from '@mui/material';

type Props = {
  rowStatus: string | number;
};

const DecoratedRowStatus = ({rowStatus}: Props) => {
  if (typeof rowStatus === 'string') {
    rowStatus = parseInt(rowStatus);
  }

  const {messages} = useIntl();

  return (
    <Chip
      variant='outlined'
      size='small'
      color={rowStatus === 0 ? 'default' : 'primary'}
      label={
        rowStatus === 0
          ? messages['common.inactive']
          : messages['common.active']
      }
    />
  );
};

export default React.memo(DecoratedRowStatus);
