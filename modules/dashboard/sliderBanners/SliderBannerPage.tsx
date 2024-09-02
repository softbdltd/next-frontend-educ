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
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {useFetchSliders} from '../../../services/cmsManagement/hooks';
import SliderBannerAddEditPopup from './SliderBannerAddEditPopup';
import SliderBannerDetailsPopup from './SliderBannerDetailsPopup';
import {deleteSliderBanner} from '../../../services/cmsManagement/SliderBannerService';
import IconSliderBanner from '../../../@core/icons/IconSliderBanner';
import RowStatus from '../../../@core/utilities/RowStatus';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {API_BANNERS} from '../../../@core/common/apiRoutes';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const SliderBannerPage = () => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const {banner: banner_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [sliderFilterItems, setSliderFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);
  const [sliderFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: sliders} = useFetchSliders(sliderFilters);

  useEffect(() => {
    if (sliders) {
      setSliderFilterItems(
        sliders.map((slider: any) => {
          return {
            id: slider.id,
            title: slider.title,
          };
        }),
      );
    }
  }, [sliders]);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

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

  const deleteSliderBannerItem = async (itemId: number) => {
    try {
      let response = await deleteSliderBanner(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='banners.label' />}}
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
  }, [isToggleTable]);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 300,
        filterable: true,
      },
      {
        headerName: messages['common.link'] as string,
        field: 'link',
        width: 200,
        filterable: true,
      },
      {
        headerName: messages['common.sub_title'] as string,
        field: 'sub_title',
        hide: true,
        width: 300,
      },
      {
        headerName: messages['slider.label'] as string,
        field: 'slider_id',
        width: 300,
        filterable: true,
        filter: {
          options: sliderFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          return <>{data?.slider_title}</>;
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
              {banner_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {banner_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {banner_permissions.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteSliderBannerItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, sliderFilterItems],
  );
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_BANNERS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconSliderBanner /> <IntlMessages id='banners.label' />
          </>
        }
        extra={[
          banner_permissions.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['banners.label'],
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
          <SliderBannerAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <SliderBannerDetailsPopup
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

export default SliderBannerPage;
