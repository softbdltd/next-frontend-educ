import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteDistrict} from '../../../services/locationManagement/DistrictService';
import DistrictAddEditPopup from './DistrictAddEditPopup';
import DistrictDetailsPopup from './DistrictDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconDistrict from '../../../@core/icons/IconDistrict';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {API_DISTRICTS, API_DIVISIONS} from '../../../@core/common/apiRoutes';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const DistrictsPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {district: districtPermission} =
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

  const deleteDistrictItem = async (districtId: number) => {
    try {
      let response = await deleteDistrict(districtId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='districts.label' />}}
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
        width: 130,
        hide: locale == LocaleLanguage.EN,
        filterable: true,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 130,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.bbs_code'] as string,
        width: 140,
        field: 'bbs_code',
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title_en',
        width: 140,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title',
        width: 140,
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
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {districtPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {districtPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {districtPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteDistrictItem(data.id)}
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
    urlPath: API_DISTRICTS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconDistrict /> <IntlMessages id='districts.label' />
          </>
        }
        extra={[
          districtPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['districts.label'],
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
          <DistrictAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <DistrictDetailsPopup
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

export default DistrictsPage;
