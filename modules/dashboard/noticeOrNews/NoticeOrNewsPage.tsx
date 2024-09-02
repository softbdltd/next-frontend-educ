import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {API_NOTICE_OR_NEWSES} from '../../../@core/common/apiRoutes';
import {
  isResponseSuccess,
  getIntlDateFromString,
} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {deleteNoticeOrNews} from '../../../services/cmsManagement/NoticeOrNewsService';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import NoticeOrNewsAddEditPopup from './NoticeOrNewsAddEditPopup';
import NoticeOrNewsDetailsPopup from './NoticeOrNewsDetailsPopup';
import NoticeOrNewsTypes from '../../../@core/utilities/NoticeOrNewsTypes';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Typography} from '@mui/material';

const NoticeOrNewsPage = () => {
  const {messages, formatDate} = useIntl();
  const {notice_or_news: notice_or_news_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const {successStack, errorStack} = useNotiStack();
  const authUser = useAuthUser<CommonAuthUser>();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const [typeFilterItems] = useState<Array<ISelectFilterItem>>([
    {
      id: NoticeOrNewsTypes.NOTICE,
      title: messages['notice_type.notice'] as string,
    },
    {
      id: NoticeOrNewsTypes.NEWS,
      title: messages['notice_type.news'] as string,
    },
    {
      id: NoticeOrNewsTypes.UPCOMING_EVENTS,
      title: messages['common.upcoming_events'] as string,
    },
  ]);
  const [showInFilterItems, setShowInFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);

  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();

  useEffect(() => {
    if (cmsGlobalConfig) {
      setShowInFilterItems(
        cmsGlobalConfig?.show_in.map((showInType: any) => {
          return {
            id: showInType.id,
            title: showInType.title,
          };
        }),
      );
    }
  }, [cmsGlobalConfig]);

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

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const deleteNoticeOrNewsItem = async (itemId: number) => {
    try {
      let response = await deleteNoticeOrNews(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='common.notice_or_news' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const getNoticeOrNewsTitle = (type: number) => {
    switch (type) {
      case NoticeOrNewsTypes.NOTICE:
        return messages['notice_type.notice'];
      case NoticeOrNewsTypes.NEWS:
        return messages['notice_type.news'];
      default:
        return '';
    }
  };

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        width: 300,
        field: 'title',
        filterable: true,
        hideable: false,
      },

      {
        headerName: messages['common.type'] as string,
        field: 'type',
        width: 130,
        filterable: true,
        filter: {
          options: typeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          return getNoticeOrNewsTitle(props.row?.type);
        },
      },
      {
        headerName: messages['common.show_in'] as string,
        field: 'show_in',
        hide: !Boolean(authUser && authUser.isSystemUser),
        hideable: Boolean(authUser && authUser.isSystemUser),
        filterable: Boolean(authUser && authUser.isSystemUser),
        filter: {
          options: showInFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        width: 250,
        renderCell: (props: any) => {
          return props.row.show_in_label;
        },
      },
      {
        headerName: messages['common.published_at'] as string,
        width: 180,
        field: 'published_at',
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return data.published_at ? (
            <Typography>
              {getIntlDateFromString(formatDate, data.published_at, 'short')}
            </Typography>
          ) : (
            <></>
          );
        },
      },
      {
        headerName: messages['common.archived_at'] as string,
        field: 'archived_at',
        width: 180,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return data.archived_at ? (
            <Typography>
              {getIntlDateFromString(formatDate, data.archived_at, 'short')}
            </Typography>
          ) : (
            <></>
          );
        },
      },
      {
        headerName: messages['common.active_status'] as string,
        field: 'row_status',
        width: 120,
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
        hideable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {notice_or_news_permission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {notice_or_news_permission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {notice_or_news_permission.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteNoticeOrNewsItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, showInFilterItems, typeFilterItems],
  );

  const {data, loading, totalCount, onFetchData} = useFetchTableData({
    urlPath: API_NOTICE_OR_NEWSES,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconStaticPage />
            <IntlMessages id='common.notice_or_news' />
          </>
        }
        extra={[
          notice_or_news_permission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['common.notice_or_news'],
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
          <NoticeOrNewsAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            refreshDataTable={refreshDataTable}
            itemId={selectedItemId}
          />
        )}
        {isOpenDetailsModal && selectedItemId && (
          <NoticeOrNewsDetailsPopup
            key={1}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
            itemId={selectedItemId}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default NoticeOrNewsPage;
