import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import DomainAddEditPopUp from './DomainAddEditPopUp';
import DomainDetailsPopUp from './DomainDetailsPopUp';
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
import {API_DOMAIN} from '../../../@core/common/apiRoutes';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {deleteDomain} from '../../../services/domainManagement/domainService';

const PREFIX = 'DivisionPage';
const classes = {root: `${PREFIX}-root`};
const StyledDiv = styled('div')((theme) => ({
  [`&.${classes.root}`]: {},
}));

const DomainsPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
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

  const deleteDomainItem = async (selectedItemId: number) => {
    try {
      let response = await deleteDomain(selectedItemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='common.domain' />}}
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
        headerName: messages['common.domain'] as string,
        field: 'domain',
        width: 350,
        filterable: true,
      },
      {
        headerName: messages['common.title_prefix'] as string,
        field: 'title_prefix',
        width: 250,
        hide: locale == LocaleLanguage.BN,
        filterable: true,
      },
      {
        headerName: messages['common.title_prefix_en'] as string,
        field: 'title_prefix_en',
        width: 250,
      },
      {
        headerName: messages['institute.label'] as string,
        field: 'institute_id',
        width: 150,
      },
      {
        headerName: messages['organization.label'] as string,
        field: 'organization_id',
        width: 150,
      },
      {
        headerName: messages['industry_association.label'] as string,
        field: 'industry_association_id',
        width: 200,
      },
      {
        headerName: messages['ministry.label'] as string,
        field: 'ministry_id',
        width: 200,
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              <ReadButton onClick={() => openDetailsModal(data.id)} />
              <EditButton onClick={() => openAddEditModal(data.id)} />
              <ConfirmationButton
                buttonType='delete'
                confirmAction={() => deleteDomainItem(data.id)}
              />
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale],
  );
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_DOMAIN,
  });

  return (
    <StyledDiv className={classes.root}>
      <PageContentBlock
        title={
          <>
            <IconDivision /> <IntlMessages id='common.domain' />
          </>
        }
        extra={[
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
          />,
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
          <DomainAddEditPopUp
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <DomainDetailsPopUp
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

export default DomainsPage;
