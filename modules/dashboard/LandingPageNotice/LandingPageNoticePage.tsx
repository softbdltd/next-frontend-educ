import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import LandingPageNoticeAddEditPopUp from './LandingPageNoticeAddEditPopUp';
import LandingPageNoticeDetailsPopUp from './LandingPageNoticeDetailsPopUp';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconDivision from '../../../@core/icons/IconDivision';
import {styled} from '@mui/material/styles';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {API_LANDING_PAGE_PROMOTION_BANNER} from '../../../@core/common/apiRoutes';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {AccessorType} from '../../../shared/constants/AccessorType';

const PREFIX = 'DivisionPage';
const classes = {root: `${PREFIX}-root`};
const StyledDiv = styled('div')((theme) => ({
  [`&.${classes.root}`]: {},
}));

const LandingPageNoticePage = () => {
  const {messages, locale} = useIntl();
  // const {successStack, errorStack} = useNotiStack();
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

  const typeFilterItems = useMemo(() => {
    return [
      {
        id: AccessorType.INSTITUTE,
        title: messages['institute.label'] as string,
      },
      {
        id: AccessorType.ORGANIZATION,
        title: messages['organization.label'] as string,
      },
      {
        id: AccessorType.INDUSTRY_ASSOCIATION,
        title: messages['industry_association.label'] as string,
      },
      {id: AccessorType.MINISTRY, title: messages['ministry.label'] as string},
    ];
  }, [messages]);

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, [isToggleTable]);
  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: false,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 250,
        filterable: false,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.type'] as string,
        field: 'accessor_type',
        width: 250,
        filterable: true,
        filter: {
          options: typeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          if (data?.accessor_type == AccessorType.INSTITUTE) {
            return <>{messages['institute.label']}</>;
          } else if (data?.accessor_type == AccessorType.ORGANIZATION) {
            return <>{messages['organization.label']}</>;
          } else if (data?.accessor_type == AccessorType.INDUSTRY_ASSOCIATION) {
            return <>{messages['industry_association.label']}</>;
          } else if (data?.accessor_type == AccessorType.MINISTRY) {
            return <>{messages['ministry.label']}</>;
          }
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 150,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.is_enabled} />;
        },
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
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale],
  );
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_LANDING_PAGE_PROMOTION_BANNER,
  });

  return (
    <StyledDiv className={classes.root}>
      <PageContentBlock
        title={
          <>
            <IconDivision /> <IntlMessages id='common.landing_page_notice' />
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
          <LandingPageNoticeAddEditPopUp
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <LandingPageNoticeDetailsPopUp
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

export default LandingPageNoticePage;
