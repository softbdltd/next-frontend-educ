import {useCallback, useEffect, useState} from 'react';
import {useAsyncDebounce} from 'react-table';
import {apiGet} from '../common/api';
import useSWR from 'swr';

interface TUseFetchData {
  urlPath: string;
  paramsValueModifier?: (params: any) => any;
}

interface TReturnUseFetchData {
  onFetchData: (params: FetchDataProps) => void;
  data: Array<any> | any;
  loading: boolean;
  totalCount?: number;
}

export interface FetchDataProps {
  pageIndex: number;
  pageSize: number;
  sortBy: any;
  filters: any;
}

const useFetchTableData = ({
  urlPath,
  paramsValueModifier,
}: TUseFetchData): TReturnUseFetchData => {
  const [totalCount, setTotalCount] = useState<any>(0);

  const [params, setParams] = useState<any>({});
  const {data: tableData, error} = useSWR(
    params?.page && params?.page_size ? [urlPath, params] : null,
    (urlPath, params) => {
      return apiGet(urlPath, {params});
    },
  );

  const fetchDataFunction = useCallback(
    ({pageIndex, pageSize, sortBy, filters}: FetchDataProps) => {
      let _params: any = {
        page: pageIndex + 1,
        page_size: pageSize,
      };

      let filterKeys: Array<string> = filters ? Object.keys(filters) : [];
      if (filterKeys.length) {
        filterKeys.map((key) => {
          _params[key] = filters[key];
        });
      }

      let sortByKeys: Array<string> = sortBy ? Object.keys(sortBy) : [];
      if (sortByKeys.length) {
        let sorts: any = [];
        sortByKeys.map((key) => {
          sorts.push({
            column: key,
            direction: sortBy[key].toUpperCase(),
          });
        });
        if (sorts.length) {
          _params['order_by_columns'] = JSON.stringify(sorts);
        }
      }

      if (typeof paramsValueModifier === 'function') {
        let callbackResponse = paramsValueModifier({..._params});
        if (callbackResponse) {
          _params = callbackResponse;
        }
      }

      setParams(_params);
    },
    [paramsValueModifier],
  );

  useEffect(() => {
    if (tableData) {
      //console.log('table', tableData);
      setTotalCount(tableData.data?.total);
    }
  }, [tableData]);

  const onFetchData = useAsyncDebounce(fetchDataFunction);

  return <TReturnUseFetchData>{
    onFetchData,
    data: tableData?.data?.data || [],
    loading: !tableData && !error,
    totalCount,
  };
};

export default useFetchTableData;
