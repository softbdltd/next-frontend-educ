import React, {useCallback, useEffect, useState} from 'react';
import __ from 'lodash';
import {useAsyncDebounce} from 'react-table';
import {apiGet} from '../common/api';
import useSWR from 'swr';

export const countPaginatePage = (
  totalData: number,
  pageSize: number,
): number => {
  return totalData < 1 ? 0 : Math.ceil(totalData / pageSize);
};

interface TUseFetchData {
  urlPath: string;
  dataAccessor?: string;
  filters?: any;
  onError?: (e: any) => any;
  paramsValueModifier?: (params: any) => any;
}

interface TReturnUseFetchData {
  onFetchData: () => void;
  data: Array<any> | any;
  loading: boolean;
  pageCount: number;
  totalCount?: number;
}

const useReactTableFetchData = ({
  urlPath,
  dataAccessor,
  filters: mappedFilters,
  onError,
  paramsValueModifier,
}: TUseFetchData): TReturnUseFetchData => {
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = useState<any>(0);
  const [params, setParams] = useState<any>({});
  const {data: tableData, error} = useSWR(
    params?.page && params?.page_size ? [urlPath, params] : null,
    (urlPath, params) => {
      return apiGet(urlPath, {params});
    },
  );

  const fetchDataFunction = useCallback(
    ({pageIndex, pageSize, sortBy, filters}: any) => {
      let _params: any = {
        page: pageIndex + 1,
        page_size: pageSize,
      };

      let keyedFilters = __.keyBy(filters, (item) => item.id);
      if (
        typeof keyedFilters !== 'undefined' &&
        keyedFilters &&
        Object.keys(keyedFilters).length
      ) {
        Object.keys(keyedFilters).forEach((item) => {
          if (mappedFilters?.hasOwnProperty(item) && keyedFilters[item].value) {
            _params[mappedFilters[item]] = keyedFilters[item].value;
          } else if (keyedFilters[item].value) {
            _params[item] = keyedFilters[item].value;
          }
        });
      }

      if (typeof paramsValueModifier === 'function') {
        let callbackResponse = paramsValueModifier({..._params});
        if (callbackResponse) {
          _params = callbackResponse;
        }
      }

      setParams(_params);
    },
    [],
  );

  useEffect(() => {
    if (tableData) {
      // console.log('table', tableData);
      setTotalCount(tableData.data?.total);
      setPageCount(countPaginatePage(tableData.data?.total, params?.page_size));
    }
  }, [tableData]);

  const onFetchData = useAsyncDebounce(fetchDataFunction);

  return <TReturnUseFetchData>{
    onFetchData,
    data:
      dataAccessor && tableData?.data.hasOwnProperty(dataAccessor)
        ? tableData.data[dataAccessor]
        : tableData?.data?.data || [],
    loading: !tableData && !error,
    pageCount,
    totalCount,
  };
};

export default useReactTableFetchData;
