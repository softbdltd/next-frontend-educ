import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {deleteFAQ} from '../../../services/cmsManagement/FAQService';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {API_FAQS} from '../../../@core/common/apiRoutes';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import FAQDetailsPopup from './FAQDetailsPopupup';
import FAQAddEditPopup from './FAQAddEditPopup';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import IconFAQ from '../../../@core/icons/IconFAQ';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import {useFetchCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const FAQPage = () => {
  const {messages, locale} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const [showInFilterItems, setShowInFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);
  const {faq: faq_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const {data: cmsGlobalConfig} = useFetchCMSGlobalConfig();

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const authUser = useAuthUser<CommonAuthUser>();

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

  const deleteFAQItem = async (itemId: number) => {
    try {
      let response = await deleteFAQ(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='menu.faq' />}}
          />,
        );

        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
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

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['faq.show_in'] as string,
        field: 'show_in',
        width: 350,
        hide: !authUser?.isSystemUser,
        filterable: authUser?.isSystemUser,
        hideable: true,
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
        headerName: messages['faq.question'] as string,
        field: 'question',
        width: 300,
        hideable: true,
        filterable: true,
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
        field: 'action',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {faq_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {faq_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {faq_permissions.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteFAQItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale, showInFilterItems],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_FAQS,
  });

  let modifiedData = data?.map((faq: any) => {
    let name: string;
    if (parseInt(faq?.show_in) === 1) {
      name = 'EDUC';
    } else if (parseInt(faq?.show_in) === 2) {
      name = 'Youth';
    } else if (parseInt(faq?.show_in) === 3) {
      name = faq?.institute_title;
    } else if (parseInt(faq?.show_in) === 4) {
      name = faq?.organization_title;
    } else if (parseInt(faq?.show_in) === 5) {
      name = faq?.industry_association_title;
    } else {
      name = '';
    }

    return {
      ...faq,
      name,
    };
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconFAQ /> <IntlMessages id='menu.faq' />
          </>
        }
        extra={[
          faq_permissions.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['menu.faq'],
                  }}
                />
              }
            />
          ) : (
            ''
          ),
        ]}>
        {modifiedData && (
          <DataTable
            columns={columns}
            data={modifiedData}
            fetchData={onFetchData}
            loading={loading}
            totalCount={totalCount}
            toggleResetTable={isToggleTable}
          />
        )}
        {isOpenAddEditModal && (
          <FAQAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}
        {isOpenDetailsModal && selectedItemId && (
          <FAQDetailsPopup
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

export default FAQPage;
