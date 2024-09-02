import React from 'react';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import {Autocomplete, Chip, FormControl, TextField} from '@mui/material';
import {Controller} from 'react-hook-form';
import IntlMessages from '../../../../../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import TextInputSkeleton from '../../../../../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton';

type Props = {
  id: string;
  isLoading?: boolean;
  label?: string | MessageFormatElement[];
  size?: any;
  required?: boolean;
  control: any;
  options?: Array<any>;
  errorInstance?: any;
  defaultValue?: number | Array<string>;
  optionTitleProp?: Array<string>;
  onChange?: (e: any) => any;
  isDisabled?: boolean;
};

const CustomAddFilterableFormSelect = ({
  id,
  isLoading,
  label,
  size,
  required = false,
  isDisabled = false,
  control,
  errorInstance,
  onChange: onChangeCallback,
  defaultValue,
  options,
  optionTitleProp,
}: Props) => {
  const {messages} = useIntl();

  const getLabel = (label: any, required: boolean) => {
    return (
      <>
        {label}
        {required && <span style={{color: '#dd4744'}}> *</span>}
      </>
    );
  };

  const getTitle = (
    option: any,
    optionTitleProp: Array<string> | undefined,
  ) => {
    let title = '';
    if (typeof option == 'string' && !optionTitleProp) {
      return option;
    }
    if (option && optionTitleProp) {
      let arr = [];
      for (let i = 0; i < optionTitleProp.length; i++) {
        arr.push(option[optionTitleProp[i]]);
      }

      title = arr.join('-').split('').join('');
      title = title[0] == '-' ? title.slice(1) : title;
    }

    return title;
  };

  let errorObj = errorInstance?.[id];
  const reg = new RegExp('(.*)\\[(.*?)]', '');
  const matches = id.match(reg);
  if (matches) {
    errorObj = errorInstance?.[matches[1]]?.[matches[2]];
  }

  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <FormControl fullWidth={true}>
      <Controller
        render={({field: {ref, onChange, value = defaultValue}}) => (
          <Autocomplete
            ref={ref}
            multiple
            noOptionsText={messages['common.no_data_found']}
            value={value}
            options={options || []}
            freeSolo
            onChange={(event, selected) => {
              onChange(selected);
              if (onChangeCallback && typeof onChangeCallback === 'function') {
                onChangeCallback(selected);
              }
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                let label = option;
                if (label instanceof Object) {
                  label = getTitle(option, optionTitleProp);
                }

                return (
                  <React.Fragment key={index}>
                    <Chip
                      variant='filled'
                      label={label}
                      {...getTagProps({index})}
                    />
                  </React.Fragment>
                );
              })
            }
            getOptionLabel={(item) => {
              return getTitle(item, optionTitleProp);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={getLabel(label, required)}
                variant={'outlined'}
                size={size ? size : 'small'}
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
              />
            )}
          />
        )}
        name={id}
        control={control}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
};

export default CustomAddFilterableFormSelect;
