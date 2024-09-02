import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  getIntlDateFromString,
  isResponseSuccess,
} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteUser} from '../../../services/userManagement/UserService';
import IconUser from '../../../@core/icons/IconUser';
import {API_ROLES, API_USERS} from '../../../@core/common/apiRoutes';
import UserAddEditPopup from './UserAddEditPopup';
import UserDetailsPopup from './UserDetailsPopup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import {Typography} from '@mui/material';

const UsersPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {user: userPermission} =
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

  const openDetailsModal = useCallback((itemId: number) => {
    setIsOpenDetailsModal(true);
    setSelectedItemId(itemId);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const deleteUserItem = async (itemId: number) => {
    try {
      let response = await deleteUser(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='user.label' />}}
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
        headerName: messages['common.name'] as string,
        field: 'name',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.name_en'] as string,
        field: 'name_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.mobile'] as string,
        field: 'mobile',
        width: 250,
        sortable: true,
        hideable: true,
        filterable: true,
      },

      {
        headerName: messages['common.email'] as string,
        field: 'email',
        width: 250,
        sortable: true,
        hideable: true,
        filterable: true,
      },
      {
        headerName: messages['common.created'] as string,
        field: 'created_at',
        width: 250,
        sortable: true,
        hideable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <Typography>
              {getIntlDateFromString(formatDate, data?.created_at)}
            </Typography>
          );
        },
      },
      {
        headerName: messages['role.label'] as string,
        field: 'role_title',
        width: 250,
        sortable: true,
        filterable: true,
        filter: {
          apiPath: API_ROLES,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        hide: locale == LocaleLanguage.EN,
        filterKey: 'role',
      },
      {
        headerName: messages['role.label_en'] as string,
        field: 'role_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
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
        width: 350,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {userPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {userPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {userPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteUserItem(data.id)}
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
    urlPath: API_USERS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconUser /> <IntlMessages id='user.label' />
          </>
        }
        extra={[
          userPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['user.label'],
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
          showColumnToolbar={true}
        />
        {isOpenAddEditModal && (
          <UserAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <UserDetailsPopup
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

export default UsersPage;
