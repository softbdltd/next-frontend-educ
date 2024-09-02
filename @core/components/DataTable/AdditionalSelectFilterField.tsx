import React, {useEffect, useState} from 'react';
import {Autocomplete, Skeleton, TextField} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';

interface AdditionalSelectFilterFieldProps {
  id: string;
  label?: string | MessageFormatElement[];
  isLoading: boolean;
  options?: Array<any>;
  valueFieldName: any;
  labelFieldNames?: Array<string>;
  multiSelect?: boolean;
  onChange: (value: any) => void;
  value?: string | Array<string>;
}

const AdditionalSelectFilterField = ({
  id,
  label,
  isLoading,
  options = [],
  labelFieldNames,
  valueFieldName,
  multiSelect,
  value,
  onChange: onChangeCallback,
}: AdditionalSelectFilterFieldProps) => {
  const [selected, setSelected] = useState<any>('');

  useEffect(() => {
    if (value && options && options.length) {
      if (multiSelect) {
        if (!Array.isArray(value)) {
          value = [value];
        }
        let selectedValue = (options || []).filter((item: any) =>
          (value || []).includes(String(item[valueFieldName])),
        );
        setSelected(selectedValue);
      } else {
        setSelected(value);
      }
    } else {
      setSelected(multiSelect ? [] : '');
    }
  }, [value, options]);

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

  return isLoading ? (
    <Skeleton
      variant='text'
      height={50}
      sx={{
        width: '260px',
        marginBottom: '10px',
        marginRight: '10px',
        display: 'inline-flex',
        height: '70px',
        verticalAlign: 'top',
        marginTop: '-15px',
      }}
    />
  ) : (
    <Autocomplete
      multiple={multiSelect}
      id={id}
      limitTags={1}
      size={'small'}
      className={'filterAutoComplete'}
      options={options || []}
      value={selected}
      disableCloseOnSelect={multiSelect}
      onChange={(event, option) => {
        let value;
        if (multiSelect) {
          value = option ? option.map((op: any) => op[valueFieldName]) : [];
        } else {
          value = option ? option[valueFieldName] : '';
        }
        setSelected(value);
        onChangeCallback(value);
      }}
      isOptionEqualToValue={(option: any, value: any) => {
        return option[valueFieldName] === value[valueFieldName];
      }}
      getOptionLabel={(item) => {
        if (typeof item !== 'object' && options)
          item = options.find(
            (it: any) => String(it[valueFieldName]) === String(item),
          );

        return getTitle(item, labelFieldNames);
      }}
      renderOption={(props, option, {selected}) => (
        <li {...props} key={option[valueFieldName]}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
            checkedIcon={<CheckBoxIcon fontSize='small' />}
            style={{marginRight: 8}}
            checked={selected}
          />
          {getTitle(option, labelFieldNames)}
        </li>
      )}
      fullWidth
      renderInput={(params) => <TextField label={label} {...params} />}
    />
  );
};

export default AdditionalSelectFilterField;
