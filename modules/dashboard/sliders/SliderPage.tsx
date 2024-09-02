import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import SliderDetailsPopup from './SliderDetailsPopup';
import SliderAddEditPopup from './SliderAddEditPopup';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconSlider from '../../../@core/icons/IconSlider';
import {changeStatusSlider, deleteSlider} from '../../../services/cmsManagement/SliderService';
import {useFetchCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {IGridColDef, ISelectFilterItem} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {API_SLIDERS} from '../../../@core/common/apiRoutes';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {FormControlLabel, Switch} from '@mui/material';
import * as _ from 'lodash';
import SliderActiveStatus from '../../../@core/utilities/SliderActiveStatus';

const SliderPage = () => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const authUser = useAuthUser<CommonAuthUser>();
  const [showInFilterItems, setShowInFilterItems] = useState<Array<ISelectFilterItem>>([]);


  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();
  const {slider: slider_permissions} =
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

  const deleteSliderItem = async (itemId: number) => {
    try {
      let response = await deleteSlider(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='slider.label' />}}
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

  const handleStatusChange = (event: any, itemId: any) => {
    const status = event.target.checked
      ? SliderActiveStatus.YES
      : SliderActiveStatus.NO;

    const data: any = {active: status};
    debounceFn(itemId, data);

  };
  const debounceFn = useCallback(_.debounce(handleDebounce, 500), []);

  async function handleDebounce(itemId: any, data: any) {
    try {
      const response = await changeStatusSlider(itemId, data);
      if (isResponseSuccess(response)) {
        // console.log('data.show_in_landing_page: ', data.show_in_landing_page);
        successStack(
          <IntlMessages
            id='common.slider_updated_successfully'
          />,
        );
        refreshDataTable();
      }
    } catch (error) {
    }
  }

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
      },
      {
        headerName: messages['common.show_in'] as string,
        field: 'show_in',
        width: 300,
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
        headerName: messages['common.show_in_landing_page'] as string,
        field: 'active_status',
        hide: false,
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;

          return (
            slider_permissions.canUpdate && (
              <FormControlLabel
                control={
                  <Switch
                    color={'primary'}
                    onChange={(event) => {
                      handleStatusChange(event, data.id);
                    }}
                    checked={!!data.active_status}
                  />
                }
                title={data.active_status ? messages['common.active'] as string : messages['common.inactive'] as string}
                label=''
              />
            )
          );
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
              {slider_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {slider_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {slider_permissions.canDelete && (
                <ConfirmationButton
                  buttonType='delete'
                  confirmAction={() => deleteSliderItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, showInFilterItems],
  );
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_SLIDERS,
  });
  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconSlider /> <IntlMessages id='slider.label' />
          </>
        }
        extra={[
          slider_permissions.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['slider.label'],
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
          <SliderAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <SliderDetailsPopup
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

export default SliderPage;
