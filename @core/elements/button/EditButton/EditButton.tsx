import React from 'react';
import Button from '@mui/material/Button';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';
import Tooltip from '@mui/material/Tooltip';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {RiEditBoxFill} from 'react-icons/ri';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';

const StyledButton = styled(Button)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    paddingTop: '5px !important',
    paddingBottom: '5px !important',
  },
}));

interface Props extends ButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  color?: 'inherit' | 'primary' | 'secondary';
}

const EditButton = ({
  onClick,
  isLoading,
  className,
  variant = 'text',
  ...extra
}: Props) => {
  return isLoading ? (
    <ButtonSkeleton />
  ) : (
    <Tooltip title={<IntlMessages id='common.edit_btn' />}>
      <StyledButton
        startIcon={<RiEditBoxFill />}
        onClick={onClick}
        sx={extra?.color && {color: 'warning.main'}}
        className={className ? className : className}
        color={extra?.color || 'warning'}
        variant={variant}
        {...extra}>
        <IntlMessages id='common.edit_btn' />
      </StyledButton>
    </Tooltip>
  );
};

export default React.memo(EditButton);
