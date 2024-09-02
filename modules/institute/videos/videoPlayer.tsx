import {styled} from '@mui/material/styles';
import React from 'react';

const StyledIFrame = styled('iframe')(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    maxHeight: '280px',
  },
}));

const VideoPlayer = ({url}: any) => {
  return (
    <StyledIFrame
      width='100%'
      height='350'
      src={url}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
      title='Embedded youtube'
    />
  );
};

export default VideoPlayer;
