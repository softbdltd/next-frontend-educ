import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {ReactElement, useEffect} from 'react';
import {
  HeaderProps,
  Row,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';

import {FilterChipBar} from './FilterChipBar';
import {
  dateTimeFilter,
  DefaultColumnFilter,
  fuzzyTextFilter,
  numericTextFilter,
  rowStatusFilter,
  selectFilter,
} from './filters';
import {TableToolbar} from './TableToolbar';
import {TooltipCell} from './TooltipCell';
import {ThemeMode} from '../../../shared/constants/AppEnums';
import TableSkeleton from '../../elements/display/skeleton/TableSkeleton/TableSkeleton';
import AppTableContainer from '../../../@core/core/AppTableContainer';
import {useIntl} from 'react-intl';
import {AiOutlineInbox} from 'react-icons/ai';
import {camelToWords} from '../../utilities/helpers';
// import {ITableInstance} from '../../../shared/Interface/common.interface';

const PREFIX = 'ReactTable';

const classes = {
  tableRoot: `${PREFIX}-tableRoot`,
  tableCell: `${PREFIX}-tableCell`,
  tableRow: `${PREFIX}-tableRow`,
  tablePagination: `${PREFIX}-tablePagination`,
  noDataIcon: `${PREFIX}-noDataIcon`,
  noDataText: `${PREFIX}-noDataText`,
};

const StyledGrid = styled(Grid)(({theme}): any => ({
  [`& .${classes.tableRoot}`]: {
    borderCollapse: 'separate !important',
    borderSpacing: '0px 10px !important',
  },

  [`& .${classes.tableCell}`]: {
    fontSize: '1rem',
    border: 'none !important',
    padding: '10px',
    verticalAlign: 'middle',
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.grey['500']
        : theme.palette.grey['600'],
  },

  [`& .${classes.tableRow}`]: {
    boxShadow:
      theme.palette.mode === ThemeMode.DARK
        ? '0px 0px 10px 1px #222'
        : '0px 0px 10px 1px #e9e9e9',
  },

  [`& .${classes.tablePagination}`]: {
    display: 'flex',
    justifyContent: 'center',
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.grey['500']
        : theme.palette.grey['600'],
  },

  [`& .${classes.noDataIcon}`]: {
    color: theme.palette.mode === ThemeMode.DARK ? '#6c6c6c' : '#ddd',
  },

  [`& .${classes.noDataText}`]: {
    display: 'block',
    color: theme.palette.mode === ThemeMode.DARK ? '#7d7d7d' : '#a0a0a0',
  },
}));

export const range = (total: number, startFrom: number = 0): Array<number> => {
  let items: number[] = [];
  for (let i = startFrom; i <= total; i++) {
    items.push(i);
  }
  return items;
};

export const generatePageNumber = (
  pageIndex: number,
  totalPage: number,
  totalSlide: number = 5,
): Array<number> => {
  let startFrom =
    pageIndex === 1
      ? pageIndex
      : pageIndex === 2
      ? pageIndex - 1
      : pageIndex - 2;
  return totalPage === 0
    ? []
    : range(Math.min(totalSlide + startFrom, totalPage), startFrom);
};

const DefaultHeader: React.FC<HeaderProps<any>> = ({column}) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
);

const defaultColumn = {
  Filter: DefaultColumnFilter,
  Cell: TooltipCell,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
};

const hooks = [
  useColumnOrder,
  useFilters,
  useGroupBy,
  useSortBy,
  useExpanded,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
];

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
  rowStatusFilter: rowStatusFilter,
  selectFilter: selectFilter,
  dateTimeFilter: dateTimeFilter,
};

/**
 * @property {any} header - is the title of column
 * @property {string} accessor - is the key of data that needs to show in column
 * @property {boolean} disableFilters - is to disable filter option for column
 * @property {boolean} disableSortBy - is to disable sort option for column
 * @property {boolean} [isVisible] - is to change column's visibility in table (default value is true)
 * @property {boolean} [toggleVisibilityFeature] - is to change visibility feature of a column (default value is false)
 * @property {any} filter - is the name of filter type depends on filter value
 * @property {any} Cell - is to customize data representation of the column
 */
interface TReactTableColumns {
  Header: any;
  accessor: string;
  disableFilters: boolean;
  disableSortBy: boolean;
  isVisible: boolean;
  toggleVisibilityFeature: boolean;
  filter: 'any';
  Cell: 'any';
}

interface TReactTable {
  columns: Array<TReactTableColumns>;
  leftToolbarHtml?: string | React.ReactNode;
  fetchData?: any;
  pageCount?: number;
  skipPageResetRef?: boolean;
  skipDefaultFilter?: boolean;
  loading?: boolean;
  toggleResetTable: boolean;
  pageSize?: number;
  hideToolbar?: boolean;
  pageSizeData?: number[];
  totalCount?: number;
  data?: any[];

  [x: string]: any;
}

/**
 * @param columns
 * @param leftToolbarHtml
 * @param fetchData
 * @param controlledPageCount
 * @param skipPageResetRef
 * @param skipDefaultFilter
 * @param loading
 * @param toggleResetTable
 * @param controlledPageSize
 * @param hideToolbar
 * @param pageSizeData
 * @param data
 * @param totalCount
 * @param props
 * @constructor
 */
export default function ReactTable<T extends object>({
  columns,
  leftToolbarHtml = '',
  fetchData,
  pageCount: controlledPageCount,
  skipPageResetRef = typeof fetchData !== 'undefined',
  skipDefaultFilter = typeof fetchData !== 'undefined',
  loading = false,
  toggleResetTable = false,
  pageSize: controlledPageSize,
  hideToolbar = false,
  pageSizeData = [10, 15, 20, 25, 30],
  data,
  totalCount = data ? data.length : 0,
  ...props
}: TReactTable | any): ReactElement {
  const {messages} = useIntl();
  const isServerSideTable = typeof fetchData !== 'undefined';

  const clientSideOptions = {
    ...props,
    columns,
    data,
    initialState: {
      pageSize: pageSizeData[0],
      hiddenColumns: columns
        .filter((item: any) => item?.isVisible === false)
        .map((item: any) => item.accessor),
    },
    filterTypes,
    defaultColumn,
  };
  const serverSideOptions = {
    ...props,
    columns,
    data,
    //autoResetHiddenColumns: false, TODO this line commented because its effecting in hiddenColumns visibilities
    manualPagination: true,
    manualFilters: skipDefaultFilter,
    autoResetPage: !skipPageResetRef.current,
    autoResetExpanded: !skipPageResetRef.current,
    autoResetGroupBy: !skipPageResetRef.current,
    autoResetSelectedRows: !skipPageResetRef.current,
    autoResetSortBy: !skipPageResetRef.current,
    autoResetFilters: !skipPageResetRef.current,
    autoResetRowState: !skipPageResetRef.current,
    manualGlobalFilter: true,
    manualExpandedKey: true,
    manualGroupBy: true,
    manualSortBy: true,
    manualRowSelectedKey: true,
    pageCount: controlledPageCount,
    initialState: {
      pageSize: pageSizeData[0],
      hiddenColumns: columns
        .filter((item: any) => item?.isVisible === false)
        .map((item: any) => item.accessor),
    },
    filterTypes,
    defaultColumn,
    // stateReducer: (newState, action, prevState) => {
    //   console.log(prevState);
    //   return newState;
    // },
    useControlledState: (state: any) => {
      return React.useMemo(
        () => ({
          ...state,
        }),
        [state],
      );
    },
  };

  const instance = useTable<T>(
    isServerSideTable ? serverSideOptions : clientSideOptions,
    ...hooks,
  ) as any; //ITableInstance<any>; //
  // TODO: ^ fix ITableInstance to match TableInstance`

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    page,
    // setAllFilters, // to reset filter manually.
    prepareRow,
    state: {pageIndex, pageSize, sortBy, filters},
    gotoPage,
    setPageSize,
  } = instance;

  React.useEffect(() => {
    if (isServerSideTable) {
      fetchData({pageIndex, pageSize, sortBy, filters});
    }
  }, [fetchData, pageIndex, pageSize, sortBy, filters, toggleResetTable]);

  useEffect(() => {
    if (isServerSideTable) {
      if (page.length == 0 && !loading && pageIndex != 0) {
        gotoPage(pageIndex - 1);
      }
    }
  }, [page, loading, pageIndex]);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    gotoPage(0);
  };

  return (
    <StyledGrid container>
      <Grid item md={12}>
        {!hideToolbar && (
          <TableToolbar instance={instance} leftToolbarHtml={leftToolbarHtml} />
        )}
        {!hideToolbar && <FilterChipBar<T> instance={instance} />}
      </Grid>

      <Grid item md={12}>
        <AppTableContainer>
          <Table
            {...(getTableProps() as any)}
            size='small'
            aria-label='a dense table'
            className={classes.tableRoot}>
            <TableHead>
              {headerGroups.map((headerGroup: any, index: number) => (
                <TableRow key={index} className={classes.tableRow}>
                  {headerGroup.headers.map((column: any, index: number) => (
                    <TableCell
                      key={index}
                      className={classes.tableCell}
                      style={{
                        fontWeight: 'bold',
                        border: '1px solid rgba(224, 224, 224, 1)',
                      }}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            {loading ? (
              <TableSkeleton
                rowSize={pageSize}
                columnNumbers={headerGroups[0].headers.length}
              />
            ) : (
              <TableBody {...(getTableBodyProps() as any)}>
                {page.map((row: Row) => {
                  prepareRow(row);
                  return (
                    <TableRow key={row.id} className={classes.tableRow}>
                      {row.cells.map((cell, index) => {
                        return (
                          <TableCell
                            style={{
                              border: '1px solid rgba(224, 224, 224, 1)',
                              textAlign: 'left',
                            }}
                            key={index}
                            className={classes.tableCell}>
                            {cell.render('Cell', {
                              currentPageIndex: pageIndex,
                              currentPageSize: pageSize,
                            })}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {page.length == 0 && (
                  <TableRow key={0} className={classes.tableRow}>
                    <TableCell
                      style={{
                        border: '1px solid rgba(224, 224, 224, 1)',
                        textAlign: 'center',
                      }}
                      colSpan={columns?.length}
                      key={0}
                      className={classes.tableCell}>
                      <AiOutlineInbox
                        className={classes.noDataIcon}
                        size={'5em'}
                      />
                      <span className={classes.noDataText}>
                        {messages['common.no_data_found']}
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </AppTableContainer>
      </Grid>

      {page.length > 0 && (
        <Grid item md={12}>
          <TablePagination
            component='div'
            className={classes.tablePagination}
            rowsPerPageOptions={pageSizeData}
            count={totalCount}
            rowsPerPage={pageSize}
            page={pageIndex}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      )}
    </StyledGrid>
  );
}
