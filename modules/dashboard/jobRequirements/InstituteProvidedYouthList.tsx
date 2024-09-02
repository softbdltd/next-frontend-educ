import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {Button, Checkbox} from '@mui/material';
import {startCase as lodashStartCase} from 'lodash';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  approveYouths,
  rejectHRDemandYouth,
} from '../../../services/IndustryManagement/JobRequirementService';
import {ArrowBack} from '@mui/icons-material';
import {Link} from '../../../@core/elements/common';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import IndustryAssociationYouthApproval from '../../../@core/utilities/IndustryAssociationYouthApproval';
import {LINK_CV_BANK} from '../../../@core/common/appLinks';
import RejectButton from '../../../@core/elements/button/RejectButton/RejectButton';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import {ApprovalStatus} from './Constants/ApprovalStatusEnums';
import {
  API_HR_DEMAND_INSTITUTE_PROVIDED_LEARNER_LIST,
  FILE_SERVER_FILE_VIEW_ENDPOINT,
} from '../../../@core/common/apiRoutes';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';

const InstituteProvidedYouthList = () => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const router = useRouter();
  const {hrDemandInstituteId} = router.query;

  const [checkedYouths, setCheckedYouths] = useState<any>(new Set());
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const {
    onFetchData,
    data: learnerList,
    loading,
    totalCount,
  } = useFetchTableData({
    urlPath:
      API_HR_DEMAND_INSTITUTE_PROVIDED_LEARNER_LIST + '/' + hrDemandInstituteId,
  });

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, [isToggleTable]);

  useEffect(() => {
    if (learnerList && learnerList.length > 0) {
      const approvedYouths = learnerList
        .filter((learner: any) => {
          return (
            learner.approval_status == IndustryAssociationYouthApproval.APPROVED
          );
        })
        .map((learner: any) => learner.id);

      setCheckedYouths(new Set(approvedYouths));
    }
  }, [learnerList]);

  const handleYouthCheck = useCallback(
    (learnerId: number) => {
      const newApprovedYouths = [...checkedYouths];

      const index = newApprovedYouths.indexOf(learnerId);
      newApprovedYouths.includes(learnerId)
        ? newApprovedYouths.splice(index, 1)
        : newApprovedYouths.push(learnerId);

      setCheckedYouths(new Set(newApprovedYouths));
    },
    [checkedYouths],
  );

  const rejectAction = async (itemId: number) => {
    try {
      let response = await rejectHRDemandYouth(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_rejected'
            values={{subject: <IntlMessages id='common.learner_approval' />}}
          />,
        );
      }
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const submitYouthApproval = useCallback(async () => {
    try {
      await approveYouths(
        Number(hrDemandInstituteId),
        Array.from(checkedYouths),
      );
      successStack(
        messages['industry_association.learner_approved_successfully'],
      );
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  }, [learnerList, checkedYouths]);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.cv'] as string,
        field: 'cv_link',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          let URL = data?.cv_link;
          if (URL) {
            URL = FILE_SERVER_FILE_VIEW_ENDPOINT + URL;
          }

          return data?.learner_id ? (
            <Link href={LINK_CV_BANK + '/' + data.learner_id} target={'_blank'}>
              <CommonButton
                btnText={'learner_profile.label'}
                variant={'contained'}
              />
            </Link>
          ) : URL ? (
            <Link href={URL} target={'_blank'}>
              <CommonButton btnText={'common.see_cv'} variant={'contained'} />
            </Link>
          ) : (
            <></>
          );
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'approval_status',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          let step: any = '';
          let btnColor: any = undefined;

          switch (data.approval_status) {
            case ApprovalStatus.PENDING:
              step = messages['common.pending'];
              btnColor = 'primary';
              break;
            case ApprovalStatus.APPROVED:
              step = messages['common.approved'];
              btnColor = 'success';
              break;
            case ApprovalStatus.REJECTED:
              step = messages['common.rejected'];
              btnColor = 'error';
              break;
            default:
              step = messages['common.pending'];
              btnColor = 'primary';
          }

          return (
            <CustomChip label={step} variant={'filled'} color={btnColor} />
          );
        },
      },

      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        renderCell: (props: any) => {
          let data = props.row;

          return (
            <DatatableButtonGroup>
              <label style={{display: 'block', marginRight: '5px'}}>
                <Checkbox
                  value={data.id}
                  onChange={() => handleYouthCheck(data.id)}
                  checked={checkedYouths.has(data.id)}
                />
                {lodashStartCase(messages['common.accept'] as string)}
              </label>

              <RejectButton
                itemId={data.id}
                rejectTitle={messages['common.learner'] as string}
                rejectAction={rejectAction}>
                {messages['common.reject']}
              </RejectButton>
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, checkedYouths, learnerList],
  );

  return (
    <PageContentBlock
      title={messages['button.learner_approve']}
      extra={[
        <React.Fragment key={1}>
          <Button
            key={1}
            startIcon={<ArrowBack />}
            sx={{marginRight: '10px'}}
            variant={'outlined'}
            onClick={() => router.back()}>
            {messages['common.back']}
          </Button>
          <SubmitButton
            key={2}
            onClick={submitYouthApproval}
            isLoading={loading}
            label={messages['common.approve'] as string}
          />
        </React.Fragment>,
      ]}>
      <DataTable
        columns={columns}
        data={learnerList || []}
        fetchData={onFetchData}
        loading={loading}
        totalCount={totalCount}
        showColumnToolbar={true}
        toggleResetTable={isToggleTable}
      />
    </PageContentBlock>
  );
};

export default InstituteProvidedYouthList;
