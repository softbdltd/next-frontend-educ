import React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import {ButtonProps} from '@mui/material/Button/Button';
import clsx from 'clsx';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';

const PREFIX = 'ReadButton';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledButton = styled(Button)(({theme}) => {
  return {
    [`&.${classes.button}`]: {
      color: theme.palette.primary.main,
    },
  };
});

interface Props extends ButtonProps {
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  startIcon?: any;
}

const ReadButton = ({
  onClick,
  className,
  isLoading,
  children,
  startIcon,
  ...extra
}: Props) => {
  return isLoading ? (
    <ButtonSkeleton />
  ) : (
    <StyledButton
      startIcon={startIcon ? startIcon : <Visibility />}
      onClick={onClick}
      className={clsx(classes.button, className)}
      {...extra}>
      {children || <IntlMessages id='common.read_btn' />}
    </StyledButton>
  );
};

export default React.memo(ReadButton);
