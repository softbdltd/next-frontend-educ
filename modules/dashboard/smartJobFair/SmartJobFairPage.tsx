import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {Link} from '../../../@core/elements/common';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconDistrict from '../../../@core/icons/IconDistrict';
import {API_SMART_JOB_FAIR} from '../../../@core/common/apiRoutes';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import {useRouter} from 'next/router';
import {
  LINK_SMART_JOB_FAIR_CREATE,
  LINK_SMART_JOB_FAIR_DETAILS,
  LINK_SMART_JOB_FAIR_EDIT,
} from '../../../@core/common/appLinks';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import {
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
} from '../../../services/locationManagement/hooks';
import RowStatus from '../users/RowStatus';
import {filterDistrictsByDivisionId} from '../../../services/locationManagement/locationUtils';
import {District} from '../../../shared/Interface/location.interface';
import {useFetchConstituencies} from '../../../services/cmsManagement/hooks';

const DistrictsPage = () => {
  const router = useRouter();
  const {messages, locale} = useIntl();
  const [additionalFilters, setAdditionalFilters] = useState<any>({});
  const [divisionsFilter] = useState({row_status: RowStatus.ACTIVE});
  const [districtsFilter] = useState({row_status: RowStatus.ACTIVE});
  const [constituenciesFilter, setConstituenciesFilter] = useState<any>(null);

  const {data: divisions, isLoading: isLoadingDivisions} =
    useFetchLocalizedDivisions(divisionsFilter);
  const {data: districts, isLoading: isLoadingDistricts} =
    useFetchLocalizedDistricts(districtsFilter);
  const {data: parliamentAreas, isLoading: isParliamentAreaLoading} =
    useFetchConstituencies(constituenciesFilter);

  const [districtsList, setDistrictsList] = useState<Array<District> | []>([]);

  const {district: districtPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  const [isToggleTable] = useState<boolean>(false);

  const changeDivisionAction = useCallback(
    (divisionId: number) => {
      setDistrictsList(filterDistrictsByDivisionId(districts, divisionId));
    },
    [districts],
  );

  const handleDistrictChange = useCallback((districtId: any) => {
    setConstituenciesFilter(
      districtId
        ? {
            loc_district_id: districtId,
          }
        : null,
    );
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title',
        width: 140,
        filterable: false,
      },
      {
        headerName: messages['districts.label'] as string,
        field: 'district_title',
        width: 150,
        filterable: false,
      },
      {
        headerName: messages['common.parliament_area'] as string,
        field: 'constituency_name',
        width: 150,
        filterable: false,
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 400,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              <ReadButton
                onClick={() => {
                  router.push(LINK_SMART_JOB_FAIR_DETAILS + `${data.id}`);
                }}
              />

              <EditButton
                onClick={() => {
                  router.push(LINK_SMART_JOB_FAIR_EDIT + `${data.id}`);
                }}
              />
            </DatatableButtonGroup>
          );
        },
      },
    ],
    [messages, locale],
  );
  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_SMART_JOB_FAIR,
  });

  console.log('data', data);

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconDistrict /> <IntlMessages id='common.smart_job_fair' />
          </>
        }
        extra={[
          districtPermission.canCreate ? (
            <Link key={1} href={LINK_SMART_JOB_FAIR_CREATE}>
              <AddButton
                key={1}
                onClick={() => {}}
                isLoading={false}
                tooltip={
                  <IntlMessages
                    id={'common.add_new'}
                    values={{
                      subject: messages['menu.smart_job_fair'],
                    }}
                  />
                }
              />
            </Link>
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
                      loc_constituency_id: '',
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
                      loc_constituency_id: '',
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                    handleDistrictChange(value);
                  }}
                />
                <AdditionalSelectFilterField
                  id='loc_constituency_id'
                  label={messages['common.parliament_area']}
                  isLoading={isParliamentAreaLoading}
                  options={parliamentAreas}
                  valueFieldName={'id'}
                  labelFieldNames={['constituency_name']}
                  value={routeValue['loc_constituency_id'] ?? ''}
                  onChange={(value) => {
                    let filters = {
                      ...additionalFilters,
                      ['loc_constituency_id']: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
              </>
            );
          }}
        />
      </PageContentBlock>
    </>
  );
};

export default DistrictsPage;
