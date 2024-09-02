import {CircularProgress} from '@mui/material';
import React, {forwardRef} from 'react';
import classNames from './../../utils/className';

export interface Props
  extends Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'type' | 'disabled'
  > {
  icon?: React.ComponentType<{className?: string}>;
  children?: React.ReactNode;
  loading?: boolean;
  type?:
    | 'primary'
    | 'secondary'
    | 'gray'
    | 'dark'
    | 'accented'
    | 'danger'
    | 'custom'
    | 'link'
    | 'link-light';
  buttonType?: 'button' | 'submit' | 'reset';
  round?: boolean;
  disabled?: boolean | 'soft';
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      type = 'primary',
      buttonType = 'button',
      icon: IconComponent,
      children,
      loading,
      disabled,
      className,
      onClick,
      round,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = !!disabled;

    return (
      <button
        ref={ref}
        type={buttonType}
        disabled={disabled !== 'soft' && (loading || isDisabled)}
        tabIndex={isDisabled ? -1 : tabIndex}
        onClick={loading || isDisabled ? undefined : onClick}
        className={classNames(
          'button-default',
          !type.startsWith('link') &&
            type !== 'custom' &&
            'button-not-link-not-custom',
          !type.startsWith('link') &&
            type !== 'custom' &&
            !round &&
            'button-not-link-not-custom-not-round',
          round && 'button-round',
          type === 'link' &&
            (isDisabled ? 'button-link-disabled' : 'button-link-active'),
          type === 'link-light' && 'button-link-light',
          type === 'danger' && 'button-danger',
          type === 'primary' &&
            (isDisabled ? 'button-primary-disable' : 'button-primary'),
          type === 'secondary' && 'button-sceondary',
          type === 'accented' && 'button-accented',
          type === 'gray' && 'button-gray',
          isDisabled && 'button-disabled',
          className,
        )}
        {...rest}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {IconComponent && (
              <IconComponent className={classNames('icon-style')} />
            )}
            {children}
          </>
        )}
      </button>
    );
  },
);

export default Button;
