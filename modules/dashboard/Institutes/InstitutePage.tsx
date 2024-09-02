import React, {useCallback, useContext, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {
  deleteInstitute,
  ReApproveInstitute,
  rejectInstitute,
} from '../../../services/instituteManagement/InstituteService';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {API_INSTITUTES} from '../../../@core/common/apiRoutes';
import InstituteDetailsPopup from './InstituteDetailsPopup';
import InstituteAddEditPopup from './InstituteAddEditPopup';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconInstitute from '../../../@core/icons/IconInstitute';
import {ApprovalStatus} from './ApprovalStatusEnums';
import {FiUserCheck} from 'react-icons/fi';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import InstituteAssingnPermissionPopup from './InstituteAssingnPermissionPopup';
import CustomChipStatus from '../memberList/CustomChipStatus';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {InstituteServiceTypes} from '../../../@core/utilities/InstituteServiceTypes';
import {InstituteTypes} from '../../../@core/utilities/InstituteTypes';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

const InstitutePage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {institute: institutePermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenPermissionSubGroupModal, setIsOpenPermissionSubGroupModal] =
    useState(false);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const instituteTypeFilterItems: any = [
    {
      id: InstituteTypes.GOVERNMENT,
      title: messages['common.government'] as string,
    },
    {
      id: InstituteTypes.NON_GOVERNMENT,
      title: messages['common.non_government'] as string,
    },
  ];

  const openAssignPermissionModal = useCallback(
    (itemId: number | null = null) => {
      setIsOpenDetailsModal(false);
      setIsOpenPermissionSubGroupModal(true);
      setSelectedItemId(itemId);
    },
    [],
  );

  const closeAssignPermissionModal = useCallback(() => {
    setIsOpenPermissionSubGroupModal(false);
    setSelectedItemId(null);
  }, []);

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

  const rejectAction = async (itemId: number) => {
    try {
      let response = await rejectInstitute(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_rejected'
            values={{subject: <IntlMessages id='common.institute' />}}
          />,
        );
      }
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const ReApproveAction = async (itemId: number) => {
    try {
      let response = await ReApproveInstitute(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_approved'
            values={{subject: <IntlMessages id='common.institute' />}}
          />,
        );
      }
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const deleteInstituteItem = async (itemId: number) => {
    try {
      let response = await deleteInstitute(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='institute.label' />}}
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
        width: 350,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 350,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.code'] as string,
        field: 'code',
        width: 250,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['common.primary_mobile'] as string,
        field: 'primary_mobile',
        width: 220,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['common.email'] as string,
        field: 'email',
        width: 280,
        filterable: true,
        sortable: true,
      },
      {
        headerName: messages['common.contact_person_mobile'] as string,
        field: 'contact_person_mobile',
        width: 280,
        sortable: true,
        hide: true,
      },
      {
        headerName: messages['common.contact_person_email'] as string,
        field: 'contact_person_email',
        width: 220,
        sortable: true,
        hide: true,
      },

      {
        headerName: messages['common.institute_type'] as string,
        field: 'institute_type_id',
        width: 250,
        filterable: true,
        sortable: true,
        filter: {
          options: instituteTypeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          if (String(data.institute_type_id) == InstituteTypes.GOVERNMENT) {
            return <>{messages['common.government']}</>;
          } else {
            return <>{messages['common.non_government']}</>;
          }
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <CustomChipStatus variant={'filled'} value={data?.row_status} />
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 400,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {institutePermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {institutePermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}

              {institutePermission.canUpdate &&
                data?.row_status == ApprovalStatus.PENDING && (
                  <CommonButton
                    onClick={() => openAssignPermissionModal(data.id)}
                    btnText='common.approve'
                    startIcon={<FiUserCheck style={{marginLeft: '5px'}} />}
                    color='secondary'
                  />
                )}
              {institutePermission.canUpdate &&
                data?.row_status == ApprovalStatus.APPROVED && (
                  <ConfirmationButton
                    buttonType='reject'
                    confirmAction={() => rejectAction(data.id)}
                  />
                )}
              {institutePermission.canUpdate &&
                data?.row_status == ApprovalStatus.REJECTED && (
                  <ConfirmationButton
                    buttonType='approve'
                    confirmAction={() => ReApproveAction(data.id)}
                  />
                )}
              {institutePermission.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteInstituteItem(data.id)}
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

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_INSTITUTES,
    paramsValueModifier: (params: any) => {
      params['service_types'] = [InstituteServiceTypes.TRAINING, InstituteServiceTypes.OTHERS];
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconInstitute /> <IntlMessages id='institute.label' />
          </>
        }
        extra={[
          institutePermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['institute.label'],
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
          <InstituteAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <InstituteDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}
        {isOpenPermissionSubGroupModal && (
          <InstituteAssingnPermissionPopup
            key={1}
            onClose={closeAssignPermissionModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default InstitutePage;
