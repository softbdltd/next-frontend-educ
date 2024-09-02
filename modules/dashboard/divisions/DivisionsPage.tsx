import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteDivision} from '../../../services/locationManagement/DivisionService';
import DivisionAddEditPopup from './DivisionAddEditPopup';
import DivisionDetailsPopup from './DivisionDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconDivision from '../../../@core/icons/IconDivision';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {styled} from '@mui/material/styles';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {API_DIVISIONS} from '../../../@core/common/apiRoutes';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const PREFIX = 'DivisionPage';
const classes = {root: `${PREFIX}-root`};
const StyledDiv = styled('div')((theme) => ({
  [`&.${classes.root}`]: {},
}));

const DivisionsPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {division: divisionPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedItemId(null);
  }, []);

  const openAddEditModal = useCallback(
    (selectedItemId: number | null = null) => {
      setIsOpenDetailsModal(false);
      setIsOpenAddEditModal(true);
      setSelectedItemId(selectedItemId);
    },
    [],
  );

  const openDetailsModal = useCallback(
    (selectedItemId: number) => {
      setIsOpenDetailsModal(true);
      setSelectedItemId(selectedItemId);
    },
    [selectedItemId],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const deleteDivisionItem = async (selectedItemId: number) => {
    try {
      let response = await deleteDivision(selectedItemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='divisions.label' />}}
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
        width: 150,
        hide: locale == LocaleLanguage.EN,
        filterable: true,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 150,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.bbs_code'] as string,
        field: 'bbs_code',
        width: 100,
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {divisionPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {divisionPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {divisionPermission.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteDivisionItem(data.id)}
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
    urlPath: API_DIVISIONS,
  });

  return (
    <StyledDiv className={classes.root}>
      <PageContentBlock
        title={
          <>
            <IconDivision /> <IntlMessages id='divisions.label' />
          </>
        }
        extra={[
          divisionPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['divisions.label'],
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
          <DivisionAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <DivisionDetailsPopup
            key={1}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}
      </PageContentBlock>
    </StyledDiv>
  );
};

export default DivisionsPage;
