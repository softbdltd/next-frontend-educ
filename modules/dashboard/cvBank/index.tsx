import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';
import {API_SKILLS, API_LEARNERS} from '../../../@core/common/apiRoutes';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import Genders from '../../../@core/utilities/Genders';
import {useRouter} from 'next/router';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import {FiUser} from 'react-icons/fi';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {useFetchEducationExamsBoardsEduGroupsAndSubjects} from '../../../services/learnerManagement/hooks';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import {Link} from '../../../@core/elements/common';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import TextFilterField from '../../../@core/components/DataTable/TextFilterField';
import localeLanguage from '../../../@core/utilities/LocaleLanguage';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {Tooltip, Typography} from '@mui/material';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import {
  useFetchLocalizedDivisions,
  useFetchLocalizedDistricts,
  useFetchCityCorporations,
} from '../../../services/locationManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {
  filterDistrictsByDivisionId,
  filterCityCorporationsByDivisionId,
} from '../../../services/locationManagement/locationUtils';
import DownloadIcon from '@mui/icons-material/Download';
import {getCVBankFileExport} from '../../../services/learnerManagement/YouthService';

const CVBankPage = () => {
  const {messages, locale, formatDate} = useIntl();
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
  const {data: educationsData, isLoading: isLoadingEducationsData} =
    useFetchEducationExamsBoardsEduGroupsAndSubjects();

  const [districtsList, setDistrictsList] = useState<Array<any> | []>([]);
  const [cityCorporationsList, setCityCorporationsList] = useState<
    Array<any> | []
  >([]);

  const changeDivisionAction = useCallback(
    (divisionId: number) => {
      setDistrictsList(filterDistrictsByDivisionId(districts, divisionId));
      setCityCorporationsList(
        filterCityCorporationsByDivisionId(cityCorporations, divisionId),
      );
    },
    [districts, cityCorporations],
  );

  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    if (
      router?.query?.loc_division_id &&
      !isNaN(Number(router.query.loc_division_id))
    ) {
      changeDivisionAction(Number(router.query.loc_division_id));
    }
  }, [districts, cityCorporations]);

  const getGenderTitle = (genderNumber: string) => {
    switch (String(genderNumber)) {
      case Genders.MALE:
        return messages['common.male'];
      case Genders.FEMALE:
        return messages['common.female'];
      case Genders.OTHERS:
        return messages['common.others'];
      default:
        return messages['common.notDefined'];
    }
  };

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['learner.username'] as string,
        field: 'username',
        hide: false,
        width: 250,
        sortable: true,
        filterable: true,
      },
      {
        headerName: messages['common.first_name'] as string,
        field: 'first_name',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.first_name_en'] as string,
        field: 'first_name_en',
        width: 250,
        sortable: true,
        filterable: false,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.last_name'] as string,
        field: 'last_name',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.last_name_en'] as string,
        field: 'last_name_en',
        width: 250,
        sortable: false,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['learner.gender'] as string,
        field: 'gender_label',
        hide: false,
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return <>{getGenderTitle(data.gender)}</>;
        },
      },
      {
        headerName: messages['learner.mobile'] as string,
        field: 'mobile',
        hide: false,
        width: 150,
        sortable: true,
      },
      {
        headerName: messages['skill.label'] as string,
        field: 'skill_ids',
        hide: false,
        width: 500,
        filterable: true,
        sortable: false,
        filter: {
          apiPath: API_SKILLS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: true,
        },
        renderCell: (props: any) => {
          const {skills} = props?.row;
          const skill_jsx = (skills || [])
            ?.map((skill: any) =>
              locale === localeLanguage.BN
                ? skill?.title ?? skill?.title_en
                : skill?.title_en ?? skill?.title,
            )
            .join(', ');
          return (
            <Tooltip title={skill_jsx} placement='top-start'>
              <p
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '480px',
                }}>
                {skill_jsx}
              </p>
            </Tooltip>
          );
        },
      },
      {
        headerName: messages['learner.email'] as string,
        field: 'email',
        width: 250,
        filterable: true,
        sortable: true,
        hide: true,
      },
      {
        headerName: messages['common.date_of_birth'] as string,
        field: 'date_of_birth',
        width: 250,
        filterable: true,
        dateRangeFilter: true,
        hide: false,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.date_of_birth ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.date_of_birth,
                    'short',
                  )}
                </Typography>
              ) : (
                <></>
              )}
            </>
          );
        },
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'division_title',
        width: 150,
        filterable: false,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['divisions.label_en'] as string,
        field: 'division_title_en',
        width: 150,
        filterable: false,
        sortable: true,
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
        headerName: messages['common.created'] as string,
        field: 'created_at',
        width: 150,
        sortable: true,
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <>{getIntlDateFromString(formatDate, data?.created_at)}</>;
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 100,
        sortable: false,
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
              <Link href={`${path}/${data?.id}`}>
                <CommonButton
                  btnText='applicationManagement.viewCV'
                  startIcon={<FiUser style={{marginLeft: '5px'}} />}
                  variant={'text'}
                />
              </Link>
            </DatatableButtonGroup>
          );
        },
        width: 150,
        sortable: false,
      },
    ],
    [messages],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_LEARNERS,
  });

  const urlToFile = (file: any, fileName: any) => {
    const href = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName); //or any other extension
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const fileDownloadHandler = async () => {
    try {
      let response = await getCVBankFileExport({
        page: router?.query?.page || 1,
        page_size: router?.query?.page_size || 10,
        search_text: router?.query?.search_text,
        loc_division_id: router?.query?.loc_division_id,
        loc_district_id: router?.query?.loc_district_id,
        loc_city_corporation_id: router?.query?.loc_city_corporation_id,
        username: router?.query?.username,
        email: router?.query?.email,
        date_of_birth_start: router?.query?.date_of_birth_start,
        date_of_birth_end: router?.query?.date_of_birth_end,
        skill_ids: router?.query?.skill_ids,
      });
      const fileName = `CV_Bank_Export_page_${router?.query?.page || 1}.xlsx`;

      urlToFile(response, fileName);
    } catch (e) {
      console.log(e);
    }
  };

  // console.log('education: ', educationFilter);

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconStaticPage /> <IntlMessages id='common.cv_bank' />
          </>
        }
        extra={[
          <>
            <CommonButton
              key={1}
              onClick={() => fileDownloadHandler()}
              btnText={'common.download_excel_file_paginated'}
              variant={'outlined'}
              color={'primary'}
              startIcon={<DownloadIcon />}
            />
          </>,
        ]}>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          showColumnToolbar={true}
          totalCount={totalCount}
          additionalFilterFieldsPosition={'start'}
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <TextFilterField
                  id={'search_text'}
                  label={messages['common.name']}
                  value={routeValue['search_text'] ?? ''}
                  onChange={(key: string, value: string) => {
                    let filters = {
                      ...additionalFilters,
                      [key]: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
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
                <AdditionalSelectFilterField
                  id='education_level_id'
                  label={messages['education.education_level']}
                  isLoading={isLoadingEducationsData}
                  options={educationsData?.education_level_with_degrees || []}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['education_level_id'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['education_level_id']: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                  multiSelect={false}
                />
              </>
            );
          }}
        />
      </PageContentBlock>
    </>
  );
};

export default CVBankPage;
