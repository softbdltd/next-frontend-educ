import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {FormHelperText} from '@mui/material';
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
};

const CustomDateTimePicker: any = (inputProps: Props) => {
  let errorObj = getErrorObject(inputProps.id, inputProps.errorInstance);

  return inputProps.isLoading ? (
    <TextInputSkeleton />
  ) : (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TextField
          id={inputProps.id}
          label={inputProps.label}
          title={inputProps.label}
          name={inputProps.id}
          type='datetime-local'
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
      {errorObj && errorObj.message ? (
        <FormHelperText sx={{color: 'error.main'}}>
          {errorObj.message.hasOwnProperty('key') ? (
            <IntlMessages
              id={errorObj.message.key}
              values={errorObj.message?.values || {}}
            />
          ) : (
            errorObj.message
          )}
        </FormHelperText>
      ) : (
        ''
      )}
    </>
  );
};
export default CustomDateTimePicker;
