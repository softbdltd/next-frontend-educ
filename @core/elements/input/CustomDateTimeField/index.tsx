import React from 'react';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {TextField} from '@mui/material';
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
  required?: boolean;
  register?: any;
  errorInstance?: any;
  defaultValue?: string;
  disabled?: boolean;
  inputProps?: any;
};

const CustomDateTimeField = ({
  id,
  label,
  className,
  variant,
  size,
  isLoading = false,
  required = false,
  register,
  errorInstance,
  defaultValue,
  disabled = false,
  inputProps = {},
}: Props) => {
  let errorObj = getErrorObject(id, errorInstance);
  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <TextField
      InputLabelProps={{
        shrink: true,
        required: required,
      }}
      fullWidth
      variant={variant ? variant : 'outlined'}
      size={size ? size : 'small'}
      id={id}
      name={id}
      className={className}
      label={label}
      title={label}
      type='date'
      defaultValue={defaultValue}
      inputProps={{
        ...{
          max: '9999-12-31',
          disabled: disabled,
        },
        ...inputProps,
      }}
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
      {...register(id)}
    />
  );
};

export default CustomDateTimeField;
