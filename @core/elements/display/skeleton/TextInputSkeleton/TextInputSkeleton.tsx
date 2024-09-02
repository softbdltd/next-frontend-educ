import {Skeleton} from '@mui/material';
import React from 'react';

interface SkeletonProps {
  props: any;
}

const TextInputSkeleton = ({props}: SkeletonProps) => {
  return (
    <>
      <Skeleton variant='text' height={50} {...props} />
    </>
  );
};

export default React.memo((props: any) => <TextInputSkeleton props={props} />);
