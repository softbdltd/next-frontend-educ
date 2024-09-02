import React, {useCallback, useContext, useMemo, useState} from 'react';
import IntlMessages from '../../../@core/utility/IntlMessages';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import {useIntl} from 'react-intl';
import IconList from '../../../@core/icons/IconList';
import {API_ORGANIZATION_DIVISION_FAIR_APPLICATIONS} from '../../../@core/common/apiRoutes';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  approveSmeFairRegistration,
  rejectSmeFairRegistration,
} from '../../../services/organaizationManagement/OrganizationService';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {ApprovalStatus} from '../Institutes/ApprovalStatusEnums';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import CustomChipStatus from '../memberList/CustomChipStatus';
import {useFetchLocalizedDivisions} from '../../../services/locationManagement/hooks';
import {useRouter} from 'next/router';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {LINK_BACKEND_SME_DIVISION_FAIR_APPLICATION_MANAGEMENT} from '../../../@core/common/appLinks';

const DivisionFairManagementPage = () => {
  const {messages, locale, formatNumber} = useIntl();
  const {successStack} = useNotiStack();
  const router = useRouter();
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const {sme_fair_application: sme_fair_application_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const {data: divisions} = useFetchLocalizedDivisions();

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_ORGANIZATION_DIVISION_FAIR_APPLICATIONS,
  });

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const rejectFairApplication = async (id: number) => {
    let response = await rejectSmeFairRegistration(id);
    if (isResponseSuccess(response)) {
      {
        successStack(<IntlMessages id='organization.rejected' />);
      }
      refreshDataTable();
    }
  };

  const approveFairApplication = async (id: number) => {
    let response = await approveSmeFairRegistration(id);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_approved'
          values={{subject: <IntlMessages id='common.division_fair' />}}
        />,
      );
    }
    refreshDataTable();
  };

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.institute_name_bn'] as string,
        field: 'institute_name',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.institute_name_en'] as string,
        field: 'institute_name_en',
        width: 250,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['divisions.label'] as string,
        field: 'locations',
        width: 280,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          let divisionsArr: any[] = [];
          data?.locations?.forEach((division: any, index: number) => {
            const divisionData = divisions?.find(
              (item: any) => item.id == division.division_id,
            );
            divisionsArr.push(divisionData?.title);
          });
          console.log('divisionsArr', divisionsArr);
          return divisionsArr.join(', ').substring(0, 45) + '...';
        },
      },
      {
        headerName: messages[
          'sme_application_form.entrepreneur_name'
        ] as string,
        field: 'entrepreneur_name',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages[
          'sme_application_form.entrepreneur_name_en'
        ] as string,
        field: 'entrepreneur_name_en',
        width: 250,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.mobile_en'] as string,
        field: 'entrepreneur_mobile',
        width: 250,
        hide: true,
        filterable: true,
      },
      {
        headerName: messages['sme_application_form.stall_count'] as string,
        field: 'stall_count',
        width: 110,
        renderCell: (props: any) => {
          return formatNumber(props.row?.stall_count);
        },
      },
      {
        headerName: messages['applicationManagement.status'] as string,
        field: 'row_status',
        width: 200,
        sortable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 500,
        sortable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {sme_fair_application_permission?.canRead && (
                <ReadButton
                  onClick={() =>
                    router.push(
                      `${LINK_BACKEND_SME_DIVISION_FAIR_APPLICATION_MANAGEMENT}${data.id}`,
                    )
                  }
                />
              )}

              {data.row_status != ApprovalStatus.REJECTED ? (
                <>
                  {data?.row_status != ApprovalStatus.APPROVED &&
                    sme_fair_application_permission?.canUpdate && (
                      <ConfirmationButton
                        buttonType={'approve'}
                        confirmAction={() => approveFairApplication(data.id)}
                      />
                    )}
                  {data?.row_status != ApprovalStatus.REJECTED &&
                    sme_fair_application_permission?.canUpdate && (
                      <ConfirmationButton
                        buttonType={'reject'}
                        confirmAction={() => rejectFairApplication(data.id)}
                      />
                    )}
                </>
              ) : (
                <>
                  {sme_fair_application_permission?.canUpdate && (
                    <ConfirmationButton
                      buttonType={'approve'}
                      confirmAction={() => approveFairApplication(data.id)}
                    />
                  )}
                </>
              )}
            </DatatableButtonGroup>
          );
        },
      },
    ],
    [
      messages,
      locale,
      divisions,
      router,
      approveFairApplication,
      rejectFairApplication,
    ],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconList />{' '}
            <IntlMessages id='menu.division_sme_application_management' />
          </>
        }
        extra={[]}>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          showColumnToolbar={true}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
        />
      </PageContentBlock>
    </>
  );
};

export default DivisionFairManagementPage;
