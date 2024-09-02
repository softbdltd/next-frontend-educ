import React, {useCallback, useContext, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import PermissionGroupAddEditPopup from './PermissionGroupAddEditPopup';
import PermissionGroupDetailsPopup from './PermissionGroupDetailsPopup';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';

import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {deletePermissionGroup} from '../../../services/userManagement/PermissionGroupService';
import IconPermissionGroup from '../../../@core/icons/IconPermissionGroup';
import {AccountTreeOutlined} from '@mui/icons-material';
import {LINK_PERMISSION_GROUP} from '../../../@core/common/appLinks';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_PERMISSION_GROUPS} from '../../../@core/common/apiRoutes';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import {Link} from '../../../@core/elements/common';

const PermissionGroupPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {permission_group: permissionGroupPermission} =
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

  const deletePermissionGroupItem = async (permissionGroupId: number) => {
    try {
      let response = await deletePermissionGroup(permissionGroupId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='permission_group.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

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
        headerName: messages['permission_group.key'] as string,
        field: 'key',
        width: 250,
        sortable: true,
        filterable: true,
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 100,
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 500,
        renderCell: (props: any) => {
          let data = props.row;
          const URL = LINK_PERMISSION_GROUP + `/${data.id}`;
          return (
            <DatatableButtonGroup>
              {permissionGroupPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {permissionGroupPermission.canUpdate && (
                <Link href={URL} passHref={true}>
                  <ReadButton startIcon={<AccountTreeOutlined />}>
                    {messages['permission.label']}
                  </ReadButton>
                </Link>
              )}
              {permissionGroupPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {permissionGroupPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deletePermissionGroupItem(data.id)}
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

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, [isToggleTable]);

  const {
    onFetchData,
    data: permissionGroups,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_PERMISSION_GROUPS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconPermissionGroup /> <IntlMessages id='permission_group.label' />
          </>
        }
        extra={[
          permissionGroupPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['permission_group.label'],
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
          data={permissionGroups || []}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          showColumnToolbar={true}
        />
        {isOpenAddEditModal && (
          <PermissionGroupAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <PermissionGroupDetailsPopup
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

export default PermissionGroupPage;
