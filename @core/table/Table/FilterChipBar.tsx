import {Chip} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {useCallback} from 'react';
import {FilterValue, IdType} from 'react-table';
import {getRowStatusLabel} from '../../utilities/RowStatus';
import {ThemeMode} from '../../../shared/constants/AppEnums';
import {
  IColumnInstance,
  IFilters,
  ISelectFilterItem,
  ITableInstance,
} from '../../../shared/Interface/common.interface';

const PREFIX = 'FilterChipBar';

const classes = {
  filtersActiveLabel: `${PREFIX}-filtersActiveLabel`,
  chipZone: `${PREFIX}-chipZone`,
  chipLabel: `${PREFIX}-chipLabel`,
  filterChip: `${PREFIX}-filterChip`,
};

const Root = styled('div')(({theme}): any => ({
  padding: '18px 0 5px 10px',
  width: '100%',

  [`& .${classes.filtersActiveLabel}`]: {
    color: theme.palette.mode === ThemeMode.DARK ? '#FFF' : '#998',
    fontSize: '.87rem',
    paddingRight: 10,
  },

  [`& .${classes.chipLabel}`]: {
    fontWeight: 500,
    marginRight: 5,
  },

  [`& .${classes.filterChip}`]: {
    marginRight: 4,
    color: theme.palette.mode === ThemeMode.DARK ? '#FFF' : '#222',
  },
}));

type FilterChipBar<T extends object> = {
  instance: any | ITableInstance<T>;
};

const getFilterValue = (
  column: IColumnInstance<any>,
  filterValue: FilterValue,
) => {
  switch (column.filter) {
    case 'between':
      const min = filterValue[0];
      const max = filterValue[1];
      return min ? (max ? `${min}-${max}` : `>=${min}`) : `<=${max}`;
    case 'rowStatusFilter':
      return getRowStatusLabel(filterValue);
    case 'selectFilter':
      let name;
      const data = (column.selectFilterItems || []).find(
        (item: ISelectFilterItem) => item.id == filterValue,
      );
      if (data) name = data.title;

      return name ?? filterValue;
  }

  return filterValue;
};

export function FilterChipBar<T extends object>({instance}: FilterChipBar<T>) {
  const {
    allColumns,
    setFilter,
    state: {filters},
  } = instance;
  const handleDelete = useCallback(
    (id: string | number) => {
      setFilter(id as IdType<T>, undefined);
    },
    [setFilter],
  );

  return Object.keys(filters).length > 0 ? (
    <Root>
      <span className={classes.filtersActiveLabel}>Active filters:</span>
      {filters &&
        allColumns.map((column: any | IColumnInstance<any>) => {
          const filter = filters.find(
            (f: any | IFilters<any>) => f.id === column.id,
          );
          const value = filter && filter.value;
          return (
            value && (
              <Chip
                className={classes.filterChip}
                key={column.id}
                label={
                  <>
                    <span className={classes.chipLabel}>
                      {column.render('Header')}:{' '}
                    </span>
                    {getFilterValue(column, value)}
                  </>
                }
                onDelete={() => handleDelete(column.id)}
                variant='outlined'
              />
            )
          );
        })}
    </Root>
  ) : null;
}
