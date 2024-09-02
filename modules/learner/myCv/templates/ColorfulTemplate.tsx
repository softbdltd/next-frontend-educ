import React, {FC} from 'react';
import {Container, Slide} from '@mui/material';

interface ColorfulTemplateProps {
  userData: any;
}

const ColorfulTemplate: FC<ColorfulTemplateProps> = ({userData}) => {
  return (
    <Slide direction={'right'} in={true}>
      <Container></Container>
    </Slide>
  );
};

export default ColorfulTemplate;
