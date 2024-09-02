import React from 'react';
import {Card, Skeleton, Stack} from '@mui/material';

interface CardWithImageSkeletonProps {
  imageHeight?: string;
}

const CardWithImageSkeleton = ({
  imageHeight = '90px',
}: CardWithImageSkeletonProps) => {
  return (
    <Card>
      <Stack spacing={1} p={'10px'}>
        <Skeleton
          animation='wave'
          variant='rectangular'
          sx={{width: '100%', height: imageHeight, borderRadius: '10px'}}
        />
        <Skeleton
          animation='wave'
          variant='rectangular'
          sx={{width: '80%', height: '0.9rem'}}
        />
        <Skeleton
          animation='wave'
          variant='rectangular'
          sx={{width: '80%', height: '1.5rem'}}
        />
      </Stack>
    </Card>
  );
};

export default CardWithImageSkeleton;
