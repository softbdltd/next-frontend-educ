import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import {FormControl} from '@mui/material';
import {Controller} from 'react-hook-form';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {getErrorObject} from '../../../@core/utilities/helpers';
import TextInputSkeleton from '../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton';
import Box from '@mui/material/Box';
import {AddCircle} from '@mui/icons-material';
import {useIntl} from 'react-intl';
import { styled } from "@mui/material/styles";

const PREFIX = 'CustomSelectAutocomplete';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledFormControl = styled(FormControl)(({theme}) => ({
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


const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;
type Props = {
  id: string;
  isLoading?: boolean;
  label?: string | MessageFormatElement[];
  size?: any;
  control: any;
  options?: Array<any>;
  optionTitleProp: Array<string>;
  optionValueProp: any;
  onChange?: (e: any) => any;
  isDisabled?: boolean;
  isCreateable?: boolean;
  defaultValue?: any;
  required?: boolean;
  errorInstance?: any;
  placeholder?: string;
  isCreatable?: boolean;
  onCreateNew?: (value: string) => void;
};
export default function CustomSelectAutoComplete({
  id,
  control,
  isDisabled,
  options,
  optionTitleProp,
  optionValueProp,
  label,
  isLoading,
  defaultValue = [],
  required = false,
  errorInstance,
  onChange: onChangeCallback,
  placeholder,
  isCreatable = false,
  onCreateNew,
}: Props) {
  const {messages} = useIntl();
  const textFieldValue = React.useRef<any>('');
  const getTitle = (
    option: any,
    optionTitleProp: Array<string> | undefined,
  ) => {
    let title = '';
    if (option && optionTitleProp) {
      let arr = [];
      for (let i = 0; i < optionTitleProp.length; i++) {
        if (option[optionTitleProp[i]]) {
          arr.push(option[optionTitleProp[i]]);
        }
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
        <span className={classes.visuallyHidden}>{messages['input.multiple']}</span>
        {required && (
          <span className={classes.visuallyHidden}>
                      {messages['input.required_field']}
          </span>
        )}
      </>
    );
  };

  const errorObj = getErrorObject(id, errorInstance);

  return isLoading ? (
    <TextInputSkeleton sx={{width: '100%'}} />
  ) : (
    <StyledFormControl
      variant='outlined'
      fullWidth={true}
      disabled={isDisabled}
      size='small'>
      <Controller
        control={control}
        name={id}
        render={({field: {onChange, value = defaultValue}}) => {
          return (
            <Autocomplete
              multiple
              id='checkboxes-tags-demo'
              size={'small'}
              options={options || []}
              disableCloseOnSelect
              value={value}
              onChange={(event, option) => {
                onChange(option);
                if (
                  onChangeCallback &&
                  typeof onChangeCallback === 'function'
                ) {
                  onChangeCallback(option);
                }
              }}
              onInputChange={(event, value, reason) => {
                textFieldValue.current = value;
              }}
              isOptionEqualToValue={(option: any, value: any) => {
                return option[optionValueProp] === value[optionValueProp];
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
              getOptionLabel={(item) => {
                if (typeof item !== 'object' && options)
                  item = options.find(
                    (it: any) => String(it[optionValueProp]) === String(item),
                  );

                return getTitle(item, optionTitleProp);
              }}
              renderOption={(props, option, {selected}) => (
                <li {...props} key={option[optionValueProp]}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{marginRight: 8}}
                    checked={selected}
                  />
                  {getTitle(option, optionTitleProp)}
                </li>
              )}
              fullWidth
              renderInput={(params) => (
                <TextField
                  // label={label}
                  label={getLabel(label, required)}
                  {...params}
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
          );
        }}
      />
    </StyledFormControl>
  );
}
