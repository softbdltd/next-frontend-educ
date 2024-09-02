import {Checkbox, FormControlLabel, Popover, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {ReactElement} from 'react';
import {TableInstance} from 'react-table';
import {IColumnInstance} from '../../../shared/Interface/common.interface';

const PREFIX = 'ColumnHidePage';

const classes = {
  columnsPopOver: `${PREFIX}-columnsPopOver`,
  popoverTitle: `${PREFIX}-popoverTitle`,
  grid: `${PREFIX}-grid`,
};

const StyledPopover = styled(Popover)({
  padding: 24,
  [`& .${classes.columnsPopOver}`]: {
    padding: 24,
  },
  [`& .${classes.popoverTitle}`]: {
    fontWeight: 500,
    padding: '0 24px 24px 0',
    textTransform: 'uppercase',
  },
  [`& .${classes.grid}`]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 198px)',
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(1, 160px)',
    },
    gridColumnGap: 6,
    gridRowGap: 6,
  },
});

type ColumnHidePage<T extends object> = {
  instance: TableInstance<T>;
  anchorEl?: Element;
  onClose: () => void;
  show: boolean;
};

const id = 'popover-column-hide';

export function ColumnHidePage<T extends object>({
  instance,
  anchorEl,
  onClose,
  show,
}: ColumnHidePage<T>): ReactElement | null {
  const {allColumns, toggleHideColumn} = instance;
  const hideableColumns = allColumns.filter(
    (column: any) =>
      !(column.id === '_selector') && column?.toggleVisibilityFeature !== false,
  );

  const checkedCount = hideableColumns.reduce(
    (acc, val) => acc + (val.isVisible ? 0 : 1),
    0,
  );

  const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length;

  return hideableColumns.length > 1 ? (
    <StyledPopover
      anchorEl={anchorEl}
      id={id}
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
        <Typography className={classes.popoverTitle}>
          Visible Columns
        </Typography>
        <div className={classes.grid}>
          {hideableColumns.map((column: any | IColumnInstance<any>) => {
            return column.permanentVisible ? (
              <></>
            ) : (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    value={`${column.id}`}
                    disabled={column.isVisible && onlyOneOptionLeft}
                  />
                }
                label={column.render('Header') as string}
                checked={column.isVisible}
                onChange={() => toggleHideColumn(column.id, column.isVisible)}
              />
            );
          })}
        </div>
      </div>
    </StyledPopover>
  ) : null;
}
