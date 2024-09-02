import React, {useCallback, useContext, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteInstitute} from '../../../services/instituteManagement/InstituteService';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {API_INSTITUTES} from '../../../@core/common/apiRoutes';
import CertificateAuthorityDetailsPopup from './CertificateAuthorityDetailsPopup';
import CertificateAuthorityAddEditPopup from './CertificateAuthorityAddEditPopup';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconInstitute from '../../../@core/icons/IconInstitute';
import CustomChipStatus from '../memberList/CustomChipStatus';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {InstituteServiceTypes} from '../../../@core/utilities/InstituteServiceTypes';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const CertificateAuthorityPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {certificate_authority: certificateAuthorityPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  console.log(certificateAuthorityPermission);
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

  /** if open registration is on, then these codes will be in action => IORIOTTCWBIA */
  /*  const rejectAction = async (itemId: number) => {
          let response = await rejectInstitute(itemId);
          if (isResponseSuccess(response)) {
            successStack(
              <IntlMessages
                id='common.subject_rejected'
                values={{subject: <IntlMessages id='erpl_institute.label' />}}
              />,
            );
          }
          refreshDataTable();
        };

        const ReApproveAction = async (itemId: number) => {
          let response = await ReApproveInstitute(itemId);
          if (isResponseSuccess(response)) {
            successStack(
              <IntlMessages
                id='common.subject_approved'
                values={{subject: <IntlMessages id='erpl_institute.label' />}}
              />,
            );
          }
          refreshDataTable();
        };*/

  const deleteInstituteItem = async (itemId: number) => {
    try {
      let response = await deleteInstitute(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{
              subject: <IntlMessages id='certificate_authority.label' />,
            }}
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
        headerName: messages['common.code'] as string,
        width: 250,
        field: 'code',
        sortable: true,
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 250,
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
        field: 'actions',
        width: 350,
        renderCell: (props: any) => {
          let data = props.row;
          /*let itemId = data?.id;*/
          return (
            <DatatableButtonGroup>
              {certificateAuthorityPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {certificateAuthorityPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {certificateAuthorityPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteInstituteItem(data.id)}
                />
              )}

              {/** IORIOTTCWBIA */}
              {/*{data?.row_status == ApprovalStatus.PENDING && (
                <CommonButton
                  onClick={() => openAssignPermissionModal(data.id)}
                  btnText='common.approve'
                  startIcon={<FiUserCheck style={{marginLeft: '5px'}} />}
                  color='secondary'
                />
              )}
                            {data?.row_status == ApprovalStatus.APPROVED && (
                <RejectButton
                  itemId={itemId}
                  rejectTitle={messages['organization.label'] as string}
                  rejectAction={rejectAction}>
                  {messages['common.reject']}
                </RejectButton>
              )}
              {data?.row_status == ApprovalStatus.REJECTED && (
                <ApproveButton
                  approveAction={() => ReApproveAction(data.id)}
                  buttonText={messages['common.approve'] as string}
                />
              )}*/}
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
      params['service_types'] = [InstituteServiceTypes.CERTIFICATE];
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconInstitute /> <IntlMessages id='certificate_authority.label' />
          </>
        }
        extra={[
          certificateAuthorityPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['certificate_authority.label'],
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
          <CertificateAuthorityAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <CertificateAuthorityDetailsPopup
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

export default CertificateAuthorityPage;
