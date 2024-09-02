import React from 'react';
import {Divider} from '@mui/material';

const HorizontalLine = () => {
  return (
    <Divider
      variant={'fullWidth'}
      light={true}
      tabIndex={-1}
      aria-hidden={true}
      sx={{
        marginLeft: '-16px',
        width: 'calc(100% + 32px)',
        marginTop: '15px',
        marginBottom: '15px',
      }}
    />
  );
};

export default HorizontalLine;
