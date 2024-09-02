import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {
  API_COURSE_ENROLLMENTS,
  API_TRAINING_CENTERS,
} from '../../../@core/common/apiRoutes';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconCourse from '../../../@core/icons/IconCourse';
import ApplicationDetailsPopup from './ApplicationDetailsPopup';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import {rejectEnrollment} from '../../../services/instituteManagement/RegistrationService';
import AssignBatchPopup from './AssignBatchPopup';
import {FiUserCheck} from 'react-icons/fi';
import CustomChipPaymentStatus from './CustomChipPaymentStatus';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import DataTable from '../../../@core/components/DataTable';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import TextFilterField from '../../../@core/components/DataTable/TextFilterField';
import {CheckCircleOutline} from '@mui/icons-material';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import {useRouter} from 'next/router';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import BulkAssignBatchPopup from './BulkAssignBatchPopup';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import {
  useFetchBatchesWithParams,
  useFetchLocalizedCourses,
} from '../../../services/instituteManagement/hooks';
import RowStatus from '../users/RowStatus';
import DownloadIcon from '@mui/icons-material/Download';
import {getEnrollmentFileExportFormat} from '../../../services/instituteManagement/EnrollmentExportImportService';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';

const ApplicationManagementPage = () => {
  const {messages, locale} = useIntl();
  const {successStack} = useNotiStack();
  const router = useRouter();
  const authUser = useAuthUser<CommonAuthUser>();

  const {course_enrollment: course_enrollment_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  // const [selectedRowStatus, setSelectedRowStatus] = useState<any>({});
  const [selectedTrainingCenterId, setSelectedTrainingCenterId] = useState<
    number | null
  >(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const [isOpenBatchAssignModal, setIsOpenBatchAssignModal] = useState(false);
  const [isExtraButtonAndMultiSelectShow, setIsExtraButtonAndMultiSelectShow] =
    useState<boolean>(false);
  const [isOpenBalkBatchAssignModal, setIsOpenBalkBatchAssignModal] =
    useState(false);
  const [additionalFilters, setAdditionalFilters] = useState<any>({});
  const [courseFilter] = useState({row_status: RowStatus.ACTIVE});
  const [batchFilter, setBatchFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  const [selectedItems, setSelectedItems] = useState<any>([]);
  const {data: courses, isLoading: isLoadingCourse} =
    useFetchLocalizedCourses(courseFilter);
  const {data: batches, isLoading: isLoadingBatch} =
    useFetchBatchesWithParams(batchFilter);

  const changeCourseAction = useCallback(
    (courseId: number) => {
      setBatchFilter({course_id: courseId});
    },
    [courses],
  );

  /** details modal */
  const openDetailsModal = useCallback((itemId: number) => {
    setIsOpenDetailsModal(true);
    setSelectedItemId(itemId);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  /** Assign Batch Modal */
  const openAssignBatchModal = useCallback(
    (itemId: number | null = null, courseId: number | null = null) => {
      setIsOpenDetailsModal(false);
      setSelectedItemId(itemId);
      setSelectedCourseId(courseId);
      setIsOpenBatchAssignModal(true);
    },
    [],
  );

  const closeAssignBatchModal = useCallback(() => {
    setIsOpenBatchAssignModal(false);
    setSelectedItemId(null);
  }, []);

  const closeBulkAssignBatchModal = useCallback(() => {
    setIsOpenBalkBatchAssignModal(false);
  }, []);

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, [isToggleTable]);

  /** Method called to reject an application */
  const rejectCourseEnrollment = async (enrollment_id: number) => {
    let response = await rejectEnrollment(enrollment_id);
    if (isResponseSuccess(response)) {
      {
        successStack(<IntlMessages id='applicationManagement.rejected' />);
      }
      refreshDataTable();
    }
  };

  useEffect(() => {
    if (authUser?.training_center_id) {
      setSelectedTrainingCenterId(authUser?.training_center_id);
    } else {
      setSelectedTrainingCenterId(
        router.query?.training_center_id
          ? Number(router.query.training_center_id)
          : null,
      );
    }

    setSelectedCourseId(
      router.query?.course_id ? Number(router.query.course_id) : null,
    );

    (router?.query?.training_center_id || authUser?.training_center_id) &&
    router.query?.course_id
      ? setIsExtraButtonAndMultiSelectShow(true)
      : setIsExtraButtonAndMultiSelectShow(false);
  }, [router.query]);

  const onExtraButtonClick = useCallback(() => {
    setIsOpenBalkBatchAssignModal(true);
    setIsOpenDetailsModal(false);
  }, []);

  const statusFilter = useMemo(
    () => [
      // {
      //   id: 0,
      //   title: messages['common.inactive'],
      // },
      {
        id: 1,
        title: messages['common.approved'],
      },
      {
        id: 2,
        title: messages['common.pending'],
      },
      {
        id: 3,
        title: messages['common.rejected'],
      },
    ],
    [locale],
  );

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['applicationManagement.course'] as string,
        field: 'course_title',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['applicationManagement.courseTitle_en'] as string,
        field: 'course_title_en',
        width: 250,
        sortable: true,
        filterable: false,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['menu.batch'] as string,
        field: 'batch_title',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['menu.batch_en'] as string,
        field: 'batch_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages[
          'applicationManagement.applicantFullName_en'
        ] as string,
        field: 'full_name_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
        filterable: false,
        valueGetter: (params: any) => {
          return params.row?.first_name_en + ' ' + params.row?.last_name_en;
        },
      },
      {
        headerName: messages[
          'applicationManagement.applicantFullName'
        ] as string,
        field: 'full_name',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
        filterable: false,
        valueGetter: (params: any) => {
          return params.row?.first_name + ' ' + params.row?.last_name;
        },
      },
      {
        headerName: messages['common.training_center'] as string,
        field: 'training_center_title',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN || !!authUser?.training_center_id,
        filterable: !authUser?.training_center_id,
        filter: {
          apiPath: API_TRAINING_CENTERS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'training_center_id',
        hideable: !authUser?.training_center_id,
      },
      {
        headerName: messages['common.training_center_en'] as string,
        field: 'training_center_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN || !!authUser?.training_center_id,
        filterable: false,
        hideable: !authUser?.training_center_id,
      },
      {
        headerName: messages['common.email'] as string,
        width: 200,
        field: 'email',
        hide: false,
      },
      {
        headerName: messages['common.mobile'] as string,
        field: 'mobile',
        width: 150,
        hide: false,
      },
      {
        headerName: messages['common.paymentStatus'] as string,
        field: 'payment_status',
        width: 200,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return Number(data?.course_fee) == 0 ? (
            <CustomChip
              icon={<CheckCircleOutline />}
              color={'success'}
              label={<IntlMessages id='common.free_course' />}
            />
          ) : (
            <CustomChipPaymentStatus value={data?.payment_status} />
          );
        },
      },
      {
        headerName: messages['applicationManagement.status'] as string,
        field: 'row_status',
        width: 150,
        sortable: false,
        filterable: true,
        filter: {
          options: statusFilter,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          if (data.row_status === 0) {
            return <p>{messages['common.inactive']}</p>;
          } else if (data.row_status === 1) {
            return <p>{messages['common.approved']}</p>;
          } else if (data.row_status === 2) {
            return <p>{messages['common.pending']}</p>;
          } else {
            return <p>{messages['common.rejected']}</p>;
          }
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 400,
        sortable: false,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {course_enrollment_permissions.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}

              {course_enrollment_permissions.canCreate && (
                <CommonButton
                  onClick={() => openAssignBatchModal(data.id, data.course_id)}
                  btnText='applicationManagement.assignBatch'
                  startIcon={<FiUserCheck style={{marginLeft: '5px'}} />}
                  color='secondary'
                />
              )}

              {data.row_status !== 3 &&
              course_enrollment_permissions.canUpdate ? (
                <ConfirmationButton
                  buttonType={'reject'}
                  labelMessageKey={'applicationManagement.reject'}
                  confirmAction={() => rejectCourseEnrollment(data.id)}
                />
              ) : (
                ''
              )}
            </DatatableButtonGroup>
          );
        },
      },
    ],
    [messages, locale],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_COURSE_ENROLLMENTS,
    paramsValueModifier: (params: any) => {
      if (router.query.course_id) params['course_id'] = router.query.course_id;

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
      let response = await getEnrollmentFileExportFormat({
        page: router?.query?.page || 1,
        page_size: router?.query?.page_size || 10,
        search_text: router?.query?.search_text,
        course_id: router?.query?.course_id,
        batch_id: router?.query?.batch_id,
        training_center_id: router?.query?.training_center_id,
        row_status: router?.query?.row_status,
      });
      const fileName = `course_enrollment_bulk_page_${
        router?.query?.page || 1
      }.xlsx`;

      urlToFile(response, fileName);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconCourse /> <IntlMessages id='applicationManagement.label' />
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
          data={data || []}
          // defaultFilters={selectedRowStatus}
          fetchData={onFetchData}
          loading={loading}
          showColumnToolbar={true}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          additionalFilterFieldsPosition={'start'}
          gridMultiSelect={isExtraButtonAndMultiSelectShow}
          selectedItemIds={selectedItems}
          onGridSelectionChange={setSelectedItems}
          additionalButton={
            isExtraButtonAndMultiSelectShow &&
            selectedItems?.length > 0 &&
            course_enrollment_permissions.canCreate ? (
              <CommonButton
                onClick={() => onExtraButtonClick()}
                btnText='applicationManagement.assignBatch'
                startIcon={<FiUserCheck style={{marginLeft: '5px'}} />}
                color='secondary'
                variant={'outlined'}
                size={'small'}
                sx={{marginBottom: '5px'}}
              />
            ) : (
              <></>
            )
          }
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <TextFilterField
                  id={'search_text'}
                  label={messages['common.search_text']}
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
                  id='course_id'
                  label={messages['applicationManagement.course']}
                  isLoading={isLoadingCourse}
                  options={courses}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['course_id'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['course_id']: value,
                      ['batch_id']: '',
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                    changeCourseAction(value);
                  }}
                />
                <AdditionalSelectFilterField
                  id='batch_id'
                  label={messages['menu.batch']}
                  isLoading={isLoadingBatch}
                  options={batches}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['batch_id'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['batch_id']: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
              </>
            );
          }}
        />
        {isOpenBatchAssignModal && selectedCourseId && (
          <AssignBatchPopup
            key={1}
            onClose={closeAssignBatchModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
            courseId={selectedCourseId}
          />
        )}
        {isOpenBalkBatchAssignModal &&
          selectedCourseId &&
          selectedTrainingCenterId && (
            <BulkAssignBatchPopup
              key={2}
              onClose={closeBulkAssignBatchModal}
              itemIds={selectedItems}
              refreshDataTable={refreshDataTable}
              courseId={selectedCourseId}
              trainingCenterId={selectedTrainingCenterId}
            />
          )}
        {isOpenDetailsModal && selectedItemId && (
          <ApplicationDetailsPopup
            key={3}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default ApplicationManagementPage;
