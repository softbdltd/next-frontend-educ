import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';

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
};

const CustomTimePicker: any = (inputProps: Props) => {
  return inputProps.isLoading ? (
    <TextInputSkeleton />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TextField
        id={inputProps.id}
        label={inputProps.label}
        type='time'
        defaultValue={inputProps.defaultValue}
        variant={inputProps.variant ? inputProps.variant : 'outlined'}
        size={inputProps.size ? inputProps.size : 'small'}
        className={inputProps.className}
        InputLabelProps={{
          shrink: true,
          required: inputProps.required || false,
        }}
        fullWidth
        {...inputProps.register(inputProps.id)}
      />
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
