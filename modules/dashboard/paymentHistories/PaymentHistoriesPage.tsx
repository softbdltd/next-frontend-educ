import React, {useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_PAYMENT_HISTORIES} from '../../../@core/common/apiRoutes';
import IconPayment from '../../../@core/icons/IconPayment';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {
  getIntlDateFromString,
  localizedNumbers,
} from '../../../@core/utilities/helpers';
import {Typography} from '@mui/material';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';

const PaymentHistoriesPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const [additionalFilters, setAdditionalFilters] = useState<any>({});

  const paymentTypes = useMemo(
    () => [
      {id: 1, title: messages['payment_type.ekpay']},
      {id: 2, title: messages['payment_type.ekpay_challan']},
    ],
    [messages],
  );

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'institute_title',
        width: 250,
        sortable: true,
        hide:
          locale == LocaleLanguage.EN ||
          !authUser?.isSystemUser ||
          !!authUser?.training_center_id,
        hideable:
          authUser?.isSystemUser ||
          !(authUser?.isTrainingCenterUser || authUser?.isInstituteUser),
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'institute_title_en',
        width: 250,
        hide:
          locale == LocaleLanguage.BN ||
          !authUser?.isSystemUser ||
          !!authUser?.training_center_id,
        hideable:
          authUser?.isSystemUser ||
          !(authUser?.isTrainingCenterUser || authUser?.isInstituteUser),
      },

      {
        headerName: messages['common.amount'] as string,
        field: 'total_amount',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;

          return localizedNumbers(data?.total_amount || 0, locale);
        },
      },
      {
        headerName: messages['common.total_enrollments'] as string,
        field: 'total_enrollments',
        width: 250,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;

          return localizedNumbers(data?.total_enrollments || 0, locale);
        },
      },
      {
        headerName: messages['common.payment_date'] as string,
        field: 'payment_completed_date',
        width: 250,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            data.payment_completed_date && (
              <Typography>
                {getIntlDateFromString(
                  formatDate,
                  data.payment_completed_date,
                  'short',
                )}
              </Typography>
            )
          );
        },
      },
    ],
    [messages, locale, authUser],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_PAYMENT_HISTORIES,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconPayment /> <IntlMessages id='common.payment_histories' />
          </>
        }>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <AdditionalSelectFilterField
                id='payment_type'
                label={messages['payment.payment_type']}
                isLoading={false}
                options={paymentTypes}
                valueFieldName={'id'}
                labelFieldNames={['title']}
                value={routeValue['payment_type'] ?? ''}
                onChange={(value: any) => {
                  let filters = {
                    ...additionalFilters,
                    ['payment_type']: value,
                  };
                  onChange(filters);
                  setAdditionalFilters(filters);
                }}
              />
            );
          }}
        />
      </PageContentBlock>
    </>
  );
};

export default PaymentHistoriesPage;
