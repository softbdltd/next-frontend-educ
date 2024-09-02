import React from 'react';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../common/apiRoutes';
import {Avatar} from '@mui/material';

interface AvatarImageViewProps {
  src: any;
  sx?: any;
  alt?: string;
  className?: string;
  variant?: any;
  title?: string;
  defaultImage?: string;
}

const AvatarImageView = ({
  src,
  sx,
  alt,
  className,
  variant,
  title,
  defaultImage = '/images/blank_image.png',
}: AvatarImageViewProps) => {
  const absoluteSrc = src ? FILE_SERVER_FILE_VIEW_ENDPOINT + src : defaultImage;

  return (
    <Avatar
      className={className}
      src={absoluteSrc}
      variant={variant}
      alt={alt ? alt : 'Image'}
      sx={sx}
      title={title ? title : 'Image'}
    />
  );
};

export default AvatarImageView;
