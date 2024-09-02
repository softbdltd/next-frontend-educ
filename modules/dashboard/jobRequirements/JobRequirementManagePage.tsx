import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {useFetchHumanResourceDemand} from '../../../services/IndustryManagement/hooks';
import {Button} from '@mui/material';
import React, {useCallback, useMemo, useState} from 'react';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import Link from 'next/link';
import DoneIcon from '@mui/icons-material/Done';
import BackButton from '../../../@core/elements/button/BackButton';
import RejectButton from '../../../@core/elements/button/RejectButton/RejectButton';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {rejectInstituteJobRequirement} from '../../../services/IndustryManagement/JobRequirementService';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import PersonIcon from '@mui/icons-material/Person';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {API_INSTITUTE_HUMAN_RESOURCE_DEMANDS} from '../../../@core/common/apiRoutes';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';

const JobRequirementManagePage = () => {
  const {successStack, errorStack} = useNotiStack();
  const {messages, locale} = useIntl();
  const router = useRouter();
  const {jobRequirementId} = router.query;

  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const {data: humanResourceDemandData} = useFetchHumanResourceDemand(
    Number(jobRequirementId),
  );

  const canRejectApprove = useCallback((data: any) => {
    return (
      data?.vacancy_provided_by_institute > 0 && !data?.rejected_by_institute
    );
  }, []);

  const rejectAction = async (itemId: number) => {
    try {
      let response = await rejectInstituteJobRequirement(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_rejected'
            values={{subject: <IntlMessages id='common.institute' />}}
          />,
        );

        refreshDataTable();
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
        headerName: messages['institute.label'] as string,
        field: 'institute_title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['institute.label'] as string,
        field: 'institute_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['common.vacancy'] as string,
        field: 'hr_demand.vacancy',
        width: 250,
        renderCell: (props: any) => {
          let data: any = props.row;
          return (
            <CustomChip
              icon={<PersonIcon fontSize={'small'} />}
              color={'primary'}
              label={data.hr_demand?.vacancy}
            />
          );
        },
      },
      {
        headerName: messages['common.provided_vacancy_by_institute'] as string,
        field: 'vacancy_provided_by_institute',
        width: 250,
        renderCell: (props: any) => {
          let data: any = props.row;
          return (
            <CustomChip
              icon={<PersonIcon fontSize={'small'} />}
              color={'primary'}
              label={data.vacancy_provided_by_institute}
            />
          );
        },
      },
      {
        headerName: messages['common.approved_vacancy'] as string,
        field: 'vacancy_approved_by_industry_association',
        width: 250,
        renderCell: (props: any) => {
          let data: any = props.row;
          return (
            <CustomChip
              icon={<PersonIcon fontSize={'small'} />}
              color={'primary'}
              label={data.vacancy_approved_by_industry_association}
            />
          );
        },
      },
      {
        headerName: messages['job_requirement.institute_step'] as string,
        field: 'rejected_by_institute',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          let step: any = '';
          let btnColor: any = undefined;

          if (
            data?.rejected_by_institute == 0 &&
            data?.vacancy_provided_by_institute == 0
          ) {
            step = messages['common.pending'];
            btnColor = 'primary';
          } else if (data?.rejected_by_institute) {
            step = messages['common.rejected'];
            btnColor = 'error';
          } else {
            step = messages['common.approved'];
            btnColor = 'success';
          }
          return (
            <CustomChip label={step} variant={'filled'} color={btnColor} />
          );
        },
      },
      {
        headerName: messages[
          'job_requirement.industry_association_step'
        ] as string,
        field: 'rejected_by_industry_association',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          let step: any = '';
          let btnColor: any = undefined;

          if (
            data?.rejected_by_industry_association == 0 &&
            data?.vacancy_approved_by_industry_association == 0
          ) {
            step = messages['common.pending'];
            btnColor = 'primary';
          } else if (data?.rejected_by_industry_association) {
            step = messages['common.rejected'];
            btnColor = 'error';
          } else {
            step = messages['common.approved'];
            btnColor = 'success';
          }
          return (
            <CustomChip label={step} variant={'filled'} color={btnColor} />
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          const APPROVE_LEARNERS_PAGE_URL =
            '/job-requirement/learner-approval/' + data.id;
          return (
            canRejectApprove(data) && (
              <DatatableButtonGroup>
                <Link href={APPROVE_LEARNERS_PAGE_URL} passHref>
                  <Button
                    variant={'outlined'}
                    size={'small'}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      marginRight: '15px',
                    }}
                    startIcon={<DoneIcon />}>
                    {messages['button.learner_approve']}
                  </Button>
                </Link>
                {!data?.rejected_by_industry_association && (
                  <RejectButton
                    variant={'outlined'}
                    size={'small'}
                    itemId={data.id}
                    rejectTitle={messages['common.learner'] as string}
                    rejectAction={rejectAction}>
                    {messages['common.reject']}
                  </RejectButton>
                )}
              </DatatableButtonGroup>
            )
          );
        },
        sortable: false,
      },
    ],
    [messages, locale],
  );

  const {
    onFetchData,
    data: HRDemandInstitutes,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath: API_INSTITUTE_HUMAN_RESOURCE_DEMANDS,
    paramsValueModifier: (params: any) => {
      params['hr_demand_id'] = jobRequirementId;
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <IntlMessages
            id='common.org_job_requirements'
            values={{subject: humanResourceDemandData?.organization_title}}
          />
        }
        extra={[<BackButton key={1} url={'/job-requirement'} />]}>
        <DataTable
          columns={columns}
          data={HRDemandInstitutes || []}
          fetchData={onFetchData}
          loading={loading}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          showColumnToolbar={true}
        />
      </PageContentBlock>
    </>
  );
};

export default JobRequirementManagePage;
