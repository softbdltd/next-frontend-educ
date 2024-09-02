import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import {
  IGridColDef,
  IGridFilter,
} from '../../../shared/Interface/common.interface';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface SelectCustomFilterFieldProps {
  column: IGridColDef;
  filter: IGridFilter;
  value?: string | Array<string>;
  onChange: (key: string, value: any) => void;
}

const SelectCustomFilterField = ({
  column,
  filter,
  value,
  onChange: onChangeCallback,
}: SelectCustomFilterFieldProps) => {
  const [selected, setSelected] = useState<any>(filter.multiSelect ? [] : '');

  useEffect(() => {
    if (value && filter.options) {
      if (filter.multiSelect) {
        if (!Array.isArray(value)) {
          value = [value];
        }
        let selectedValue = (filter.options || []).filter((item: any) =>
          (value || []).includes(String(item[filter.valueFieldName])),
        );
        setSelected(selectedValue);
      } else {
        setSelected(value);
      }
    }
  }, [value, filter.options]);

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

  return (
    <Autocomplete
      multiple={filter.multiSelect}
      id='checkboxes-tags-demo'
      limitTags={1}
      size={'small'}
      className={'filterAutoComplete'}
      options={filter.options || []}
      value={selected}
      disableCloseOnSelect={filter.multiSelect}
      onChange={(event, option) => {
        let value;
        if (filter.multiSelect) {
          value = option
            ? option.map((op: any) => op[filter.valueFieldName])
            : [];
        } else {
          value = option ? option[filter.valueFieldName] : '';
        }
        setSelected(value);
        onChangeCallback(
          column.filterKey ? column.filterKey : column.field,
          value,
        );
      }}
      isOptionEqualToValue={(option: any, value: any) => {
        return option[filter.valueFieldName] === value[filter.valueFieldName];
      }}
      getOptionLabel={(item) => {
        if (typeof item !== 'object' && filter.options)
          item = filter.options.find(
            (it: any) => String(it[filter.valueFieldName]) === String(item),
          );

        return getTitle(item, filter.labelFieldNames);
      }}
      renderOption={(props, option, {selected}) => (
        <li {...props} key={option[filter.valueFieldName]}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
            checkedIcon={<CheckBoxIcon fontSize='small' />}
            style={{marginRight: 8}}
            checked={selected}
          />
          {getTitle(option, filter.labelFieldNames)}
        </li>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField label={column.headerName} {...params} />
      )}
    />
  );
};

export default SelectCustomFilterField;
