import React from 'react';
import {Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../shared/constants/AppEnums';

const StyledTypography = styled(Typography)(({theme}) => ({
  // fontSize: '2.1rem !important',
  fontWeight: Fonts.BOLD,
  lineHeight: '42.19px',
  [theme.breakpoints.up('md')]: {
    // fontSize: '2.5rem !important',
  },
}));

interface SectionHeadingProps {
  title: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?: string;
  className?: string;
}

const SectionHeading = ({
  title,
  align = 'center',
  color = '#2C2C2C',
  className,
  ...rest
}: SectionHeadingProps) => {
  return (
    <StyledTypography
      align={align}
      className={className}
      color={color}
      tabIndex={0}
      {...rest}
      variant={'h3'}>
      {title}
    </StyledTypography>
  );
};

export default SectionHeading;
