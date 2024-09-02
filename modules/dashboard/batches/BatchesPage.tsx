import {DownloadIcon} from '@heroicons/react/outline';
import {Done, Visibility} from '@mui/icons-material';
import {useRouter} from 'next/router';
import React, {useCallback, useContext, useMemo, useState} from 'react';
import {FiUserCheck} from 'react-icons/fi';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {LINK_BATCH_RESULT} from '../../../@core/common/appLinks';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconBatch from '../../../@core/icons/IconBatch';
import {
  getIntlDateFromString,
  isResponseSuccess,
} from '../../../@core/utilities/helpers';
import {
  API_BATCHES,
  API_COURSES,
  API_TRAINING_CENTERS,
} from '../../../@core/common/apiRoutes';
import {
  deleteBatch,
  processResult,
  publishResult,
} from '../../../services/instituteManagement/BatchService';
import BatchAddEditPopup from './BatchAddEditPopup';
import BatchDetailsPopup from './BatchDetailsPopup';
import {Link} from '../../../@core/elements/common';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import localeLanguage from '../../../@core/utilities/LocaleLanguage';
import {IBatch} from '../../../shared/Interface/institute.interface';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import CertificateTemplatePopup from './CertificateTemplateAddEditPopup';
import CourseEnrollmentPopup from './CourseEnrollmentPopup';
import ExamAssignToBatchPopup from './ExamAssignToBatchPopup';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {Typography} from '@mui/material';

const BatchesPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const router = useRouter();
  const path = router.pathname;
  const {
    batch: batch_permission,
    certificate_template,
    exam,
    other_permissions,
    course_enrollment,
    training_center,
  } = useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [selectedBatchItem, setSelectedBatchItem] = useState<IBatch | null>(
    null,
  );
  const [courseId, setCourseId] = useState<number>();

  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const [isOpenExamAssignModal, setIsOpenExamAssignModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPublishedAt, setResultPublishedAt] = useState<any>(null);
  const [isOpenAddEditTemplateModal, setIsOpenAddEditTemplateModal] =
    useState<boolean>(false);
  const [additionalFilters, setAdditionalFilters] = useState<any>({});

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

  const openImportModal = useCallback((courseId: number, batchId: number) => {
    setCourseId(courseId);
    setSelectedItemId(batchId);
    setIsOpenImportModal(true);
  }, []);

  const closeImportModal = useCallback(() => {
    setIsOpenImportModal(false);
  }, []);

  const openCertificateTemplateModal = useCallback((item: IBatch) => {
    setSelectedBatchItem(item);
    setIsOpenAddEditTemplateModal(true);
  }, []);

  const closeCertificateTemplateModal = useCallback(() => {
    setSelectedBatchItem(null);
    setIsOpenAddEditTemplateModal(false);
  }, []);

  const openExamAssignModal = useCallback(
    (itemId: number, resultPublishedAt: any) => {
      setIsOpenExamAssignModal(true);
      setSelectedItemId(itemId);
      setResultPublishedAt(resultPublishedAt);
    },
    [],
  );

  const closeExamAssignModal = useCallback(() => {
    setIsOpenExamAssignModal(false);
    setSelectedItemId(null);
  }, []);

  const deleteBatchItem = async (itemId: number) => {
    try {
      let response = await deleteBatch(itemId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='batches.label' />}}
          />,
        );

        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const courseAvailability = useMemo(() => {
    return [
      {id: 1, title: messages['common.running'] as string},
      // {id: 2, title: messages['common.upcoming'] as string},
      // {id: 3, title: messages['common.completed'] as string},
    ];
  }, [messages]);

  const publishAction = async (batchId: number) => {
    try {
      let data = {
        is_published: 1,
      };
      let response = await publishResult(batchId, data);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_publish_successfully'
            values={{subject: <IntlMessages id='common.batch_result' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error) {}
  };

  const processBatchResult = async (itemId: number) => {
    try {
      setIsProcessing(true);
      let response = await processResult(itemId);
      if (isResponseSuccess(response)) {
        successStack(messages['batch.process_result_success']);
        refreshDataTable();
      } else {
        let msg = messages['batch.process_result_failed'];
        let error_code = response?.data.error_code;
        if (error_code == 'no_exams') {
          msg = messages['batch.result_no_exams'];
        } else if (error_code == 'already_published') {
          msg = messages['batch.result_failed_already_published'];
        } else if (error_code == 'no_config') {
          msg = messages['batch.result_failed_no_config'];
        } else if (error_code == 'configured_exams_not_found') {
          msg = messages['batch.result_failed_configured_exams_not_found'];
        } else if (error_code == 'exams_not_finished') {
          msg = messages['batch.result_failed_exams_not_finished'];
        } else if (error_code == 'mark_update_not_complete') {
          msg = messages['batch.mark_update_not_complete'];
        }
        errorStack(msg);
      }
    } catch (error) {
      errorStack(messages['batch.process_result_failed']);
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['training_center.label'] as string,
        field: 'training_center_title',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
        filterable: training_center.canReadAll,
        filter: {
          apiPath: API_TRAINING_CENTERS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'training_center_id',
      },
      {
        headerName: messages['training_center.label_en'] as string,
        field: 'training_center_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName:
          locale == localeLanguage.BN
            ? (messages['course.label'] as string)
            : (messages['course.label_en'] as string),
        field: locale == localeLanguage.BN ? 'course_title' : 'course_title_en',
        width: 250,
        sortable: true,
        filterable: true,
        filter: {
          apiPath: API_COURSES,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'course_id',
        hide: locale == localeLanguage.EN,
      },
      {
        headerName: messages['batches.total_seat'] as string,
        field: 'number_of_seats',
        width: 150,
        sortable: true,
      },
      {
        headerName: messages['batches.available_seat'] as string,
        field: 'available_seats',
        width: 150,
        sortable: true,
      },
      {
        headerName: messages['batches.registration_start_date'] as string,
        field: 'registration_start_date',
        width: 250,
        sortable: false,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.registration_start_date ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.registration_start_date,
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
        headerName: messages['batches.registration_end_date'] as string,
        field: 'registration_end_date',
        width: 250,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.registration_end_date ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.registration_end_date,
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
        headerName: messages['batches.start_date'] as string,
        field: 'batch_start_date',
        width: 250,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.batch_start_date ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.batch_start_date,
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
        headerName: messages['batches.end_date'] as string,
        field: 'batch_end_date',
        hide: true,
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.batch_end_date ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.batch_end_date,
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
        headerName: messages['common.status'] as string,
        field: 'row_status',
        hide: true,
        width: 150,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 1500,
        sortable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {batch_permission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {batch_permission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {batch_permission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteBatchItem(data.id)}
                />
              )}
              {course_enrollment.canReadAll && (
                <Link href={`${path}/${data?.id}/learners`} passHref={true}>
                  <CommonButton
                    btnText='learner.label'
                    startIcon={<FiUserCheck style={{marginLeft: '5px'}} />}
                    style={{marginLeft: '10px'}}
                    variant='outlined'
                    color='primary'
                  />
                </Link>
              )}

              {other_permissions.course_enrollment_bulk_import && (
                <CommonButton
                  key={2}
                  onClick={() => openImportModal(data?.course_id, data?.id)}
                  btnText={'common.import'}
                  variant={'outlined'}
                  color={'primary'}
                  style={{marginLeft: '5px'}}
                  startIcon={<DownloadIcon />}
                />
              )}
              {certificate_template.canReadAll && (
                <CommonButton
                  btnText='common.certificate_template'
                  style={{marginLeft: '10px'}}
                  variant={
                    data?.certificate_templates &&
                    data?.certificate_templates?.length > 0
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => openCertificateTemplateModal(data)}
                  color='primary'
                />
              )}
              {exam.canReadAll && (
                <CommonButton
                  key={3}
                  onClick={() =>
                    openExamAssignModal(data?.id, data?.result_published_at)
                  }
                  btnText={'common.exam_list'}
                  variant={'outlined'}
                  color={'primary'}
                  style={{marginLeft: '5px'}}
                />
              )}
              {!data?.result_published_at && other_permissions.createResult && (
                <ConfirmationButton
                  buttonType={'approve'}
                  confirmAction={() => processBatchResult(data.id)}
                  buttonIcon={<Visibility />}
                  labelMessageKey={'batch.process_result'}
                  dialogTitle={messages['batch.process_result']}
                />
              )}
              {data.result_processed_at && other_permissions.readAllResult && (
                <Link href={`${LINK_BATCH_RESULT}${data.id}`} passHref={true}>
                  <CommonButton
                    key={4}
                    btnText={'common.batch_result'}
                    variant={'outlined'}
                    color={'primary'}
                    style={{marginLeft: '5px'}}
                    startIcon={<Visibility />}
                  />
                </Link>
              )}
              {data?.result_processed_at &&
                !data?.result_published_at &&
                other_permissions.createResult && (
                  <ConfirmationButton
                    buttonType={'approve'}
                    confirmAction={() => publishAction(data.id)}
                    buttonIcon={<Done />}
                    labelMessageKey={'exam.result_publish'}
                    dialogTitle={messages['exam.result_publish'] as string}
                  />
                )}
            </DatatableButtonGroup>
          );
        },
      },
    ],
    [messages, locale],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_BATCHES,
    paramsValueModifier: (params) => {
      if (router.query.availability) {
        params['availability'] = router.query.availability;
      }
      params.with_certificate_templates = 1;
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconBatch /> <IntlMessages id='batches.label' />
          </>
        }
        extra={[
          batch_permission.canCreate && (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['batches.label'],
                  }}
                />
              }
            />
          ),
        ]}>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading || isProcessing}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          showColumnToolbar={true}
          filterExpanded={false}
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <AdditionalSelectFilterField
                  id='availability'
                  label={messages['batch.availability']}
                  isLoading={false}
                  options={courseAvailability}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['availability'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['availability']: value,
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
          <BatchAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}
        {isOpenAddEditTemplateModal && selectedBatchItem && (
          <CertificateTemplatePopup
            key={5}
            onClose={closeCertificateTemplateModal}
            refreshDataTable={refreshDataTable}
            batch={selectedBatchItem}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <BatchDetailsPopup
            key={4}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}

        {isOpenImportModal && courseId && selectedItemId && (
          <CourseEnrollmentPopup
            key={2}
            courseId={courseId}
            batchId={selectedItemId}
            onClose={closeImportModal}
            userData={null}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenExamAssignModal && selectedItemId && (
          <ExamAssignToBatchPopup
            key={3}
            batchId={selectedItemId}
            onClose={closeExamAssignModal}
            resultPublishedAt={resultPublishedAt}
            openExamAssignModal={openExamAssignModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default BatchesPage;
