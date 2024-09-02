import React, {useRef} from 'react';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {Autocomplete, Box, FormControl, TextField} from '@mui/material';
import {Controller} from 'react-hook-form';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {getErrorObject} from '../../../utilities/helpers';
import {AddCircle} from '@mui/icons-material';

type Props = {
  id: string;
  isLoading: boolean;
  label?: string | MessageFormatElement[];
  size?: any;
  required?: boolean;
  control: any;
  options?: Array<any>;
  errorInstance?: any;
  defaultValue?: number | Array<string>;
  optionValueProp?: any;
  optionTitleProp?: Array<string>;
  onChange?: (e: any) => any;
  onFocus?: (e: any) => any;
  getOptionDisabled?: (e: any) => any;
  isDisabled?: boolean;
  isCreatable?: boolean;
  onCreateNew?: (value: string) => void;
  formattedLabel?: (item: any) => string;
};

const CustomFilterableFormSelect = ({
  id,
  isLoading,
  label,
  size,
  required = false,
  isDisabled = false,
  control,
  errorInstance,
  onChange: onChangeCallback,
  onFocus: onFocusCallback,
  defaultValue,
  options,
  optionValueProp,
  optionTitleProp,
  getOptionDisabled,
  isCreatable = false,
  onCreateNew,
  formattedLabel,
}: Props) => {
  const {messages} = useIntl();
  const textFieldValue = useRef<any>('');
  const getTitle = (
    option: any,
    optionTitleProp: Array<string> | undefined,
  ) => {
    let title = '';
    if (option && optionTitleProp) {
      let arr = [];
      for (let i = 0; i < optionTitleProp.length; i++) {
        if (option[optionTitleProp[i]]) arr.push(option[optionTitleProp[i]]);
      }
      title = arr.join(' - ');
    }

    return title;
  };

  const getLabel = (label: any, required: boolean) => {
    return (
      <>
        {label}
        {required && <span style={{color: '#dd4744'}}> *</span>}
      </>
    );
  };

  let errorObj = getErrorObject(id, errorInstance);

  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <FormControl fullWidth={true}>
      <Controller
        render={({field: {onChange, value = defaultValue}}) => (
          <Autocomplete
            value={value ? value : ''}
            onInputChange={(event, value, reason) => {
              textFieldValue.current = value;
            }}
            noOptionsText={
              <React.Fragment>
                {isCreatable && onCreateNew ? (
                  <Box
                    sx={{
                      marginBottom: '5px',
                      display: 'flex',
                      cursor: 'pointer',
                      padding: '10px 0px',
                      '&:hover': {backgroundColor: '#f8f8f8'},
                    }}
                    onClick={() => {
                      if (textFieldValue.current && onCreateNew)
                        onCreateNew(textFieldValue.current);
                    }}>
                    <AddCircle sx={{marginRight: '5px', color: 'blue'}} />
                    {messages['common.add']}
                  </Box>
                ) : (
                  messages['common.no_data_found']
                )}
              </React.Fragment>
            }
            autoSelect={false}
            selectOnFocus={false}
            options={options || []}
            disabled={isDisabled}
            onFocus={(event) => {
              event.preventDefault();
              if (onFocusCallback && typeof onFocusCallback === 'function') {
                onFocusCallback(event);
              }
            }}
            onChange={(event, selected) => {
              const value = selected ? selected[optionValueProp] : '';

              onChange(value);
              if (onChangeCallback && typeof onChangeCallback === 'function') {
                onChangeCallback(value);
              }
            }}
            getOptionLabel={(item) => {
              if (typeof item !== 'object' && options)
                item = options.find(
                  (it: any) => String(it[optionValueProp]) === String(item),
                );

              return formattedLabel && typeof formattedLabel == 'function'
                ? formattedLabel(item)
                : getTitle(item, optionTitleProp);
            }}
            getOptionDisabled={getOptionDisabled}
            isOptionEqualToValue={(option: any, value: any) => {
              return String(option[optionValueProp]) === String(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={getLabel(label, required)}
                name={id}
                title={label as string}
                variant={'outlined'}
                size={size ? size : 'small'}
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
            )}
          />
        )}
        name={id}
        control={control}
      />
    </FormControl>
  );
};

export default CustomFilterableFormSelect;
