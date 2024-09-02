import GradeIcon from '@mui/icons-material/Grade';
import PreviewIcon from '@mui/icons-material/Preview';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {API_CERTIFICATES_ISSUE} from '../../../@core/common/apiRoutes';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import {useFetchLocalizedBatches} from '../../../services/instituteManagement/hooks';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {Link} from '../../../@core/elements/common';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import RowStatus from '../../../@core/utilities/RowStatus';

const CertificateIssuedPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const authUser = useAuthUser();

  const [additionalFilters, setAdditionalFilters] = useState<any>({});
  const [batchFilters, setBatchFilters] = useState<any>(null);

  const {certificate_issued: certificate_issuedPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const {data: batches, isLoading: isLoadingBatches} =
    useFetchLocalizedBatches(batchFilters);

  useEffect(() => {
    let params: any = {row_status: RowStatus.ACTIVE};
    if (authUser?.isCoordinatorUser || authUser?.isOrganizationUser) {
      params.is_apprenticeship = 1;
    }
    setBatchFilters(params);
  }, [authUser]);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['learner.username'] as string,
        field: 'learner_profile.username',
        width: 130,
        hide: false,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.username}</span>;
        },
      },
      {
        headerName: messages['common.first_name'] as string,
        field: 'learner_profile.first_name',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.first_name}</span>;
        },
      },
      {
        headerName: messages['common.first_name_en'] as string,
        field: 'learner_profile.first_name_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.first_name_en}</span>;
        },
      },
      {
        headerName: messages['common.last_name'] as string,
        field: 'learner_profile.last_name',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.last_name}</span>;
        },
      },
      {
        headerName: messages['common.last_name_en'] as string,
        field: 'learner_profile.last_name_en',
        width: 250,
        sortable: false,
        hide: locale == LocaleLanguage.BN,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.last_name_en}</span>;
        },
      },
      {
        headerName: messages['learner.mobile'] as string,
        field: 'learner_profile.mobile',
        hide: false,
        width: 150,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.mobile}</span>;
        },
      },
      {
        headerName: messages['learner.email'] as string,
        field: 'learner_profile.email',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{data?.learner_profile?.email}</span>;
        },
      },
      {
        headerName: messages['certificate.issued_date'] as string,
        field: 'issued_at',
        width: 130,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return data.issued_at ? (
            <span>
              {getIntlDateFromString(formatDate, data.issued_at, 'short')}
            </span>
          ) : (
            <></>
          );
        },
      },
      {
        headerName: messages['certificate.name_bn'] as string,
        field: 'certificate_title',
        width: 200,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['certificate.name_en'] as string,
        field: 'certificate_title_en',
        width: 200,
        hide: locale == LocaleLanguage.BN,
      },

      {
        headerName: messages['common.batch_name'] as string,
        width: 200,
        field: 'batch_title',
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['4ir.assessment_batch_en'] as string,
        field: 'batch_title_en',
        width: 200,
        // filter: 'selectFilter',
        // selectFilterItems: batchFilterItems,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['batches.start_date'] as string,
        field: 'batch_start_date',
        width: 150,
        renderCell: (props: any) => {
          let data = props.row;
          return data.batch_start_date ? (
            <span>
              {getIntlDateFromString(
                formatDate,
                data.batch_start_date,
                'short',
              )}
            </span>
          ) : (
            <></>
          );
        },
        hide: true,
      },
      {
        headerName: messages['batches.end_date'] as string,
        field: 'batch_end_date',
        width: 150,
        renderCell: (props: any) => {
          let data = props.row;
          return data.batch_end_date ? (
            <span>
              {getIntlDateFromString(formatDate, data.batch_end_date, 'short')}
            </span>
          ) : (
            <></>
          );
        },
        hide: true,
      },
      {
        headerName: messages['applicationManagement.courseTitle'] as string,
        field: 'course_title',
        width: 250,
        hide: locale == LocaleLanguage.EN,
      },

      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 300,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {certificate_issuedPermission.canRead && (
                <Link
                  href={`/certificate/certificate-view/${data.id}`}
                  passHref={true}>
                  <CommonButton
                    btnText='common.certificate_view'
                    startIcon={<PreviewIcon style={{marginLeft: '5px'}} />}
                    style={{marginLeft: '10px'}}
                    variant='outlined'
                    color='primary'
                  />
                </Link>
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
    urlPath: API_CERTIFICATES_ISSUE,
    paramsValueModifier: (params) => {
      params.purpose = 'BATCH';
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <GradeIcon /> <IntlMessages id='certificate.certificate_issued' />
          </>
        }>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          showColumnToolbar={true}
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <AdditionalSelectFilterField
                  id='batch_id'
                  label={messages['batches.label']}
                  isLoading={isLoadingBatches}
                  options={batches}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['purpose_id'] ?? ''}
                  onChange={(value) => {
                    let filters = {
                      ...additionalFilters,
                      ['purpose_id']: value,
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

export default CertificateIssuedPage;
