import React from 'react';
import {Skeleton} from '@mui/material';

const HeaderSkeleton: any = () => {
  return (
    <>
      <Skeleton variant='text' height={100} style={{margin: '5px'}} />
    </>
  );
};

export default React.memo(HeaderSkeleton);
