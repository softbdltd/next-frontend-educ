import {Button, Popover, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {FormEvent, ReactElement, useCallback} from 'react';
import {
  IColumnInstance,
  ITableInstance,
} from '../../../shared/Interface/common.interface';
import {TableInstance} from 'react-table';

const PREFIX = 'FilterPage';

const classes = {
  columnsPopOver: `${PREFIX}-columnsPopOver`,
  filterButton: `${PREFIX}-filterButton`,
  filtersResetButton: `${PREFIX}-filtersResetButton`,
  popoverTitle: `${PREFIX}-popoverTitle`,
  grid: `${PREFIX}-grid`,
  cell: `${PREFIX}-cell`,
};

const StyledPopover = styled(Popover)({
  [`& .${classes.columnsPopOver}`]: {
    padding: 24,
  },
  [`& .${classes.filterButton}`]: {
    position: 'absolute',
    top: 18,
    right: 100,
  },
  [`& .${classes.filtersResetButton}`]: {
    position: 'absolute',
    top: 18,
    right: 21,
  },
  [`& .${classes.popoverTitle}`]: {
    fontWeight: 500,
    padding: '0 24px 24px 0',
    textTransform: 'uppercase',
  },
  [`& .${classes.grid}`]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 218px)',
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(1, 180px)',
    },
    gridColumnGap: 24,
    gridRowGap: 24,
  },
  [`& .${classes.cell}`]: {
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'column',
  },
});

type FilterPage<T extends object> = {
  instance: ITableInstance<T> | TableInstance<T>;
  anchorEl?: Element;
  onClose: () => void;
  show: boolean;
};

export function FilterPage<T extends object>({
  instance,
  anchorEl,
  onClose,
  show,
}: FilterPage<T>): ReactElement {
  const {allColumns, setAllFilters} = instance as ITableInstance<any>;

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: any = new FormData(e.target as any);
    let filters = [];
    for (let [id, value] of form.entries()) {
      if (value) filters.push({id: id, value: value});
    }
    setAllFilters(filters);
    onClose();
  }, []);

  const resetFilters = useCallback(() => {
    setAllFilters([]);
  }, [setAllFilters]);
  return (
    <StyledPopover
      anchorEl={anchorEl}
      id={'popover-filters'}
      onClose={onClose}
      open={show}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
      <div className={classes.columnsPopOver}>
        <Typography className={classes.popoverTitle}>Filters</Typography>
        <form onSubmit={onSubmit}>
          <Button
            className={classes.filterButton}
            color='primary'
            type={'submit'}>
            Filter
          </Button>
          <Button
            className={classes.filtersResetButton}
            color='primary'
            onClick={resetFilters}>
            Reset
          </Button>
          <div className={classes.grid}>
            {(allColumns as Array<IColumnInstance<any>>)
              .filter((it) => it.canFilter)
              .map((column) => (
                <div key={column.id} className={classes.cell}>
                  {column.render('Filter')}
                </div>
              ))}
          </div>
        </form>
      </div>
    </StyledPopover>
  );
}
