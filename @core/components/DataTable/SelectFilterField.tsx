import React, {useEffect, useState} from 'react';
import {Autocomplete, Skeleton, TextField} from '@mui/material';
import {
  IGridColDef,
  IGridFilter,
} from '../../../shared/Interface/common.interface';
import {useFetchSelectData} from '../../hooks/useFetchTablsSelectData';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RowStatus from '../../utilities/RowStatus';

interface SelectFilterFieldProps {
  column: IGridColDef;
  filter: IGridFilter;
  value?: string | Array<string>;
  onChange: (key: string, value: any) => void;
}

const SelectFilterField = ({
  column,
  filter,
  value,
  onChange: onChangeCallback,
}: SelectFilterFieldProps) => {
  const [params] = useState<any>({row_status: RowStatus.ACTIVE});
  const {data: options, isLoading} = useFetchSelectData(filter.apiPath, params);
  const [selected, setSelected] = useState<any>(filter.multiSelect ? [] : '');

  useEffect(() => {
    if (value && options) {
      if (filter.multiSelect) {
        if (!Array.isArray(value)) {
          value = [value];
        }
        let selectedValue = (options || []).filter((item: any) =>
          (value || []).includes(String(item[filter.valueFieldName])),
        );
        setSelected(selectedValue);
      } else {
        setSelected(value);
      }
    }
  }, [value, options, isLoading]);

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
      multiple={filter.multiSelect}
      id='checkboxes-tags-demo'
      limitTags={1}
      size={'small'}
      className={'filterAutoComplete'}
      options={options || []}
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
        if (typeof item !== 'object' && options)
          item = options.find(
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

export default SelectFilterField;
