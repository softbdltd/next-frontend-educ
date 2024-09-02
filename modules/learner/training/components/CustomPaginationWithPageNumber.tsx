import {
  Box,
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
  Stack,
  TablePagination,
} from '@mui/material';
import React from 'react';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';

type IProps = {
  metaData: any;
  pageInfo: any;
  // queryPageNumber: number;
  onPaginationChange: (event: any, currentPage: number) => void;
  onRowsPerPageChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  rowsPerPage?: any;
};

const PREFIX = 'CustomPaginationWithPageNumber';

export const classes = {
  subHeader: `${PREFIX}-subHeader`,
  paginationBox: `${PREFIX}-paginationBox`,
};

export const StyledBox = styled(Box)(({theme}) => ({
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  [`& .${classes.paginationBox}`]: {
    display: 'flex',
  },
  '& .MuiTablePagination-displayedRows': {
    display: 'none',
  },
  '& .MuiTablePagination-actions': {
    display: 'none',
  },
  '& .MuiTablePagination-toolbar': {
    padding: '0px',
    '& .MuiInputBase-root': {
      marginRight: '5px',
    },
  },
  '& .MuiPagination-root': {
    marginTop: '10px',
  },
  [`& .MuiTablePagination-select`]: {
    border: '1px solid gray',
    padding: '3px 0px',
    borderRadius: '6px !important',
  },
}));

const CustomPaginationWithPageNumber = ({
  metaData,
  pageInfo,
  onPaginationChange,
  rowsPerPage,
  onRowsPerPageChange: onRowsPerPageChangeCallback,
}: IProps) => {
  const {messages, formatNumber} = useIntl();
  const labelRowsPerPage: any = messages['common.per_page'];
  const rowsPerPageOptions = [
    {value: 8, label: formatNumber(8)},
    {value: 10, label: formatNumber(10)},
    {value: 25, label: formatNumber(25)},
    {value: 50, label: formatNumber(50)},
    {value: 100, label: formatNumber(100)},
  ];

  return (
    <>
      {!(pageInfo?.page <= 1 && metaData && metaData.total == 0) && (
        <StyledBox>
          <Box className={classes.paginationBox}>
            <Stack direction='row' spacing={2}>
              {onRowsPerPageChangeCallback && (
                <TablePagination
                  component='span'
                  count={
                    metaData && metaData.total_page ? metaData.total_page : 1
                  }
                  page={0}
                  onPageChange={() => {}}
                  rowsPerPage={rowsPerPage || 8}
                  onRowsPerPageChange={onRowsPerPageChangeCallback}
                  labelRowsPerPage={labelRowsPerPage}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              )}

              <Pagination
                page={pageInfo && pageInfo.page ? Number(pageInfo.page) : 1}
                count={
                  metaData && metaData.total_page
                    ? Number(metaData?.total_page)
                    : 1
                }
                color={'primary'}
                shape='rounded'
                onChange={onPaginationChange}
                renderItem={(item: PaginationRenderItemParams) => {
                  const props = {
                    ...item,
                    page:
                      item.type == 'page' && item.page
                        ? formatNumber(item.page)
                        : item.page,
                  };
                  return <PaginationItem {...props} />;
                }}
              />
            </Stack>
          </Box>
        </StyledBox>
      )}
    </>
  );
};

export default CustomPaginationWithPageNumber;
