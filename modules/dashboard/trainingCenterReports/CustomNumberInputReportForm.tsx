import {FormHelperText, TextField} from '@mui/material';
import React from 'react';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {getErrorObject} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';

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
  setValue?: any;
};

const CustomTextInput = ({
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
  setValue,
  defaultValue,
  inputProps,
  disabled,
  onInput: onChangeCallback,
  helperText,
  ...rest
}: Props) => {
  let errorObj = getErrorObject(id, errorInstance);

  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <>
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        variant={variant ? variant : 'outlined'}
        type={'number'}
        size={size ? size : 'small'}
        id={id}
        className={className}
        label={label}
        multiline={multiline}
        rows={rows}
        error={errorObj && Boolean(errorObj)}
        helperText={
          errorObj && errorObj.message ? (
            errorObj.message.hasOwnProperty('key') ? (
              <IntlMessages
                id={errorObj.message.key}
                values={errorObj.message?.values || {}}
              />
            ) : (
              errorObj.message
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
        inputProps={{
          ...inputProps,
          ...{required: false},
          onBlur: (event: any) => {
            if (event.target.value == 0) {
              event.target.value = '0';
              setValue(id, 0);
            }
          },
          onFocus: (event: any) => {
            event.target.select();
          },
        }}
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

export default CustomTextInput;
