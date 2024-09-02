import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import IntlMessages from '../../../@core/utility/IntlMessages';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteUpazila} from '../../../services/locationManagement/UpazilaService';
import UpazilaAddEditPopup from './UpazilaAddEditPopup';
import UpazilaDetailsPopup from './UpazilaDetailsPopup';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconUpazila from '../../../@core/icons/IconUpazila';
import {isResponseSuccess} from '../../../@core/utilities/helpers';

import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  API_DISTRICTS,
  API_DIVISIONS,
  API_UPAZILAS,
} from '../../../@core/common/apiRoutes';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const UpazilasPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {upazila: upazilaPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedItemId(null);
  }, []);

  const openAddEditModal = useCallback((itemId: number | null = null) => {
    setIsOpenDetailsModal(false);
    setIsOpenAddEditModal(true);
    setSelectedItemId(itemId);
  }, []);

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

  const deleteUpazilaItem = async (itemId: number) => {
    try {
      let response = await deleteUpazila(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='upazilas.label' />}}
          />,
        );

        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, [isToggleTable]);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 120,
        hide: locale == LocaleLanguage.EN,
        filterable: true,
      },
      {
        headerName: messages['common.title'] as string,
        field: 'title_en',
        width: 130,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.bbs_code'] as string,
        field: 'bbs_code',
        width: 150,
        filterable: false,
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title',
        width: 120,
        hide: locale == LocaleLanguage.EN,
        filterable: true,
        filter: {
          apiPath: API_DIVISIONS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'loc_division_id',
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title_en',
        width: 120,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['districts.label'] as string,
        field: 'district_title',
        width: 120,
        hide: locale == LocaleLanguage.EN,
        filterable: true,
        filter: {
          apiPath: API_DISTRICTS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'loc_district_id',
      },
      {
        headerName: messages['districts.label'] as string,
        field: 'district_title_en',
        width: 120,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {upazilaPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {upazilaPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {upazilaPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteUpazilaItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_UPAZILAS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconUpazila /> <IntlMessages id='upazilas.label' />
          </>
        }
        extra={[
          upazilaPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['upazilas.label'],
                  }}
                />
              }
            />
          ) : (
            ''
          ),
        ]}>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
        />
        {isOpenAddEditModal && (
          <UpazilaAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <UpazilaDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default UpazilasPage;
