import React from 'react';
import {Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import Router from 'next/router';
interface Props {
  onClick: (selectedItemId?: number | null) => void;
}
function EditorHeader({onClick}: Props) {
  return (
    <div className='editor-header'>
      <div className='editor-header-inner'>
        <Button
          variant='outlined'
          sx={{
            backgroundColor: 'white',
            ':hover': {
              backgroundColor: '#c4c4c4',
              color: 'white',
              border: '0',
            },
          }}
          onClick={() => Router.back()}
          startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>

        <Button
          variant='outlined'
          sx={{
            backgroundColor: 'white',
            ':hover': {
              backgroundColor: '#c4c4c4',
              color: 'white',
              border: '0',
            },
          }}
          startIcon={<SaveIcon />}
          onClick={() => {
            onClick();
          }}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditorHeader;
