import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import {Save} from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import {styled} from '@mui/material/styles';
import React from 'react';
import {useIntl} from 'react-intl';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';

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

const StyledButton = styled(LoadingButton)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    paddingTop: '5px !important',
    paddingBottom: '5px !important',
  },
}));

const CustomLoadingButton = ({
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
      size='medium'
      loading={isSubmitting}
      loadingPosition='start'
      type={type}
      startIcon={<Save />}
      color='primary'
      variant='contained'
      {...rest}>
      <span>{btnText}</span>
    </StyledButton>
  );
};

export default React.memo(CustomLoadingButton);
