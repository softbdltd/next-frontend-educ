import React, {useCallback, useContext, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {deleteOccupation} from '../../../services/organaizationManagement/OccupationService';
import OccupationAddEditPopup from './OccupationAddEditPopup';
import OccupationDetailsPopup from './OccupationDetailsPopup';
import {
  API_JOB_SECTORS,
  API_OCCUPATIONS,
} from '../../../@core/common/apiRoutes';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconOccupation from '../../../@core/icons/IconOccupation';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';

const OccupationsPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {occupation: occupationPermission} =
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

  const deleteOccupationItem = async (itemId: number) => {
    try {
      let response = await deleteOccupation(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='occupations.label' />}}
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
        headerName: messages['job_sectors.label'] as string,
        field: 'job_sector_title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
        filter: {
          apiPath: API_JOB_SECTORS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'job_sector_id',
      },
      {
        headerName: messages['job_sectors.label_en'] as string,
        field: 'job_sector_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
        width: 100,
        sortable: false,
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {occupationPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {occupationPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {occupationPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteOccupationItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        width: 300,
        sortable: false,
      },
    ],
    [messages, locale],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_OCCUPATIONS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconOccupation /> <IntlMessages id='occupations.label' />
          </>
        }
        extra={[
          occupationPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['occupations.label'],
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
          <OccupationAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <OccupationDetailsPopup
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

export default OccupationsPage;
