import React from 'react';
import Box from '@mui/material/Box';
import {Button} from '@mui/material';
import {useRouter} from 'next/router';
import {educDomain} from '../common/constants';

const ErrorComponent = () => {
  const router = useRouter();

  return (
    <Box
      display='flex'
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      flex={1}>
      <img src={'/images/error.png'} alt='Error Info' />
      <Box component='h2' fontSize={30} mt={4}>
        Ah! Something went wrong.
      </Box>
      <Box fontSize={18} textAlign='center'>
        <Button
          size={'medium'}
          variant={'contained'}
          onClick={() => {
            router.reload();
          }}>
          Reload
        </Button>
        <Button
          size={'medium'}
          variant={'contained'}
          sx={{
            marginLeft: '10px',
          }}
          onClick={() => {
            router.push(educDomain());
          }}>
          Home
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorComponent;
