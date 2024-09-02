import React, {useCallback, useContext, useMemo, useState} from 'react';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import PersonIcon from '@mui/icons-material/Person';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import {useIntl} from 'react-intl';
import IconJobSector from '../../../@core/icons/IconJobSector';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {API_JOB_REQUIREMENTS} from '../../../@core/common/apiRoutes';
import JobRequirementDetailsPopup from './JobRequirementDetailsPopup';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import JobRequirementAddPopup from './JobRequirementAddPopup';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {deleteHRDemand} from '../../../services/IndustryManagement/HrDemandService';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import JobRequirementEditPop from './JobRequirementEditPopUp';
import Link from 'next/link';
import {Button} from '@mui/material';
import {ManageAccounts} from '@mui/icons-material';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';

import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const JobRequirementPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {
    organization_hr_demand: organizationHrDemandPermission,
    industry_association_hr_demand: industryAssociationHrDemandPermission,
  } = useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
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

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((isToggleTable: boolean) => !isToggleTable);
  }, []);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedItemId(null);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setIsOpenDetailsModal(false);
  }, []);

  const deleteHRDemandItem = async (HRDemandId: number) => {
    try {
      let response = await deleteHRDemand(HRDemandId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='hr_demand.label' />}}
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
        headerName: messages['organization.label_bn'] as string,
        field: 'organization_title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['organization.label_en'] as string,
        field: 'organization_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.vacancy'] as string,
        field: 'vacancy',
        width: 250,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              <CustomChip
                icon={<PersonIcon fontSize={'small'} />}
                color={'primary'}
                label={data.vacancy}
              />
            </>
          );
        },
      },

      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        renderCell: (props: any) => {
          let data = props.row;
          const URL = '/../../job-requirement/__'.replace(
            '__',
            String(data.id),
          );
          return (
            <DatatableButtonGroup>
              {(organizationHrDemandPermission.canRead ||
                industryAssociationHrDemandPermission.canRead) && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {(organizationHrDemandPermission.canUpdate ||
                industryAssociationHrDemandPermission.canUpdate) && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {(organizationHrDemandPermission.canDelete ||
                industryAssociationHrDemandPermission.canDelete) && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteHRDemandItem(data.id)}
                />
              )}
              {(organizationHrDemandPermission.canUpdate ||
                industryAssociationHrDemandPermission.canUpdate) && (
                <Link href={URL} passHref>
                  <Button startIcon={<ManageAccounts />}>
                    {messages['common.manage']}
                  </Button>
                </Link>
              )}
            </DatatableButtonGroup>
          );
        },
        width: 450,
        sortable: false,
      },
    ],
    [messages, locale],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_JOB_REQUIREMENTS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconJobSector /> <IntlMessages id='common.human_resource' />
          </>
        }
        extra={[
          organizationHrDemandPermission.canCreate ||
          industryAssociationHrDemandPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['job_requirement.label'],
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
          showColumnToolbar={true}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
        />
        {!selectedItemId && isOpenAddEditModal && (
          <JobRequirementAddPopup
            key={1}
            onClose={closeAddEditModal}
            refreshDataTable={refreshDataTable}
          />
        )}
        {selectedItemId && isOpenAddEditModal && (
          <JobRequirementEditPop
            key={1}
            itemId={selectedItemId}
            onClose={closeAddEditModal}
            refreshDataTable={refreshDataTable}
          />
        )}
        {isOpenDetailsModal && selectedItemId && (
          <JobRequirementDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default JobRequirementPage;
