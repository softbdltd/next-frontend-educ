import { Pagination, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { urlParamsUpdate } from '../../learner/learnerConstants';

const StyledPagination = styled(Pagination)(({theme}) => ({
  [`& .MuiPaginationItem-previousNext`]: {
    borderRadius: '16px',
    textAlign: 'center',
    background: '#E6F3EC',
    boxSizing: 'border-box',
    border: '1px solid rgba(4, 131, 64, 0.5)',
    transition:
      'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    [`& .MuiPaginationItem-icon`]: {
      fill: theme.palette.primary.main,
    },
  },
}));

interface PaginationComponentProps {
  setPaginationFilter?: (prev: any) => void;
  pageMetaData: {
    current_page: number;
    total_page: number;
    page_size: string;
    total: number;
    _response_status: {
      success: boolean;
      code: number;
      message: null | string;
      query_time: number;
    };
  };
  isRoutePagination?: boolean;
}

const PaginationComponent = ({
  setPaginationFilter,
  pageMetaData,
  isRoutePagination = false,
}: PaginationComponentProps) => {
  const router = useRouter();
  const handlePagination = (e: any, value: number) => {
    if (typeof setPaginationFilter === 'function') {
      setPaginationFilter((prev: any) => {
        return {
          ...prev,
          page: value,
        };
      });
    }

    if (isRoutePagination) {
      urlParamsUpdate(router, {
        ...router.query,
        page: value,
      });
    }
  };

  return (
    <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
      <StyledPagination
        count={pageMetaData?.total_page}
        page={Number(pageMetaData?.current_page)}
        color='primary'
        aria-label={'Pagination'}
        onChange={handlePagination}
      />
    </Stack>
  );
};

export default PaginationComponent;
