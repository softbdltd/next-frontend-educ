import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isResponseSuccess,
  getIntlDateFromString,
} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {API_RECENT_ACTIVITIES} from '../../../@core/common/apiRoutes';
import RecentActivitiesAddEditPopup from './RecentActivitiesAddEditPopup';
import RecentActivitiesDetailsPopup from './RecentActivitiesDetailsPopup';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {deleteRecentActivity} from '../../../services/cmsManagement/RecentActivityService';
import ContentTypes from './ContentTypes';
import IconVideo from '../../../@core/icons/IconVideo';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Typography} from '@mui/material';

const RecentActivitiesPage = () => {
  const {messages, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {recent_activity: recent_activity_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const authUser = useAuthUser<CommonAuthUser>();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [showInFilterItems, setShowInFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);
  const [contentTypeFilterItems] = useState<Array<ISelectFilterItem>>([
    {id: ContentTypes.IMAGE, title: messages['common.image'] as string},
    {
      id: ContentTypes.YOUTUBE_SOURCE,
      title: messages['content_type.youtube_video'] as string,
    },
    {
      id: ContentTypes.FACEBOOK_SOURCE,
      title: messages['content_type.facebook_video'] as string,
    },
  ]);

  const {data, loading, totalCount, onFetchData} = useFetchTableData({
    urlPath: API_RECENT_ACTIVITIES,
  });

  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();

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

  const deleteRecentActivityItem = async (itemId: number) => {
    try {
      let response = await deleteRecentActivity(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='recent_activities.label' />}}
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
  }, []);

  const getContentTypeTitle = (contentType: number) => {
    switch (contentType) {
      case ContentTypes.IMAGE:
        return messages['content_type.image'];
      case ContentTypes.FACEBOOK_SOURCE:
        return messages['content_type.facebook_video'];
      case ContentTypes.YOUTUBE_SOURCE:
        return messages['content_type.youtube_video'];
      default:
        return '';
    }
  };
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

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.show_in'] as string,
        field: 'show_in',
        width: 250,
        hide: !Boolean(authUser && authUser.isSystemUser),
        hideable: Boolean(authUser && authUser.isSystemUser),
        filterable: Boolean(authUser && authUser.isSystemUser),
        filter: {
          options: showInFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          return props.row.show_in_label;
        },
      },
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
      },
      {
        headerName: messages['common.published_at'] as string,
        field: 'published_at',
        filterable: true,
        dateRangeFilter: true,
        width: 250,
        hide: false,
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
        filterable: true,
        dateRangeFilter: true,
        width: 250,
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
        headerName: messages['common.content_type'] as string,
        field: 'content_type',
        width: 200,
        filterable: true,
        filter: {
          options: contentTypeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          return getContentTypeTitle(props.row.content_type);
        },
      },
      {
        headerName: messages['common.active_status'] as string,
        field: 'row_status',
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
              {recent_activity_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {recent_activity_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {recent_activity_permissions.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteRecentActivityItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, contentTypeFilterItems, showInFilterItems],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconVideo />
            <IntlMessages id='recent_activities.label' />
          </>
        }
        extra={[
          recent_activity_permissions.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['recent_activities.label'],
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
          <RecentActivitiesAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            refreshDataTable={refreshDataTable}
            itemId={selectedItemId}
          />
        )}
        {isOpenDetailsModal && selectedItemId && (
          <RecentActivitiesDetailsPopup
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

export default RecentActivitiesPage;
