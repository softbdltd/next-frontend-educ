import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import GalleryAlbumAddEditPopup from './GalleryAlbumAddEditPopup';
import GalleryAlbumDetailsPopup from './GalleryAlbumDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  isResponseSuccess,
  getIntlDateFromString,
} from '../../../@core/utilities/helpers';
import IconVideo from '../../../@core/icons/IconVideo';
import {deleteGalleryAlbum} from '../../../services/cmsManagement/GalleryAlbumService';
import {API_GALLERY_ALBUMS} from '../../../@core/common/apiRoutes';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import AlbumTypes from './AlbumTypes';
import {useFetchCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Typography} from '@mui/material';

const GalleryAlbumPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const authUser = useAuthUser<CommonAuthUser>();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [albumTypeFilterItems, setAlbumTypeFilterItems] = useState<Array<any>>(
    [],
  );

  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();
  const [showInFilterItems, setShowInFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);
  const {gallery_album: gallery_album_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const albumTypes = useMemo(
    () => [
      {
        id: AlbumTypes.IMAGE,
        label: messages['album_type.image'],
      },
      {
        id: AlbumTypes.VIDEO,
        label: messages['album_type.video'],
      },
      {
        id: AlbumTypes.MIXED,
        label: messages['common.mixed'],
      },
    ],
    [messages],
  );

  useEffect(() => {
    if (cmsGlobalConfig) {
      setShowInFilterItems(
        cmsGlobalConfig?.show_in.map((showIntype: any) => {
          return {
            id: showIntype.id,
            title: showIntype.title,
          };
        }),
      );
    }
  }, [cmsGlobalConfig]);

  useEffect(() => {
    setAlbumTypeFilterItems(
      albumTypes.map((type) => {
        return {
          id: type.id,
          title: type.label,
        };
      }),
    );
  }, [albumTypes]);

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

  const deleteGalleryItem = async (itemId: number) => {
    try {
      let response = await deleteGalleryAlbum(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='common.gallery_album' />}}
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

  const getAlbumTypeTitle = (albumType: number) => {
    switch (albumType) {
      case AlbumTypes.IMAGE:
        return messages['album_type.image'];
      case AlbumTypes.VIDEO:
        return messages['album_type.video'];
      case AlbumTypes.MIXED:
        return messages['common.mixed'];
      default:
        return '';
    }
  };

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
      },
      {
        headerName: messages['gallery_album.album_type'] as string,
        field: 'album_type',
        width: 250,
        filterable: true,
        filter: {
          options: albumTypeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          return getAlbumTypeTitle(props.row.album_type);
        },
      },
      {
        headerName: messages['common.show_in'] as string,
        field: 'show_in',
        width: 250,
        hide: !Boolean(authUser && authUser.isSystemUser),
        hideable: Boolean(authUser && authUser.isSystemUser),
        filterable: authUser?.isSystemUser,
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
        headerName: messages['common.published_at'] as string,
        field: 'published_at',
        width: 200,
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
        width: 200,
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
        headerName: messages['gallery_album.featured_status'] as string,
        field: 'featured',
        width: 160,
        renderCell: (props: any) => {
          let data = props.row;
          if (data.featured === 0) {
            return <p>{messages['common.no']}</p>;
          } else if (data.featured === 1) {
            return <p>{messages['common.yes']}</p>;
          } else {
            return <p>none</p>;
          }
        },
      },
      {
        headerName: messages['common.status'] as string,
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
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {gallery_album_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {gallery_album_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {gallery_album_permissions.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteGalleryItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        width: 300,
        sortable: false,
      },
    ],
    [messages, locale, showInFilterItems],
  );
  const {data, loading, totalCount, onFetchData} = useFetchTableData({
    urlPath: API_GALLERY_ALBUMS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconVideo /> <IntlMessages id='galleries.institute' />
          </>
        }
        extra={[
          gallery_album_permissions.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['common.gallery_album'],
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
          <GalleryAlbumAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <GalleryAlbumDetailsPopup
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

export default GalleryAlbumPage;
