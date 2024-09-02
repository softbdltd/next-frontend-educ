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
import {API_BRANCHES} from '../../../@core/common/apiRoutes';
import BranchAddEditPopup from './BranchAddEditPopup';
import BranchDetailsPopup from './BranchDetailsPopup';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';

import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {deleteBranch} from '../../../services/instituteManagement/BranchService';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconBranch from '../../../@core/icons/IconBranch';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {useFetchAllInstitutes} from '../../../services/instituteManagement/hooks';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Typography} from '@mui/material';
import {
  useFetchLocalizedDivisions,
  useFetchLocalizedDistricts,
  useFetchCityCorporations,
} from '../../../services/locationManagement/hooks';
import RowStatus from '../users/RowStatus';
import {
  filterDistrictsByDivisionId,
  filterCityCorporationsByDivisionId,
} from '../../../services/locationManagement/locationUtils';
import {District} from '../../../shared/Interface/location.interface';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import {useRouter} from 'next/router';

const BranchPage = () => {
  const {messages, locale} = useIntl();
  const router = useRouter();
  const {branch: branchPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const {successStack, errorStack} = useNotiStack();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [instituteFilterItems, setInstituteFilterItems] = useState<Array<any>>(
    [],
  );
  const [additionalFilters, setAdditionalFilters] = useState<any>({});
  const [divisionsFilter] = useState({row_status: RowStatus.ACTIVE});
  const [districtsFilter] = useState({row_status: RowStatus.ACTIVE});
  const [cityCorporationFilter] = useState({row_status: RowStatus.ACTIVE});

  const {data: divisions, isLoading: isLoadingDivisions} =
    useFetchLocalizedDivisions(divisionsFilter);
  const {data: districts, isLoading: isLoadingDistricts} =
    useFetchLocalizedDistricts(districtsFilter);
  const {data: cityCorporations, isLoading: isLoadingCityCorporations} =
    useFetchCityCorporations(cityCorporationFilter);

  const [districtsList, setDistrictsList] = useState<Array<District> | []>([]);
  const [cityCorporationsList, setCityCorporationsList] = useState<
    Array<any> | []
  >([]);

  useEffect(() => {
    if (
      router?.query?.loc_division_id &&
      !isNaN(Number(router.query.loc_division_id))
    ) {
      changeDivisionAction(Number(router.query.loc_division_id));
    }
  }, [districts, cityCorporations]);

  const changeDivisionAction = useCallback(
    (divisionId: number) => {
      setDistrictsList(filterDistrictsByDivisionId(districts, divisionId));
      setCityCorporationsList(
        filterCityCorporationsByDivisionId(cityCorporations, divisionId),
      );
    },
    [districts, cityCorporations],
  );

  const authUser = useAuthUser<CommonAuthUser>();
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

  const deleteBranchItem = async (branchId: number) => {
    try {
      let response = await deleteBranch(branchId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='branch.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((prevToggle: any) => !prevToggle);
  }, [isToggleTable]);

  const [instituteFilter] = useState({});
  const {data: institutes} = useFetchAllInstitutes(
    authUser?.isSystemUser ? instituteFilter : null,
  );

  useEffect(() => {
    if (institutes) {
      setInstituteFilterItems(
        institutes.map((institute: any) => {
          return {
            id: institute.id,
            title: institute.title,
          };
        }),
      );
    }
  }, [institutes]);
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_BRANCHES,
  });
  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 400,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 400,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.address'] as string,
        field: 'address',
        width: 350,
        hide: true,
      },
      {
        headerName: messages['common.address_en'] as string,
        field: 'address_en',
        width: 300,
        hide: true,
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title',
        width: 150,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['divisions.label_en'] as string,
        field: 'division_title_en',
        width: 150,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['city_corporation.label'] as string,
        field: 'city_corporation_title',
        width: 250,
        hideable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return locale == LocaleLanguage.BN ? (
            <Typography>{data.city_corporation_title}</Typography>
          ) : (
            <Typography>{data.city_corporation_title_en} </Typography>
          );
        },
      },
      {
        headerName: messages['districts.label'] as string,
        field: 'district_title',
        width: 150,
        hideable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return locale == LocaleLanguage.BN ? (
            <Typography>{data.district_title}</Typography>
          ) : (
            <Typography>{data.district_title_en} </Typography>
          );
        },
      },
      {
        headerName: messages['label.upazila_or_municipality'] as string,
        field: 'upazila_municipality_title',
        width: 250,
        hideable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return locale == LocaleLanguage.BN ? (
            <Typography>{data.upazila_municipality_title}</Typography>
          ) : (
            <Typography>{data.upazila_municipality_title_en} </Typography>
          );
        },
      },
      {
        headerName: messages['institute.label'] as string,
        field: 'institute_title',
        width: 450,
        hide:
          locale == LocaleLanguage.EN ||
          !Boolean(authUser && authUser?.isSystemUser),
        filterable: Boolean(authUser && authUser?.isSystemUser),
        filter: {
          options: instituteFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'institute_id',
      },

      {
        headerName: messages['institute.label_en'] as string,
        field: 'institute_title_en',
        width: 450,
        hide:
          locale == LocaleLanguage.BN ||
          !Boolean(authUser && authUser?.isSystemUser),
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
              {branchPermission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {branchPermission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}

              {branchPermission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteBranchItem(data.id)}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale, instituteFilterItems, data],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconBranch /> <IntlMessages id='branch.label' />
          </>
        }
        extra={[
          branchPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['branch.label'],
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
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <AdditionalSelectFilterField
                  id='loc_division_id'
                  label={messages['divisions.label']}
                  isLoading={isLoadingDivisions}
                  options={divisions}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['loc_division_id'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['loc_division_id']: value,
                      loc_district_id: '',
                      loc_city_corporation_id: '',
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                    changeDivisionAction(value);
                  }}
                />

                <AdditionalSelectFilterField
                  id='loc_district_id'
                  label={messages['districts.label']}
                  isLoading={isLoadingDistricts}
                  options={districtsList}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['loc_district_id'] ?? ''}
                  onChange={(value) => {
                    let filters = {
                      ...additionalFilters,
                      ['loc_district_id']: value,
                      loc_city_corporation_id: '',
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
                <AdditionalSelectFilterField
                  id='loc_city_corporation_id'
                  label={messages['city_corporation.label']}
                  isLoading={isLoadingCityCorporations}
                  options={cityCorporationsList}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['loc_city_corporation_id'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['loc_city_corporation_id']: value,
                      loc_district_id: '',
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
              </>
            );
          }}
        />
        {isOpenAddEditModal && (
          <BranchAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <BranchDetailsPopup
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

export default BranchPage;
