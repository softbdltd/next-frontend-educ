import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import clsx from 'clsx';
import {Chip} from '@mui/material';

const PREFIX = 'StatusChip';

const classes = {
  colorGray: `${PREFIX}-colorGray`,
  chipStyle: `${PREFIX}-chipStyle`,
};

const StyledChip = styled(Chip)(({theme}) => ({
  [`&.${classes.chipStyle}`]: {
    margin: '10px 10px 0px 0px',
    textTransform: 'capitalize',
    borderRadius: '15px',
  },
}));

interface TagChipProps {
  icon?: any;
  label?: string | ReactNode;
  className?: string;

  [x: string]: any;
}

const StatusChip = ({icon, label, className, ...props}: TagChipProps) => {
  return (
    <StyledChip
      className={clsx(classes.chipStyle, className)}
      icon={icon}
      label={label}
      {...props}
    />
  );
};

export default StatusChip;
