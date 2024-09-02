import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {API_PROGRAMMES} from '../../../@core/common/apiRoutes';
import ProgrammeAddEditPopup from './ProgrammeAddEditPopup';
import ProgrammeDetailsPopup from './ProgrammeDetailsPopup';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconProgramme from '../../../@core/icons/IconProgramme';
import {deleteProgramme} from '../../../services/instituteManagement/ProgrammeService';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchAllInstitutes} from '../../../services/instituteManagement/hooks';
import RowStatus from '../users/RowStatus';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const ProgrammePage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();

  const {program: programPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const authUser = useAuthUser<CommonAuthUser>();
  const [instituteFilterItems, setInstituteFilterItems] = useState<Array<any>>(
    [],
  );

  const [instituteFilter, setInstituteFilter] = useState<any>(null);
  const {data: institutes} = useFetchAllInstitutes(instituteFilter);

  useEffect(() => {
    if (authUser && authUser.isSystemUser) {
      setInstituteFilter({row_status: RowStatus.ACTIVE});
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && authUser.isSystemUser && institutes) {
      setInstituteFilterItems(
        institutes.map((institute: any) => {
          return {
            id: institute.id,
            title: institute.title,
          };
        }),
      );
    }
  }, [institutes]);

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

  const deleteProgrammeItem = async (programmeId: number) => {
    try {
      let response = await deleteProgramme(programmeId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='programme.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((isToggleTable: boolean) => !isToggleTable);
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
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['institute.label'] as string,
        field: 'institute_title',
        width: 420,
        hide: locale == LocaleLanguage.EN,
        filterable: Boolean(authUser && authUser?.isSystemUser),
        filter: {
          options: instituteFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'institute_id',
      },
      {
        headerName: messages['institute.label_en'] as string,
        field: 'institute_title_en',
        width: 420,
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
        field: 'action',
        width: 280,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {programPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {programPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {programPermission.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteProgrammeItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale, instituteFilterItems],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_PROGRAMMES,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconProgramme /> <IntlMessages id='programme.label' />
          </>
        }
        extra={[
          programPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['programme.label'],
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
          <ProgrammeAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <ProgrammeDetailsPopup
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

export default ProgrammePage;
