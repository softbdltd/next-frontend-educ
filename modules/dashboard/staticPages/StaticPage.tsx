import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import StaticPageDetailsPopup from './StaticPageDetailsPopup';
import StaticPageAddEditPopup from './StaticPageAddEditPopup';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import StaticPageTypes from './StaticPageTypes';
import StaticBlockAddEditPopup from './StaticBlockAddEditPopup';
import StaticPageCategoryTypes from '../../../@core/utilities/StaticPageCategoryTypes';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {API_STATIC_PAGE_TYPES} from '../../../@core/common/apiRoutes';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {InstituteServiceTypes} from '../../../@core/utilities/InstituteServiceTypes';

const StaticPage = () => {
  const {messages, locale} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const [showInFilterItems, setShowInFilterItems] = useState<Array<any>>([]);
  const {static_page_content_or_page_block: static_page_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const staticPagetypeFilterItems = [
    {
      id: StaticPageTypes.BLOCK,
      title: messages['static_page_content_type.page_block'],
    },
    {
      id: StaticPageTypes.PAGE,
      title: messages['static_page_content_type.static_page'],
    },
  ];
  const [staticPageTypesFilters, setStaticPageTypesFilters] = useState<
    Array<any>
  >([StaticPageCategoryTypes.COMMON]);

  const [selectedStaticPage, setSelectedStaticPage] = useState<any>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

  useEffect(() => {
    if (authUser) {
      const categories = [StaticPageCategoryTypes.COMMON];
      if (authUser?.isSystemUser) {
        categories.push(
          StaticPageCategoryTypes.EDUC,
          StaticPageCategoryTypes.LEARNER,
          StaticPageCategoryTypes.RPL,
        );
        setShowInFilterItems([
          {
            id: StaticPageCategoryTypes.EDUC,
            title: getCategoryTitle(StaticPageCategoryTypes.EDUC),
          },
          {
            id: StaticPageCategoryTypes.LEARNER,
            title: getCategoryTitle(StaticPageCategoryTypes.LEARNER),
          },
          {
            id: StaticPageCategoryTypes.RPL,
            title: getCategoryTitle(StaticPageCategoryTypes.RPL),
          },
        ]);
      } else if (authUser?.isInstituteUser) {
        categories.push(StaticPageCategoryTypes.TSP);
        if (
          authUser?.institute?.service_type == InstituteServiceTypes.CERTIFICATE
        ) {
          categories.push(StaticPageCategoryTypes.RPL);
        }
      } else if (authUser?.isOrganizationUser) {
        categories.push(StaticPageCategoryTypes.INDUSTRY);
      } else if (authUser?.isIndustryAssociationUser) {
        categories.push(StaticPageCategoryTypes.INDUSTRY_ASSOCIATION);
      } else if (authUser?.isMinistryUser) {
        categories.push(StaticPageCategoryTypes.MINISTRY);
      }

      setStaticPageTypesFilters(categories);
    }
  }, [authUser]);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedStaticPage(null);
  }, []);

  const openAddEditModal = useCallback((page = null) => {
    setSelectedStaticPage(page);
    setIsOpenDetailsModal(false);
    setIsOpenAddEditModal(true);
  }, []);

  const openDetailsModal = useCallback(
    (code: string) => {
      setSelectedStaticPage(code);
      setIsOpenDetailsModal(true);
    },
    [selectedStaticPage],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const getPageTypeTitle = (type: number) => {
    switch (type) {
      case StaticPageTypes.PAGE:
        return messages['static_page_content_type.static_page'];
      case StaticPageTypes.BLOCK:
        return messages['static_page_content_type.page_block'];
      default:
        return '';
    }
  };

  const getCategoryTitle = (category: number | string) => {
    switch (category) {
      case StaticPageCategoryTypes.EDUC:
        return messages['common.educ'];
      case StaticPageCategoryTypes.LEARNER:
        return messages['common.learner'];
      case StaticPageCategoryTypes.TSP:
        return messages['common.tsp'];
      case StaticPageCategoryTypes.INDUSTRY_ASSOCIATION:
        return messages['common.industry_association'];
      case StaticPageCategoryTypes.MINISTRY:
        return messages['ministry.label'];
      case StaticPageCategoryTypes.RPL:
        return messages['common.rpl'];
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
        hide: locale == LocaleLanguage.EN,
        filterable: true,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 250,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.type'] as string,
        field: 'type',
        width: 250,
        filterable: true,
        filter: {
          options: staticPagetypeFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          return getPageTypeTitle(props.row.type);
        },
      },
      {
        headerName: messages['common.show_in'] as string,
        field: 'category',
        width: 250,
        hide: !Boolean(authUser && authUser.isSystemUser),
        hideable: Boolean(authUser && authUser.isSystemUser),
        filterable: Boolean(authUser && authUser.isSystemUser),
        filter: {
          options: authUser?.isSystemUser ? showInFilterItems : [],
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          return getCategoryTitle(props.row.category);
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {static_page_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data)} />
              )}
              {static_page_permissions.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data)} />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, authUser, showInFilterItems],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_STATIC_PAGE_TYPES,
    paramsValueModifier: (params: any) => {
      params['category'] = staticPageTypesFilters;
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconStaticPage /> <IntlMessages id='static_page.label' />
          </>
        }>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          showColumnToolbar={true}
        />
        {isOpenAddEditModal &&
          selectedStaticPage &&
          selectedStaticPage.type == StaticPageTypes.PAGE && (
            <StaticPageAddEditPopup
              key={1}
              onClose={closeAddEditModal}
              pageCode={selectedStaticPage.page_code}
              pageCategory={selectedStaticPage.category}
            />
          )}

        {isOpenAddEditModal &&
          selectedStaticPage &&
          selectedStaticPage.type == StaticPageTypes.BLOCK && (
            <StaticBlockAddEditPopup
              key={1}
              onClose={closeAddEditModal}
              pageCode={selectedStaticPage.page_code}
              pageCategory={selectedStaticPage.category}
            />
          )}

        {isOpenDetailsModal && selectedStaticPage && (
          <StaticPageDetailsPopup
            key={1}
            pageCode={selectedStaticPage.page_code}
            pageType={selectedStaticPage.type}
            pageCategory={selectedStaticPage.category}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default StaticPage;
