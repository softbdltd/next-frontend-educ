import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PaymentDetailsPopup from './PaymentDetailsPopup';
import {
  API_PAYMENT_DISBURSEMENT,
  API_TRAINING_CENTERS,
} from '../../../@core/common/apiRoutes';
import IconPayment from '../../../@core/icons/IconPayment';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {
  getIntlDateFromString,
  localizedNumbers,
} from '../../../@core/utilities/helpers';
import {Typography} from '@mui/material';

const PaymentDisbursementPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();

  const {payment_disbursement: PaymentPermission, training_center} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

  const openDetailsModal = useCallback(
    (itemId: number) => {
      setIsOpenDetailsModal(true);
      setSelectedItemId(itemId);
    },
    [selectedItemId],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'accessor_title',
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
        field: 'accessor_title_en',
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
        headerName: messages['common.training_center'] as string,
        field: 'training_center_title',
        width: 300,
        sortable: true,
        hide: locale == LocaleLanguage.EN || !!authUser?.training_center_id,
        hideable: !authUser?.training_center_id,
        filterable: training_center.canReadAll,
        filter: {
          apiPath: API_TRAINING_CENTERS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'training_center_id',
      },
      {
        headerName: messages['common.training_center_en'] as string,
        field: 'training_center_title_en',
        width: 250,
        hide: locale == LocaleLanguage.BN || !!authUser?.training_center_id,
        hideable: !authUser?.training_center_id,
      },
      {
        headerName: messages['common.amount'] as string,
        field: 'amount',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;

          return localizedNumbers(data?.amount || 0, locale);
        },
      },
      {
        headerName: messages['common.total_enrollments'] as string,
        field: 'enrollment_ids',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;

          return localizedNumbers(data?.enrollment_ids?.length || 0, locale);
        },
      },
      {
        headerName: messages['common.payment_date'] as string,
        field: 'disbursement_created_at',
        width: 250,
        sortable: false,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            data.disbursement_created_at && (
              <Typography>
                {getIntlDateFromString(
                  formatDate,
                  data.disbursement_created_at,
                  'short',
                )}
              </Typography>
            )
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 280,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {PaymentPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale, authUser],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_PAYMENT_DISBURSEMENT,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconPayment /> <IntlMessages id='common.payment_disbursement' />
          </>
        }>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          // toggleResetTable={isToggleTable}
        />

        {isOpenDetailsModal && selectedItemId && (
          <PaymentDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default PaymentDisbursementPage;
