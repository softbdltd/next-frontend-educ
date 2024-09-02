import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {Box} from '@mui/material';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_INDUSTRY_ASSOCIATION_MEMBERS} from '../../../@core/common/apiRoutes';

const RunningExamListView = () => {
  const {messages, locale} = useIntl();

  const {
    onFetchData,
    data: memberList,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_INDUSTRY_ASSOCIATION_MEMBERS,
  });

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.company_name_bn'] as string,
        field: 'title',
        width: 250,
        filterable: false,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.company_name_en'] as string,
        field: 'title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['address.label'] as string,
        field: 'address',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.address_en'] as string,
        field: 'address_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
    ],
    [messages],
  );

  return (
    <Box sx={{height: '200px', padding: '15px'}}>
      <DataTable
        columns={columns}
        data={memberList || []}
        fetchData={onFetchData}
        showColumnToolbar={false}
        loading={loading}
        totalCount={totalCount}
        disableRoutePagination={true}
      />
    </Box>
  );
};

export default RunningExamListView;
