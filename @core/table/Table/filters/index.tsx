import {FilterValue, IdType, Row} from 'react-table';
import React, {useEffect} from 'react';
import {Button, InputLabel, MenuItem, TextField} from '@mui/material';
import {matchSorter} from 'match-sorter';
import {rowStatusArray} from '../../../utilities/RowStatus';
import {
  IFilterProps,
  ISelectFilterItem,
} from '../../../../shared/Interface/common.interface';

export function roundedMedian(values: any[]) {
  let min = values[0] || '';
  let max = values[0] || '';

  values.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
}

export function filterGreaterThan(
  rows: Array<Row<any>>,
  id: Array<IdType<any>>,
  filterValue: FilterValue,
) {
  return rows.filter((row) => {
    const rowValue = row.values[id[0]];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val: any) => typeof val !== 'number';

export function SelectAutoColumnFilter({
  column: {filterValue, render, setFilter, preFilteredRows, id},
}: IFilterProps<any>) {
  const options = React.useMemo(() => {
    const options: any = new Set();
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <TextField
      select
      label={render('Header')}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}>
      <MenuItem value={''}>All</MenuItem>
      {options.map((option: any, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

export function SelectBooleanMatchEnableDisableColumnFilter({
  column: {filterValue, render, setFilter, preFilteredRows, id},
}: IFilterProps<any>) {
  const options = ['Disable', 'Enable'];

  return (
    <TextField
      select
      label={render('Header')}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}>
      <MenuItem value={''}>All</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

export function SelectStringMatchEnableDisableColumnFilter({
  column: {filterValue, render, setFilter, preFilteredRows, id},
}: IFilterProps<any>) {
  const options = ['Disable', 'Enable'];

  return (
    <TextField
      select
      label={render('Header')}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}>
      <MenuItem value={''}>All</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

export const getMinMax = (rows: Row<any>[], id: IdType<any>) => {
  let min = rows.length ? rows[0].values[id] : 0;
  let max = rows.length ? rows[0].values[id] : 0;
  rows.forEach((row) => {
    min = Math.min(row.values[id], min);
    max = Math.max(row.values[id], max);
  });
  return [min, max];
};

export function SliderColumnFilter({
  column: {render, filterValue, setFilter, preFilteredRows, id},
}: IFilterProps<any>) {
  const [min, max] = React.useMemo(
    () => getMinMax(preFilteredRows, id),
    [id, preFilteredRows],
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}>
      <TextField
        name={id}
        label={render('Header')}
        type='range'
        inputProps={{
          min,
          max,
        }}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <Button
        variant='outlined'
        style={{width: 60, height: 36}}
        onClick={() => setFilter(undefined)}>
        Off
      </Button>
    </div>
  );
}

export const useActiveElement = () => {
  const [active, setActive] = React.useState(document.activeElement);

  const handleFocusIn = () => {
    setActive(document.activeElement);
  };

  React.useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return active;
};

export function NumberRangeColumnFilter({
  column: {filterValue = [], render, preFilteredRows, setFilter, id},
}: IFilterProps<any>) {
  const [min, max] = React.useMemo(
    () => getMinMax(preFilteredRows, id),
    [id, preFilteredRows],
  );
  const focusedElement = useActiveElement();
  const hasFocus =
    focusedElement &&
    (focusedElement.id === `${id}_1` || focusedElement.id === `${id}_2`);
  return (
    <>
      <InputLabel htmlFor={id} shrink focused={!!hasFocus}>
        {render('Header')}
      </InputLabel>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: 5,
        }}>
        <TextField
          id={`${id}_1`}
          value={filterValue[0] || ''}
          type='number'
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old: any[] = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <TextField
          id={`${id}_2`}
          value={filterValue[1] || ''}
          type='number'
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old: any[] = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
    </>
  );
}

export function fuzzyTextFilter<T extends object>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue,
) {
  console.log(rows);
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => row.values[id]],
  });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilter.autoRemove = (val: any) => !val;

const regex = /([=<>!]*)\s*((?:[0-9].?[0-9]*)+)/;

function parseValue(filterValue: FilterValue) {
  // eslint-disable-next-line eqeqeq
  const defaultComparator = (val: any) => val == filterValue;
  const tokens = regex.exec(filterValue);
  if (!tokens) {
    return defaultComparator;
  }
  switch (tokens[1]) {
    case '>':
      return (val: any) => parseFloat(val) > parseFloat(tokens[2]);
    case '<':
      return (val: any) => parseFloat(val) < parseFloat(tokens[2]);
    case '<=':
      return (val: any) => parseFloat(val) <= parseFloat(tokens[2]);
    case '>=':
      return (val: any) => parseFloat(val) >= parseFloat(tokens[2]);
    case '=':
      return (val: any) => parseFloat(val) === parseFloat(tokens[2]);
    case '!':
      return (val: any) => parseFloat(val) !== parseFloat(tokens[2]);
  }
  return defaultComparator;
}

export function numericTextFilter<T extends object>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue,
) {
  const comparator = parseValue(filterValue);
  return rows.filter((row) => comparator(row.values[id[0]]));
}

export function rowStatusFilter<T extends object>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue,
) {
  return rows.filter((row) => filterValue == row.values[id[0]]);
}

export function selectFilter<T extends object>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue,
) {
  return rows.filter((row) => filterValue == row.values[id[0]]);
}

export function dateTimeFilter<T extends object>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue,
) {
  /*  console.log('rowsrows: ', rows);
  console.log('id: ', id);
  console.log('filterValue: ', filterValue);*/
  return rows.filter((row) => filterValue == row.values[id[0]]);
}

// Let the table remove the filter if the string is empty
numericTextFilter.autoRemove = (val: any) => !val;

export function DefaultColumnFilter<T extends object>({
  column: {
    id,
    filterValue,
    setFilter,
    render,
    parent,
    filter,
    selectFilterItems,
  },
}: IFilterProps<T>) {
  const [value, setValue] = React.useState(filterValue || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '');
  }, [filterValue]);

  /*const firstIndex = !parent;*/

  if (filter === 'rowStatusFilter') {
    return (
      <TextField
        name={id}
        select
        label={render('Header')}
        value={value}
        variant={'standard'}
        onChange={handleChange}>
        {rowStatusArray().map((option: any, i: any) => (
          <MenuItem key={i} value={option.key}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  } else if (filter === 'selectFilter') {
    return (
      <TextField
        name={id}
        select
        label={render('Header')}
        value={value}
        variant={'standard'}
        onChange={handleChange}>
        {(selectFilterItems || []).map((option: ISelectFilterItem, i: any) => (
          <MenuItem key={i} value={option.id}>
            {option.title}
          </MenuItem>
        ))}
      </TextField>
    );
  } else if (filter === 'dateTimeFilter') {
    return (
      <TextField
        InputLabelProps={{
          shrink: true,
        }}
        name={id}
        type={'date'}
        label={render('Header')}
        value={value}
        variant={'standard'}
        onChange={handleChange}
      />
    );
  } else
    return (
      <TextField
        name={id}
        label={render('Header')}
        value={value}
        variant={'standard'}
        onChange={handleChange}
      />
    );
}
