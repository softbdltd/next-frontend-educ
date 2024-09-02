import React, {FC} from 'react';
import {Typography} from '@mui/material';

interface TextPrimaryProps {
  text: React.ReactNode | string;
}

const TextPrimary: FC<TextPrimaryProps> = ({text}) => {
  return <Typography tabIndex={0} sx={{color: 'primary.main'}}>{text}</Typography>;
};

export default TextPrimary;
