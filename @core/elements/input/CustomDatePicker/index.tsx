import React from 'react';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {Box, FormControl, IconButton, Stack, TextField} from '@mui/material';
import {Controller} from 'react-hook-form';
import {
  getErrorObject,
  getMomentDateFormatForDatePicker,
} from '../../../utilities/helpers';
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import ClearIcon from '@mui/icons-material/Clear';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';

type Props = {
  id: string;
  isLoading?: boolean;
  label?: string | MessageFormatElement[];
  size?: any;
  variant?: any;
  required?: boolean;
  control: any;
  errorInstance?: any;
  defaultValue?: string | null;
  onChange?: (e: any) => any;
  isDisabled?: boolean;
  format?: 'dd/MM/yyyy' | 'yyyy';
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate?: any;
  maxDate?: any;
  views?: Array<'day' | 'month' | 'year'>;
};

enum inputFormat {
  'dd/MM/yyyy' = 'YYYY-MM-DD',
  'yyyy' = 'YYYY',
}

const PREFIX = 'CustomDatePicker';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));

const CustomDatePicker = ({
  id,
  isLoading = false,
  label,
  size = 'small',
  variant = 'outlined',
  format = 'dd/MM/yyyy',
  required = false,
  isDisabled = false,
  control,
  errorInstance,
  onChange: onChangeCallback,
  defaultValue = null,
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
  views,
}: Props) => {
  let errorObj = getErrorObject(id, errorInstance);
  const {messages} = useIntl();
  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <StyledBox>
      <FormControl fullWidth={true}>
        <Controller
          render={({field: {ref, onChange, value = defaultValue}}) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3} sx={{marginBottom: 3}}>
                <DatePicker
                  disabled={isDisabled}
                  label={label}
                  ref={ref}
                  value={value}
                  views={views}
                  inputFormat={format}
                  disableFuture={disableFuture}
                  disablePast={disablePast}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(newValue) => {
                    let value = !Boolean(newValue)
                      ? null
                      : getMomentDateFormatForDatePicker(
                          newValue,
                          inputFormat[format],
                        );

                    onChange(value);
                    if (onChangeCallback) {
                      onChangeCallback(value);
                    }
                  }}
                  renderInput={(params) => (
                    <Box
                      component={'div'}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        gap: '4px',
                        position: 'relative',
                      }}>
                      <TextField
                        {...params}
                        name={id}
                        sx={{width: '100%'}}
                        placeholder={'hello'}
                        label={
                          <>
                            {label}
                            {required && (
                              <span className={classes.visuallyHidden}>
                                {messages['input.required_field']}
                              </span>
                            )}
                            {
                              <span className={classes.visuallyHidden}>
                                {messages['common.date_picker_format']}
                              </span>
                            }
                          </>
                        }
                        size={size}
                        variant={variant}
                        InputLabelProps={{
                          shrink: true,
                          required: required,
                        }}
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
                      />
                      {value ? (
                        <IconButton
                          size='medium'
                          sx={{
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            right: {xs: '0px', sm: '0px', md: '28px'},
                            top: {
                              md: '-3%',
                              lg: '1%',
                            },
                          }}
                          onClick={() => {
                            onChange(null);
                          }}>
                          <ClearIcon fontSize='inherit' />
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </Box>
                  )}
                />
              </Stack>
            </LocalizationProvider>
          )}
          name={id}
          control={control}
        />
      </FormControl>
    </StyledBox>
  );
};

export default CustomDatePicker;
