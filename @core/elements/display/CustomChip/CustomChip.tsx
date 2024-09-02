import React from 'react';
import {Chip} from '@mui/material';

type Props = {
  color: 'primary' | 'secondary' | 'default' | 'error' | 'success' | undefined;
  label: any;
  icon?: any;
  variant?: 'filled' | 'outlined';
  sx?: any;
};

const CustomChip = ({
  color = 'default',
  label,
  icon,
  variant = 'outlined',
  sx = {},
}: Props) => {
  return (
    <Chip
      icon={icon}
      size='small'
      tabIndex={0}
      color={color}
      label={label}
      variant={variant}
      sx={{padding: '15px', ...sx}}
    />
  );
};

export default React.memo(CustomChip);
