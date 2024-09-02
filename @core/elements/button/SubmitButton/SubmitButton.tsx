import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import React from 'react';
import {Button} from '@mui/material';
import {Save} from '@mui/icons-material';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';

interface Props {
  onClick?: () => void;
  className?: string;
  label?: string | MessageFormatElement[];
  isSubmitting?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode | false;
  type?: 'submit' | 'button';

  [x: string]: any;
}

const StyledButton = styled(Button)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    paddingTop: '5px !important',
    paddingBottom: '5px !important',
  },
}));

const SubmitButton = ({
  onClick,
  className,
  label,
  isSubmitting,
  isLoading,
  isDisable,
  startIcon,
  type = 'submit',
  ...rest
}: Props) => {
  const {messages} = useIntl();

  const btnText = label ? label : messages['common.done'];
  return isLoading ? (
    <ButtonSkeleton />
  ) : (
    <StyledButton
      startIcon={startIcon === false ? undefined : startIcon || <Save />}
      variant='contained'
      color='primary'
      onClick={onClick}
      className={className}
      type={type}
      disabled={isSubmitting}
      {...rest}>
      {btnText}
    </StyledButton>
  );
};

export default React.memo(SubmitButton);
