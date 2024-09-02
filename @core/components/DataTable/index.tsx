import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  DataGrid,
  GridRenderCellParams,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import {useRouter} from 'next/router';
import {getCalculatedSerialNo, objectFilter} from '../../utilities/helpers';
import {FetchDataProps} from '../../hooks/useFetchTableData';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import {styled, Theme} from '@mui/material/styles';
import SelectFilterField from './SelectFilterField';
import TextFilterField from './TextFilterField';
import {
  DateRangeType,
  IGridColDef,
} from '../../../shared/Interface/common.interface';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import {GridSelectionModel} from '@mui/x-data-grid/models/gridSelectionModel';
import {GridCallbackDetails} from '@mui/x-data-grid/models/api';
import {useIntl} from 'react-intl';
import SelectCustomFilterField from './SelectCustonFilterField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DateTimeRangeFilterField from './DateTimeRangeFilterField';
import {useBreakPointDown} from '../../../@core/utility/Utils';

const PREFIX = 'DataTable';
const classes = {
  filterWrapper: `${PREFIX}-filterWrapper`,
  tableContainer: `${PREFIX}-tableContainer`,
  dataTable: `${PREFIX}-dataTable`,
  accrodion: `${PREFIX}-accrodion`,
  dateFieldValueRoot: `${PREFIX}-dateFieldValueRoot`,
  dateFieldRoot: `${PREFIX}-dateFieldRoot`,
};

const StyledBox = styled(Box)(({theme}): any => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexFlow: 'column',

  [`& .${classes.filterWrapper}`]: {
    maxWidth: '100%',
    minHeight: '45px',
    marginBottom: '55px',
    flex: '0 1 auto',
    '& .filterTextField': {
      width: '180px',
      marginBottom: '10px',
      marginRight: '10px',
      [`${theme.breakpoints.down('sm')}`]: {
        width: '100%',
        marginRight: '0px',
      },
    },
    '& .filterAutoComplete': {
      width: '260px',
      marginBottom: '10px',
      marginRight: '10px',
      display: 'inline-block',
      [`${theme.breakpoints.down('sm')}`]: {
        width: '100%',
        marginRight: '0px',
      },
      '& .MuiChip-root': {
        maxWidth: '120px',
        '& .MuiChip-label': {
          fontSize: '0.8rem',
        },
      },
    },
    [`& .${classes.accrodion}`]: {
      '& .accrodionSummary': {
        borderBottom: '1.5px solid #c1b7b7',
        width: '100%',
        height: '45px',
        minHeight: '45px',
      },
      '& .accrodionDetails': {
        padding: '10px',
      },
    },
    [`& .${classes.dateFieldValueRoot}`]: {
      marginBottom: '10px',
      width: '280px',
      marginRight: '10px',
      display: 'inline-block',
      [`${theme.breakpoints.down('sm')}`]: {
        width: '100%',
        marginRight: '0px',
      },
      ['& fieldset']: {
        width: '260px',
        display: 'inline-flex',
        justifyContent: 'space-between',
        border: '1px solid rgb(201 206 210)',
        borderRadius: '3px',
        marginTop: '-7px',
        padding: '0px 10px 2.5px 10px',
        marginLeft: '3px',
        [`${theme.breakpoints.down('sm')}`]: {
          width: 'calc(100% - 24px)',
        },
      },
    },
    [`& .${classes.dateFieldRoot}`]: {
      marginBottom: '10px',
      width: '280px',
      marginRight: '10px',
      display: 'inline-block',
      [`${theme.breakpoints.down('sm')}`]: {
        width: '100%',
        marginRight: '0px',
      },
      ['& .label-box']: {
        width: '260px',
        display: 'inline-flex',
        justifyContent: 'space-between',
        border: '1px solid rgb(201 206 210)',
        borderRadius: '3px',
        padding: '8.5px 10px 8.5px 12px',
        paddingTop: '2px',
        [`${theme.breakpoints.down('sm')}`]: {
          width: 'calc(100% - 22px)',
        },
      },
    },
  },
  [`& .${classes.tableContainer}`]: {
    width: '100%',
    flex: '1 1 auto',
    [`${theme.breakpoints.down('sm')}`]: {
      height: '445px',
    },
  },
  [`& .${classes.dataTable}`]: {
    [`& .MuiTablePagination-toolbar`]: {
      padding: '0',
    },
    [`${theme.breakpoints.down('md')}`]: {
      [`& .MuiDataGrid-row`]: {
        minHeight: '45px !important',
        maxHeight: '45px !important',
        ['& .MuiDataGrid-cell']: {
          minHeight: '45px !important',
          maxHeight: '45px !important',
        },
      },
    },
    [`${theme.breakpoints.down('sm')}`]: {
      [`& .MuiDataGrid-row`]: {
        minHeight: '40px !important',
        maxHeight: '40px !important',
        ['& .MuiDataGrid-cell']: {
          minHeight: '40px !important',
          maxHeight: '40px !important',
        },
      },
    },

    [`& .MuiDataGrid-columnHeaders`]: {
      ['& .MuiDataGrid-columnHeader:last-child']: {
        ['& .MuiDataGrid-columnSeparator']: {
          display: 'none',
        },
      },
    },
    [`& .MuiDataGrid-footerContainer`]: {
      minHeight: '40px',
      maxHeight: '40px',
    },
    [`& .MuiDataGrid-toolbarContainer`]: {
      ['& .grid-toolbar-column-button']: {
        [`${theme.breakpoints.down('md')}`]: {
          paddingTop: '0px !important',
          paddingBottom: '0px !important',
        },
      },
    },
  },
}));

interface DataTableProps {
  /**
   * @Required field
   * List of columns to render in data grid with type {IGridColDef}
   */
  columns: Array<IGridColDef>;
  /**
   * @Optional field
   * For additional filter field add and fetch data using these filters
   */
  additionalFilterFields?: (routeValue: any, onChange: any) => React.ReactNode;

  /**
   * /**
   * @Optional field
   * For postioning additional filter field
   */
  additionalFilterFieldsPosition?: 'start' | 'end';
  /**
   * @Optional field
   * Function to fetch data for server side data fetching
   */
  fetchData?: (params: FetchDataProps) => void;
  /**
   * If `true`, a loading overlay is displayed.
   */
  loading?: boolean;
  /**
   * If `true`, a reload data with all existing filter and criteria
   */
  toggleResetTable?: boolean;
  /**
   * If `true`, toolbar column button with column visibility feature will visible
   */
  showColumnToolbar?: boolean;
  /**
   * If `true`, toolbar density button will visible
   */
  showDensityToolbar?: boolean;
  /**
   * If `true`, toolbar export button will visible
   */
  showExportToolbar?: boolean;
  /**
   * Array of page sizes
   * @default value is [10, 25, 50, 100]
   */
  pageSizeData?: number[];
  /**
   * Total size of data while fetching server side data
   */
  totalCount?: number;
  /**
   * List of table data
   */
  data?: any[];
  /**
   * If `true`, grid multi selection will enable
   */
  gridMultiSelect?: boolean;
  /**
   * Table selected data item ids
   */
  selectedItemIds?: Array<string>;
  /**
   * If `true`, grid multi selection will enable
   */
  onGridSelectionChange?: (data: any) => void;
  /**
   * If `true`, route based pagination will be enabled
   */
  disableRoutePagination?: boolean;

  /**
   * If 'true', row serial number will be added.
   * */
  hideSerialColumn?: boolean;

  /**
   * If 'true', filter wrapper will be expanded, default value is true
   * */
  filterExpanded?: boolean;

  /**
   * If 'true', an extra button will enable, default value is false
   * */
  additionalButton?: any;

  /**
   * Give an object to filter on first time
   * */
  defaultFilters?: any;
}

interface PaginationProps {
  page: number;
  page_size: number;
}

const CustomToolbar = (
  showColumnVisibleTool: boolean,
  showDensityTool: boolean,
  showExportTool: boolean,
) => {
  return (
    <GridToolbarContainer
      sx={{
        padding: '10px',
        paddingRight: '0',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'absolute',
        top: `-55px`,
        right: '0px',
      }}>
      {showColumnVisibleTool && (
        <GridToolbarColumnsButton
          className='grid-toolbar-column-button'
          variant={'outlined'}
        />
      )}
      {showDensityTool && <GridToolbarDensitySelector />}
      {showExportTool && <GridToolbarExport />}
    </GridToolbarContainer>
  );
};

const DataTable = ({
  columns,
  additionalFilterFields,
  additionalFilterFieldsPosition = 'end',
  gridMultiSelect = false,
  fetchData,
  loading = false,
  toggleResetTable = false,
  showColumnToolbar = true,
  showDensityToolbar = false,
  showExportToolbar = false,
  pageSizeData = [10, 25, 50, 100],
  data = [],
  totalCount = data ? data.length : 0,
  selectedItemIds = [],
  onGridSelectionChange,
  disableRoutePagination = false,
  hideSerialColumn = false,
  filterExpanded = true,
  additionalButton = false,
  defaultFilters = {},
}: DataTableProps) => {
  const router = useRouter();
  const isBelowMd = useBreakPointDown('md');
  const {messages, locale} = useIntl();
  const [paginationParams, setPaginationParams] = useState<PaginationProps>({
    page: 0,
    page_size: 10,
  });
  const isServerSideTable = typeof fetchData !== 'undefined';
  let [sortBy, setSortBy] = useState<any>({});
  let [filters, setFilters] = useState<any>(
    defaultFilters && Object.keys(defaultFilters).length > 0
      ? defaultFilters
      : {},
  );
  //We will use server side data fetch always so no need of filter model
  //but will be used in future
  /*const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  setFilterModel((prev) => {
    let items = prev.items;
    let oldItem = items.find((item) => item.columnField == key);
    if (oldItem) {
      oldItem.value = value;
    } else {
      prev.items = [
        ...prev.items,
        {
          columnField: key,
          operatorValue: 'contains',
          value: value,
        },
      ];
    }
    return {...prev};
  });*/

  let filterableColumn = useMemo(
    () => columns.filter((col) => col.filterable),
    [columns],
  );

  useEffect(() => {
    try {
      if (!disableRoutePagination) {
        if (
          (router.query.page && Number(router.query.page as string)) ||
          (router.query.page_size && Number(router.query.page_size as string))
        ) {
          setPaginationParams({
            page: router.query.page ? Number(router.query.page) - 1 : 0,
            page_size: router.query.page_size
              ? Number(router.query.page_size)
              : 10,
          });
        }

        if (router.query.sort_field && router.query.sort_dir) {
          setSortBy({[`${router.query.sort_field}`]: router.query.sort_dir});
        }

        let keys = sessionStorage.getItem('filter_keys');
        let prevArr = keys ? JSON.parse(keys) : [];
        let routeFilters: any = {};
        prevArr.map((filterKey: string) => {
          routeFilters[filterKey] = router.query?.[filterKey];
        });
        if (
          Object.keys(routeFilters).length == 0 &&
          defaultFilters &&
          Object.keys(defaultFilters).length > 0
        ) {
          urlParamsUpdate(defaultFilters);
        }
        setFilters((prev: any) => objectFilter({...prev, ...routeFilters}));
      }
    } catch (error) {}
  }, [disableRoutePagination]);

  useEffect(() => {
    if (isServerSideTable) {
      fetchData({
        pageIndex: paginationParams.page,
        pageSize: paginationParams.page_size,
        sortBy: sortBy,
        filters: filters,
      });
    }
  }, [fetchData, paginationParams, sortBy, filters, toggleResetTable]);

  const urlParamsUpdate = (params: any) => {
    if (!disableRoutePagination) {
      router.replace(
        {
          pathname: router.pathname,
          query: objectFilter({...router.query, ...params}),
        },
        undefined,
        {shallow: true},
      );
    }
  };

  const handleSortModelChange = useCallback(
    (sortModel: GridSortModel) => {
      let sorts: any = {};
      if (sortModel.length > 0) {
        sorts[sortModel[0].field] = sortModel[0].sort;
        urlParamsUpdate({
          sort_field: sortModel[0].field,
          sort_dir: sortModel[0].sort,
        });
      } else {
        urlParamsUpdate({
          sort_field: '',
          sort_dir: '',
        });
      }
      setSortBy(sorts);
    },
    [router.query, disableRoutePagination],
  );

  const handleSelectionModelChange = useCallback(
    (selectionModel: GridSelectionModel, details: GridCallbackDetails) => {
      if (onGridSelectionChange) {
        onGridSelectionChange(selectionModel);
      }
    },
    [],
  );

  const onFilterChange = (filterObj: any) => {
    let allFilters = objectFilter({...filters, ...filterObj});
    if (!disableRoutePagination) {
      sessionStorage.setItem(
        'filter_keys',
        JSON.stringify(Object.keys(allFilters)),
      );
      urlParamsUpdate(filterObj);
    }
    setFilters(allFilters);
  };

  const onFilterTextFieldChange = useCallback(
    (key: string, value: string) => {
      let filterObj = {[key]: value};
      onFilterChange(filterObj);
    },
    [router.query, filters, disableRoutePagination],
  );

  const onFilterSelectFieldChange = useCallback(
    (key: string, value: any) => {
      let filterObj = {[key]: value};
      onFilterChange(filterObj);
    },
    [router.query, filters, disableRoutePagination],
  );

  const onFilterDateRangeFieldChange = useCallback(
    (key: DateRangeType, value: any) => {
      let filterObj = {
        [key.startDate]: value.startDate,
        [key.endDate]: value.endDate,
      };
      onFilterChange(filterObj);
    },
    [router.query, filters, disableRoutePagination],
  );

  const onFilterDateRangeFieldDelete = useCallback(
    (key: DateRangeType) => {
      let filterObj = {[key.startDate]: '', [key.endDate]: ''};
      onFilterChange(filterObj);
    },
    [router.query, filters, disableRoutePagination],
  );
  const onAdditionalFilterChange = (addiFilters: any) => {
    onFilterChange(addiFilters);
  };

  const gridColumns = useMemo((): IGridColDef[] => {
    return hideSerialColumn
      ? columns
      : [
          {
            headerName: '#',
            field: 'serial_id',
            width: isBelowMd ? 50 : 100,
            renderCell: (props: GridRenderCellParams) => {
              return getCalculatedSerialNo(
                props.api.getRowIndex(props.id),
                paginationParams.page,
                paginationParams.page_size,
                locale,
              );
            },
            hideable: true,
            sortable: false,
            filterable: false,
          },
          ...columns,
        ];
  }, [columns, paginationParams, hideSerialColumn, locale, isBelowMd]);

  return (
    <StyledBox>
      <Box
        className={classes.filterWrapper}
        sx={filterableColumn.length == 0 ? {minHeight: '0px !important'} : {}}>
        {(filterableColumn.length > 0 ||
          typeof additionalFilterFields !== 'undefined') && (
          <Accordion
            defaultExpanded={filterExpanded}
            className={classes.accrodion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              className={'accrodionSummary'}>
              <Typography>{messages['common.filters']}</Typography>
            </AccordionSummary>
            <AccordionDetails className={'accrodionDetails'}>
              <Box component={'div'} sx={{display: 'flex', flexWrap: 'wrap'}}>
                {typeof additionalFilterFields !== 'undefined' &&
                  additionalFilterFieldsPosition === 'start' &&
                  additionalFilterFields(
                    router.query,
                    onAdditionalFilterChange,
                  )}
                {filterableColumn.map((column, index) => {
                  return column.filter ? (
                    column.filter?.options ? (
                      <SelectCustomFilterField
                        key={index}
                        column={column}
                        filter={column.filter}
                        value={
                          router.query[
                            column.filterKey ? column.filterKey : column.field
                          ]
                        }
                        onChange={onFilterSelectFieldChange}
                      />
                    ) : (
                      <SelectFilterField
                        key={index}
                        column={column}
                        filter={column.filter}
                        value={
                          router.query[
                            column.filterKey ? column.filterKey : column.field
                          ]
                        }
                        onChange={onFilterSelectFieldChange}
                      />
                    )
                  ) : column.dateRangeFilter ? (
                    <DateTimeRangeFilterField
                      classes={classes}
                      key={index}
                      id={{
                        startDate: `${column.field}_start`,
                        endDate: `${column.field}_end`,
                      }}
                      label={column.headerName}
                      value={{
                        startDate: router.query[`${column.field}_start`] ?? '',
                        endDate: router.query[`${column.field}_end`] ?? '',
                      }}
                      onChange={onFilterDateRangeFieldChange}
                      onDelete={onFilterDateRangeFieldDelete}
                    />
                  ) : (
                    <TextFilterField
                      key={index}
                      id={column.field}
                      label={column.headerName}
                      filterKey={column.filterKey}
                      value={
                        router.query[
                          column.filterKey ? column.filterKey : column.field
                        ] ?? ''
                      }
                      onChange={onFilterTextFieldChange}
                    />
                  );
                })}
                {typeof additionalFilterFields !== 'undefined' &&
                  additionalFilterFieldsPosition === 'end' &&
                  additionalFilterFields(
                    router.query,
                    onAdditionalFilterChange,
                  )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
      <Box className={classes.tableContainer}>
        {additionalButton}
        <DataGrid
          headerHeight={45}
          className={classes.dataTable}
          rows={data || []}
          columns={gridColumns}
          loading={loading}
          selectionModel={selectedItemIds}
          onSelectionModelChange={handleSelectionModelChange}
          checkboxSelection={gridMultiSelect}
          initialState={{
            pagination: {
              pageSize: 25,
            },
          }}
          // filterMode={isServerSideTable ? 'server' : 'client'}
          // filterModel={filterModel}
          // onFilterModelChange={(model, details) => {
          //   console.log('model', model);
          // }}
          sortingMode={isServerSideTable ? 'server' : 'client'}
          onSortModelChange={handleSortModelChange}
          pagination
          paginationMode={isServerSideTable ? 'server' : 'client'}
          rowCount={totalCount}
          page={paginationParams.page}
          pageSize={paginationParams.page_size}
          rowsPerPageOptions={pageSizeData}
          onPageChange={(newPage) => {
            urlParamsUpdate({
              page: newPage + 1,
              page_size: paginationParams.page_size,
            });
            setPaginationParams((prev) => ({...prev, page: newPage}));
          }}
          onPageSizeChange={(newPageSize) => {
            urlParamsUpdate({page: 1, page_size: newPageSize});
            setPaginationParams((prev) => ({
              ...prev,
              page: 0,
              page_size: newPageSize,
            }));
          }}
          components={{
            Toolbar: () =>
              CustomToolbar(
                showColumnToolbar,
                showDensityToolbar,
                showExportToolbar,
              ),
            NoResultsOverlay: CustomNoRowsOverlay,
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          disableColumnMenu={true}
          localeText={{
            toolbarColumns: messages['common.column'],
            columnsPanelHideAllButton: messages['common.column_hide_all'],
            columnsPanelShowAllButton: messages['common.column_show_all'],
            columnsPanelTextFieldLabel: messages[
              'common.column_name'
            ] as string,
            columnsPanelTextFieldPlaceholder: messages[
              'common.column_name'
            ] as string,
          }}
          componentsProps={{
            panel: {
              sx: (theme: Theme) => {
                return {
                  [`${theme.breakpoints.down('md')}`]: {
                    width: '520px',
                    transform: 'translate(20px, 80px) !important',
                  },
                  [`${theme.breakpoints.down('sm')}`]: {
                    width: '320px',
                    transform: 'translate(20px, 80px) !important',
                  },
                  '& .MuiDataGrid-columnsPanel': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    maxWidth: '650px',
                    width: '100%',
                    '& .MuiDataGrid-columnsPanelRow': {
                      marginBottom: '10px',
                    },
                  },
                };
              },
            },
          }}
        />
      </Box>
    </StyledBox>
  );
};

export default DataTable;
