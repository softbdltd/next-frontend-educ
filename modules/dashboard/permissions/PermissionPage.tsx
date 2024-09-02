import React, {useCallback, useContext, useMemo, useState} from 'react';
import {isUndefined as lodashIsUndefined} from 'lodash';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import PermissionAddEditPopup from './PermissionAddEditPopup';
import PermissionDetailsPopup from './PermissionDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconPermission from '../../../@core/icons/IconPermission';
import {deletePermission} from '../../../services/userManagement/PermissionService';
import PermissionMethodsLabelByKey from '../../../@core/utilities/Permission';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_PERMISSIONS} from '../../../@core/common/apiRoutes';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';

const PermissionPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {permission: permissionPagePermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

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

  const deletePermissionItem = async (permissionId: number) => {
    try {
      let response = await deletePermission(permissionId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='permission.label' />}}
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

  const {
    onFetchData,
    data: permissions,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_PERMISSIONS,
  });

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['permission.module'] as string,
        field: 'module',
        width: 250,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['permission.uri'] as string,
        field: 'uri',
        width: 250,
        sortable: true,
      },
      {
        headerName: messages['permission.method'] as string,
        field: 'method',
        width: 150,
        filterable: true,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            !lodashIsUndefined(PermissionMethodsLabelByKey[data.method + '']) &&
            PermissionMethodsLabelByKey[data.method + '']
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 350,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {permissionPagePermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {permissionPagePermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {permissionPagePermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deletePermissionItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconPermission /> <IntlMessages id='permission.label' />
          </>
        }
        extra={[
          permissionPagePermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['permission.label'],
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
          data={permissions || []}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          showColumnToolbar={true}
        />
        {isOpenAddEditModal && (
          <PermissionAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <PermissionDetailsPopup
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

export default PermissionPage;
