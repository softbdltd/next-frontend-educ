import React from 'react';
import {ButtonGroup} from '@mui/material';

interface Props {
  children: React.ReactNode;
}

const DatatableButtonGroup = ({children}: Props) => {
  return (
    <ButtonGroup
      variant='text'
      color='primary'
      aria-label='text primary button group'>
      {children}
    </ButtonGroup>
  );
};

export default React.memo(DatatableButtonGroup);
