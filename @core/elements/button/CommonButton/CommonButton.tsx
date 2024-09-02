import React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import {ButtonProps} from '@mui/material/Button/Button';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';
import IntlMessages from '../../../../@core/utility/IntlMessages';

const PREFIX = 'CommonButton';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledButton = styled(Button)(({theme}) => {
  return {
    [`& .${classes.button}`]: {
      color: theme.palette.success.main,
    },
  };
});

interface Props extends ButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  color?: 'inherit' | 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium' | 'large';
  btnText?: string;
  extraText?: string;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const CommonButton = ({
  onClick,
  isLoading,
  className,
  variant = 'text',
  btnText,
  extraText,
  startIcon,
  size = 'small',
  fullWidth = false,
  ...extra
}: Props) => {
  const defaultHandler = () => {};
  /*  const language = getBrowserCookie(COOKIE_KEY_APP_CURRENT_LANG) || 'bn';
  let addedText = '';

  useEffect(() => {
    if (extraText) {
      if (language === 'bn') {
        addedText = convertEnglishDigitsToBengali(extraText);
      } else {
        addedText = extraText;
      }
    }
  }, [language, extraText]);*/

  return isLoading ? (
    <ButtonSkeleton />
  ) : (
    <StyledButton
      startIcon={startIcon}
      onClick={onClick || defaultHandler}
      className={extra?.color ? clsx(classes.button, className) : className}
      color={extra?.color || 'secondary'}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...extra}>
      <>
        <IntlMessages id={btnText} /> {extraText ?? ''}
      </>
    </StyledButton>
  );
};

export default React.memo(CommonButton);
