import React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import {ButtonProps} from '@mui/material/Button/Button';
import clsx from 'clsx';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';

const PREFIX = 'ApproveButton';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledButton = styled(Button)(({theme}) => {
  return {
    [`&.${classes.button}`]: {
      color: theme.palette.secondary.main,
    },
  };
});

interface Props extends ButtonProps {
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

const ApproveButton = ({
  onClick,
  className,
  isLoading,
  children,
  ...extra
}: Props) => {
  return isLoading ? (
    <ButtonSkeleton />
  ) : (
    <StyledButton
      startIcon={<DoneIcon />}
      onClick={onClick}
      className={clsx(classes.button, className)}
      {...extra}>
      {children || <IntlMessages id='common.accept' />}
    </StyledButton>
  );
};

export default React.memo(ApproveButton);
