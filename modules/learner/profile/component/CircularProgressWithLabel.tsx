import React from 'react';
import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material';

function CircularProgressWithLabel(
  props: CircularProgressProps & {value: number; text: string},
) {
  return (
    <Box
      position='relative'
      display='inline-flex'
      sx={{border: '1px solid #eee', borderRadius: '50%'}}>
      <CircularProgress variant='determinate' {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'>
        <Typography
          variant='caption'
          color='textSecondary'>{`${props.text}%`}</Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabel;
