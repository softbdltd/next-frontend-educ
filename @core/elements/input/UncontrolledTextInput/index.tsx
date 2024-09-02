import {FormHelperText, TextField} from '@mui/material';
import React from 'react';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {getErrorObject} from '../../../utilities/helpers';

type Props = {
  id: string;
  label?: string | MessageFormatElement[];
  className?: string;
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  isLoading?: boolean;
  register?: any;
  errorInstance?: any;
  multiline?: boolean;
  disabled?: boolean;
  rows?: number;
  type?: string;
  defaultValue?: string;
  inputProps?: any;
  helperText?: any;
  [x: string]: any;
  onInput?: any;
  placeholderHide?: boolean;
};

const UncontrolledTextInput = ({
  id,
  label,
  className,
  variant,
  size,
  isLoading,
  register,
  errorInstance,
  multiline,
  rows,
  type,
  defaultValue,
  inputProps,
  disabled,
  onInput: onChangeCallback,
  helperText,
  placeholderHide = false,
  ...rest
}: Props) => {
  let errorObj = getErrorObject(id, errorInstance);

  return isLoading ? (
    <TextInputSkeleton sx={{width: '100%'}} />
  ) : (
    <>
      <TextField
        fullWidth
        variant={variant ? variant : 'outlined'}
        size={size ? size : 'small'}
        id={id}
        className={className}
        label={label}
        title={label}
        sx={{
          '& input::placeholder': {
            opacity: placeholderHide ? 0 : 1,
          },
        }}
        multiline={multiline}
        rows={rows}
        type={type}
        error={errorObj && Boolean(errorObj)}
        helperText={
          errorObj && errorObj.message ? (
            errorObj.message.hasOwnProperty('key') ? (
              <span tabIndex={0}>
                <IntlMessages
                  id={errorObj.message.key}
                  values={errorObj.message?.values || {}}
                />
              </span>
            ) : (
              <span tabIndex={0}>{errorObj.message}</span>
            )
          ) : (
            ''
          )
        }
        onInput={(event: any) => {
          let value = type == 'file' ? event.target.files : event.target.value;
          if (onChangeCallback) {
            onChangeCallback(value);
          }
        }}
        defaultValue={defaultValue}
        disabled={disabled ? disabled : false}
        inputProps={{...inputProps, ...{required: false}}}
        {...register(id)}
        {...rest}
      />
      {helperText && (
        <FormHelperText sx={{color: 'primary.main'}}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
};

export default UncontrolledTextInput;
