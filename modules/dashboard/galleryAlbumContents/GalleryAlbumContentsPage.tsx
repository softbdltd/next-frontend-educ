import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import GalleryAlbumContentsPageAddEditPopup from './GalleryAlbumContentsPageAddEditPopup';
import GalleryAlbumContentDetailsPopup from './GalleryAlbumContentDetailsPopup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  isResponseSuccess,
  getIntlDateFromString,
} from '../../../@core/utilities/helpers';
import IconVideo from '../../../@core/icons/IconVideo';
import {API_GALLERY_ALBUM_CONTENTS} from '../../../@core/common/apiRoutes';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {deleteGalleryAlbumContent} from '../../../services/cmsManagement/GalleryAlbumContentService';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import GalleryAlbumContentTypes from './GalleryAlbumContentTypes';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Typography} from '@mui/material';

const GalleryAlbumContentsPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {gallery_album: gallery_album_contents_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const [contentTypeFilterItems] = useState<Array<ISelectFilterItem>>([
    {
      id: GalleryAlbumContentTypes.IMAGE,
      title: messages['common.image'] as string,
    },
    {
      id: GalleryAlbumContentTypes.VIDEO,
      title: messages['common.video'] as string,
    },
  ]);
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

  const deleteGalleryAlbumContentItem = async (itemId: number) => {
    try {
      let response = await deleteGalleryAlbumContent(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{
              subject: <IntlMessages id='gallery_album_content.label' />,
            }}
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

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        filterable: true,
        width: 350,
      },
      {
        headerName: messages['common.content_type'] as string,
        field: 'content_type',
        filterable: true,
        width: 120,
        filter: {
          options: contentTypeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          if (data.content_type === GalleryAlbumContentTypes.IMAGE) {
            return <p>{messages['common.image']}</p>;
          } else if (data.content_type === GalleryAlbumContentTypes.VIDEO) {
            return <p>{messages['common.video']}</p>;
          } else {
            return '';
          }
        },
      },
      {
        headerName: messages['common.published_at'] as string,
        field: 'published_at',
        width: 150,
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
        width: 150,
        filterable: true,
        dateRangeFilter: true,
        hide: true,
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
        width: 150,
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
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {gallery_album_contents_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {gallery_album_contents_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {gallery_album_contents_permissions.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteGalleryAlbumContentItem(data.id)}
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
    urlPath: API_GALLERY_ALBUM_CONTENTS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconVideo /> <IntlMessages id='gallery_album_content.label' />
          </>
        }
        extra={[
          gallery_album_contents_permissions.canCreate ? (
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
          loading={loading}
          toggleResetTable={isToggleTable}
          fetchData={onFetchData}
          totalCount={totalCount}
        />
        {isOpenAddEditModal && (
          <GalleryAlbumContentsPageAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <GalleryAlbumContentDetailsPopup
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

export default GalleryAlbumContentsPage;
