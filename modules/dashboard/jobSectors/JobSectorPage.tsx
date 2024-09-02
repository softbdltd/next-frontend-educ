import React, {useCallback, useContext, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteJobSector} from '../../../services/organaizationManagement/JobSectorService';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import JobSectorDetailsPopup from './JobSectorDetailsPopup';
import JobSectorAddEditPopup from './JobSectorAddEditPopup';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconJobSector from '../../../@core/icons/IconJobSector';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_JOB_SECTORS} from '../../../@core/common/apiRoutes';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const JobSectorPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {job_sector: jobSectorPermission} =
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

  const deleteJobSectorItem = async (itemId: number) => {
    try {
      let response = await deleteJobSector(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='job_sectors.label' />}}
          />,
        );

        await refreshDataTable();
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
    data: jobSectors,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_JOB_SECTORS,
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
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 150,
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {jobSectorPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {jobSectorPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {jobSectorPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteJobSectorItem(data.id)}
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
            <IconJobSector /> <IntlMessages id='job_sectors.label' />
          </>
        }
        extra={[
          jobSectorPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['job_sectors.label'],
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
          data={jobSectors || []}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          showColumnToolbar={true}
        />
        {isOpenAddEditModal && (
          <JobSectorAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <JobSectorDetailsPopup
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

export default JobSectorPage;
