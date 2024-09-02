import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {API_COURSE_ENROLLMENTS} from '../../../@core/common/apiRoutes';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconUser from '../../../@core/icons/IconUser';
import Genders from '../../../@core/utilities/Genders';
import Router, {useRouter} from 'next/router';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import {FiUser} from 'react-icons/fi';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {
  useFetchBatch,
  useFetchBatchCertificateTemplates,
} from '../../../services/instituteManagement/hooks';
import {Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from '../../../@core/elements/common';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import ExamListPopup from './ExamListPopup';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {ICertificateIssue} from '../../../shared/Interface/certificates';
import {CERTIFICATE_TYPE} from '../certificate/Constants';
import {createCertificateIssue} from '../../../services/CertificateAuthorityManagement/CertificateIssueService';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import MenuButton from '../../../@core/elements/button/MenuButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import localeLanguage from '../../../@core/utilities/LocaleLanguage';
import RowStatus from '../../../@core/utilities/RowStatus';
import CourseEmploymentStatusUpdateModalPopUp from './CourseEmploymentStatusUpdatePopUp';
import Statuses from '../../../@core/utilities/EmploymentStatus';
import DownloadIcon from '@mui/icons-material/Download';
import {getBatchFileExport} from '../../../services/learnerManagement/YouthService';

const YouthPage = () => {
  const {messages, locale} = useIntl();
  const router = useRouter();
  const {successStack, errorStack} = useNotiStack();
  const path = router.asPath;
  const {batchId} = router.query;
  const [isApprenticeshipApplication] = useState<any>(
    router.pathname.includes('apprenticeship-batches'),
  );

  const {data: batch, isLoading} = useFetchBatch(Number(batchId));

  const {
    batch: batch_permission,
    certificate_template,
    certificate_issued,
    exam: exam_permission,
  } = useContext<PermissionContextPropsType>(PermissionContext);
  const employmentList = [
    {
      id: 1,
      title: messages['common.unemployed'] as string,
    },
    {
      id: 2,
      title: messages['common.employed'] as string,
    },
    {
      id: 3,
      title: messages['common.freelancer'] as string,
    },
    {
      id: 4,
      title: messages['common.entrepreneur'] as string,
    },
  ];

  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [selectedYouthId, setSelectedYouthId] = useState<number | null>(null);
  const [isOpenExamListModal, setIsOpenExamListModal] = useState(false);
  const [learnerName, setYouthName] = useState<string>('');
  const {data: certificateTemplates} =
    useFetchBatchCertificateTemplates(batchId);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const openAddEditModal = useCallback((itemId: number | null = null) => {
    setIsOpenAddEditModal(true);
    setSelectedItemId(itemId);
  }, []);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedItemId(null);
  }, []);

  const getGenderText = (gender: any) => {
    switch (String(gender)) {
      case Genders.MALE:
        return messages['common.male'];
      case Genders.FEMALE:
        return messages['common.female'];
      case Genders.OTHERS:
        return messages['common.others'];
      default:
        return '';
    }
  };

  const getEmploymentStatus = (status: any) => {
    switch (String(status)) {
      case Statuses.UNEMPLOYED:
        return messages['common.unemployed'];
      case Statuses.EMPLOYED:
        return messages['common.employed'];
      case Statuses.FREELANCER:
        return messages['common.freelancer'];
      case Statuses.ENTREPRENEUR:
        return messages['common.entrepreneur'];
      default:
        return '';
    }
  };

  const getMessage = (certificateType: any) => {
    switch (Number(certificateType)) {
      case CERTIFICATE_TYPE.PARTICIPATION:
        return messages['common.participate_certificate'];
      case CERTIFICATE_TYPE.GRADING:
        return messages['common.grading_certificate'];
      case CERTIFICATE_TYPE.MARKS:
        return messages['common.marking_certificate'];
      case CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT:
        return messages['common.competent_certificate'];
      default:
        return '';
    }
  };

  const getIssueMessage = (certificateType: any) => {
    switch (Number(certificateType)) {
      case CERTIFICATE_TYPE.PARTICIPATION:
        return messages['common.participate_certificate'];
      case CERTIFICATE_TYPE.GRADING:
        return messages['common.grading_certificate'];
      case CERTIFICATE_TYPE.MARKS:
        return messages['common.marking_certificate'];
      case CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT:
        return messages['common.competent_certificate'];
      default:
        return '';
    }
  };

  const getIssueMessageKey = (certificateType: any) => {
    switch (Number(certificateType)) {
      case CERTIFICATE_TYPE.PARTICIPATION:
        return 'common.participate_certificate';
      case CERTIFICATE_TYPE.GRADING:
        return 'common.grading_certificate';
      case CERTIFICATE_TYPE.MARKS:
        return 'common.marking_certificate';
      case CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT:
        return 'common.competent_certificate';
      default:
        return '';
    }
  };

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['learner.fullName'] as string,
        field: 'full_name',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          return locale == LocaleLanguage.BN
            ? data?.first_name + ' ' + data?.last_name
            : data?.first_name_en + ' ' + data?.last_name_en;
        },
        filterable: true,
        sortable: true,
        filterKey: 'first_name',
      },
      {
        headerName: messages['learner.gender'] as string,
        field: 'gender',
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          return getGenderText(data?.gender);
        },
        sortable: true,
        hide: true,
      },
      {
        headerName: messages['learner.mobile'] as string,
        field: 'mobile',
        width: 250,
        sortable: true,
        filterable: true,
        filterKey: 'mobile',
      },
      {
        headerName: messages['course.employment_status'] as string,
        field: 'employment_status',
        width: 250,
        sortable: false,
        filterable: true,
        filter: {
          options: employmentList,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          return getEmploymentStatus(data?.employment_status);
        },
      },
      {
        headerName: messages['learner.email'] as string,
        field: 'email',
        width: 250,
        hide: true,
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        hide: true,
        width: 100,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },

      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 660,
        renderCell: (props: any) => {
          let data = props.row;
          let learnerName = data?.first_name + ' ' + data?.last_name;
          let issuedCertificates = data?.issued_certificates ?? [];
          let today = new Date();
          today.setHours(0);
          today.setMinutes(0);
          today.setSeconds(0);
          today.setMilliseconds(0);
          let batchEnd = new Date(data?.batch_end_date);
          if (batchEnd) {
            batchEnd.setHours(0);
            batchEnd.setMinutes(0);
            batchEnd.setSeconds(0);
            batchEnd.setMilliseconds(0);
          }

          let isBatchEnd = today.getTime() > batchEnd?.getTime();

          let certificateViewItems: any = [];
          if (issuedCertificates.length > 0) {
            issuedCertificates.map((cert: any) => {
              let item: any = {};
              item.href = `/certificate/certificate-view/${cert.id}`;
              item.label = getMessage(cert.certificate_type);

              certificateViewItems.push(item);
            });
          }

          let certificateIssueItems: any = [];
          if (String(data?.row_status) == RowStatus.ACTIVE) {
            if (certificateTemplates?.length > 0) {
              certificateTemplates.map((cert: any) => {
                let issued = issuedCertificates.find(
                  (issueCert: any) =>
                    issueCert?.certificate_template_id == cert.id,
                );
                if (!issued) {
                  if (
                    (cert.certificate_type == CERTIFICATE_TYPE.PARTICIPATION &&
                      isBatchEnd) ||
                    (cert.certificate_type != CERTIFICATE_TYPE.PARTICIPATION &&
                      data?.result_published_at)
                  ) {
                    let item: any = {};
                    item.label = getIssueMessage(cert.certificate_type);
                    item.messageKey = getIssueMessageKey(cert.certificate_type);
                    item.onClick = async () => {
                      await issueCertificate(data, cert);
                    };

                    certificateIssueItems.push(item);
                  }
                }
              });
            }
          }

          return (
            <DatatableButtonGroup>
              <Link href={`${path}/learner-cv/${data?.learner_id}`} passHref={true}>
                <CommonButton
                  btnText='applicationManagement.viewCV'
                  startIcon={<FiUser style={{marginLeft: '5px'}} />}
                />
              </Link>
              {exam_permission.canReadAll && (
                <CommonButton
                  key={2}
                  onClick={() => openExamListModal(data.learner_id, learnerName)}
                  btnText={'common.exam_list'}
                  variant={'outlined'}
                  color={'primary'}
                  size={'small'}
                  style={{marginLeft: '20px'}}
                />
              )}
              {certificate_issued.canReadAll &&
                certificateIssueItems.length > 0 && (
                  <MenuButton
                    items={certificateIssueItems}
                    buttonText={
                      messages['certificate.certificate_issue_action'] as string
                    }
                    buttonProps={{
                      sx: {marginLeft: '20px'},
                    }}
                    hasConfirmButton={true}
                  />
                )}
              {certificateViewItems.length > 0 &&
                certificate_template.canRead && (
                  <MenuButton
                    items={certificateViewItems}
                    buttonText={messages['common.certificate_view'] as string}
                    buttonProps={{sx: {marginLeft: '20px'}}}
                  />
                )}

              {/*{certificate_template.canRead && (*/}
              {/*  <EditButton onClick={() => openAddEditModal(data.id)} />*/}
              {/*)}*/}

              {batch_permission.updateEmploymentStatus && (
                <CommonButton
                  onClick={() => openAddEditModal(data.id)}
                  btnText={'course.employment_status'}
                  key={1}
                  variant={'outlined'}
                  color={'primary'}
                  sx={{marginLeft: '10px'}}
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, certificateTemplates],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_COURSE_ENROLLMENTS,
    paramsValueModifier: (params: any) => {
      if (batchId) params['batch_id'] = batchId;
      if (isApprenticeshipApplication) params['is_apprenticeship'] = 1;
      params.with_issued_certificates = 1;
      return params;
    },
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
      let response = await getBatchFileExport(
        {
          page: router?.query?.page || 1,
          page_size: router?.query?.page_size || 10,
          first_name: router?.query?.first_name,
          mobile: router?.query?.mobile,
          employment_status: router?.query?.employment_status,
        },
        batchId,
      );
      const fileName = `Batch_export_page_${router?.query?.page || 1}.xlsx`;

      urlToFile(response, fileName);
    } catch (e) {
      console.log(e);
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const openExamListModal = useCallback(
    (learnerId: number, learnerName: string) => {
      setIsOpenExamListModal(true);
      setSelectedYouthId(learnerId);
      setYouthName(learnerName);
    },
    [],
  );

  const closeExamListModal = useCallback(() => {
    setIsOpenExamListModal(false);
    setSelectedYouthId(null);
  }, []);

  const issueCertificate = useCallback(
    async (data: any, certificateTemplate: any) => {
      const issueData: ICertificateIssue = {
        purpose_id: data.batch_id,
        purpose: 'BATCH',
        certificate_template_id: certificateTemplate.id,
        receiver_type: 'LEARNER',
        receiver_id: data.learner_id,
      };

      try {
        let response = await createCertificateIssue(issueData);
        if (isResponseSuccess(response)) {
          successStack(
            <IntlMessages
              id='common.certificate_issued_successfully'
              values={{
                subject: <IntlMessages id='certificate.certificate_issue' />,
              }}
            />,
          );
          refreshDataTable();
        }
      } catch (error: any) {
        processServerSideErrors({error, errorStack});
      }
    },
    [],
  );

  return (
    <>
      {!isLoading && (
        <PageContentBlock
          title={
            <>
              <IconUser /> <IntlMessages id='learner.label' />{' '}
              {`(${
                locale == localeLanguage.BN
                  ? batch.title ?? batch.title_en
                  : batch.title_en ?? batch.title
              })`}
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
              <Button
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                onClick={() => Router.back()}
                style={{float: 'right', marginLeft: '20px'}}>
                {messages['common.back']}
              </Button>
            </>,
          ]}>
          <DataTable
            columns={columns}
            data={data || []}
            fetchData={onFetchData}
            loading={loading}
            totalCount={totalCount}
            toggleResetTable={isToggleTable}
            showColumnToolbar={true}
          />
          {isOpenExamListModal && batch && selectedYouthId && (
            <ExamListPopup
              key={1}
              batchId={Number(batchId)}
              courseId={Number(batch.course_id)}
              learnerId={selectedYouthId}
              onClose={closeExamListModal}
              onOpen={openExamListModal}
              learnerName={learnerName}
            />
          )}
          {isOpenAddEditModal && (
            <CourseEmploymentStatusUpdateModalPopUp
              key={1}
              onClose={closeAddEditModal}
              itemId={selectedItemId}
              refreshDataTable={refreshDataTable}
            />
          )}
        </PageContentBlock>
      )}
    </>
  );
};

export default YouthPage;
