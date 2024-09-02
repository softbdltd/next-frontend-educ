import {Skeleton} from '@mui/material';
import React from 'react';

type Props = {
  isCircle?: boolean;
};

const ButtonSkeleton = ({isCircle}: Props) => {
  return (
    <>
      {isCircle ? (
        <Skeleton animation='wave' variant='circular' width={40} height={40} />
      ) : (
        <Skeleton animation='wave' variant='text' height={60} width={100} />
      )}
    </>
  );
};

export default React.memo(ButtonSkeleton);
