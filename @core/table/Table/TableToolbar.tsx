import {Button, IconButton, Toolbar, Tooltip} from '@mui/material';
import {styled} from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnsIcon from '@mui/icons-material/ViewColumn';
import React, {
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import {TableInstance} from 'react-table';
import {ColumnHidePage} from './ColumnHidePage';
import {FilterPage} from './FilterPage';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';

const PREFIX = 'LabeledActionButton';

const classes = {
  leftButtons: `${PREFIX}-leftButtons`,
  rightButtons: `${PREFIX}-rightButtons`,
  leftIcons: `${PREFIX}-leftIcons`,
  rightIcons: `${PREFIX}-rightIcons`,
};

const StyledToolbar = styled(Toolbar)(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  height: '30px',
  minHeight: '30px',
  [theme.breakpoints.up('xs')]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  [`& .${classes.leftButtons}`]: {},
  [`& .${classes.rightButtons}`]: {},

  [`& .${classes.leftIcons}`]: {
    '&:first-of-type': {
      marginLeft: -12,
    },
  },

  [`& .${classes.rightIcons}`]: {
    padding: 12,
    marginTop: '-6px',
    width: 48,
    height: 48,
    '&:last-of-type': {
      marginRight: -12,
    },
  },
}));

export {};
type ActionButton<T extends object> = {
  icon?: JSX.Element;
  onClick: MouseEventHandler;
  enabled?: boolean;
  label: string;
  variant?: 'right' | 'left';
};

export const LabeledActionButton = <T extends object>({
  icon,
  onClick,
  label,
  enabled = true,
}: ActionButton<T>): ReactElement => {
  return (
    <Button
      variant='contained'
      color='primary'
      onClick={onClick}
      disabled={!enabled}>
      {icon}
      {label}
    </Button>
  );
};

export const SmallIconActionButton = <T extends object>({
  icon,
  onClick,
  label,
  enabled = true,
  variant,
}: ActionButton<T>) => {
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={clsx({
            [classes.rightIcons]: variant === 'right',
            [classes.leftIcons]: variant === 'left',
          })}
          onClick={onClick}
          disabled={!enabled}
          size='large'>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

type TableToolbar<T extends object> = {
  instance: TableInstance<T>;
  leftToolbarHtml?: any;
  loading?: boolean;
};

export function TableToolbar<T extends object>({
  instance,
  leftToolbarHtml = '',
  loading,
}: PropsWithChildren<TableToolbar<T>>): ReactElement | null {
  const {columns} = instance;

  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const hideableColumns = columns.filter(
    (column) => !(column.id === '_selector'),
  );

  const handleColumnsClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget);
      setColumnsOpen(true);
    },
    [setAnchorEl, setColumnsOpen],
  );

  const handleFilterClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget);
      setFilterOpen(true);
    },
    [setAnchorEl, setFilterOpen],
  );

  const handleClose = useCallback(() => {
    setColumnsOpen(false);
    setFilterOpen(false);
    setAnchorEl(undefined);
  }, []);

  // toolbar with add, edit, delete, filter/search column select.
  return (
    <StyledToolbar>
      <div className={classes.leftButtons}>{leftToolbarHtml}</div>
      <div className={classes.rightButtons}>
        <ColumnHidePage<T>
          instance={instance}
          onClose={handleClose}
          show={columnsOpen}
          anchorEl={anchorEl}
        />
        <FilterPage<T>
          instance={instance}
          onClose={handleClose}
          show={filterOpen}
          anchorEl={anchorEl}
        />
        {hideableColumns.length > 1 && (
          <SmallIconActionButton<T>
            icon={<ViewColumnsIcon />}
            onClick={handleColumnsClick}
            label='Show / hide columns'
            variant='right'
          />
        )}
        {loading && <CircularProgress className='loader' />}
        <SmallIconActionButton<T>
          icon={<FilterListIcon />}
          onClick={handleFilterClick}
          label='Filter by columns'
          variant='right'
        />
      </div>
    </StyledToolbar>
  );
}
