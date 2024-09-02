import React, {useCallback, useContext, useMemo, useState} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconExam from '../../../@core/icons/IconExam';
import {Link} from '../../../@core/elements/common';
import {API_EXAM_SUBJECTS, API_EXAMS} from '../../../@core/common/apiRoutes';
import {ExamTypes} from './ExamEnums';
import {useRouter} from 'next/router';
import {
  isResponseSuccess,
  getMomentDateFormat,
} from '../../../@core/utilities/helpers';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  deleteExam,
  publishExam,
} from '../../../services/instituteManagement/ExamService';
import {
  LINK_EXAM_CREATE,
  LINK_EXAM_DETAILS,
  LINK_EXAM_UPDATE,
} from '../../../@core/common/appLinks';
import {CheckCircleOutline} from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import DataTable from '../../../@core/components/DataTable';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {Typography} from '@mui/material';

const ExamPage = () => {
  const {messages, locale} = useIntl();
  const {successStack} = useNotiStack();
  const router = useRouter();
  const {exam: exam_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  const deleteExamItem = async (examId: number) => {
    try {
      let response = await deleteExam(examId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='exam.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error) {}
  };

  const publishAction = async (examId: number) => {
    try {
      let data = {
        is_published: 1,
      };
      let response = await publishExam(examId, data);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_publish_successfully'
            values={{subject: <IntlMessages id='exam.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error) {}
  };

  const unPublishAction = async (examId: number) => {
    try {
      let data = {
        is_published: 0,
      };
      let response = await publishExam(examId, data);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_publish_successfully'
            values={{subject: <IntlMessages id='exam.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error) {}
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((previousToggle) => !previousToggle);
  }, []);

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_EXAMS,
  });

  const examType = (type: any) => {
    switch (Number(type)) {
      case ExamTypes.ONLINE:
        return messages['common.online'];
      case ExamTypes.OFFLINE:
        return messages['common.offline'];
      case ExamTypes.MIXED:
        return messages['common.mixed'];
      case ExamTypes.PRACTICAL:
        return messages['common.practical'];
      case ExamTypes.FIELDWORK:
        return messages['common.field_work'];
      case ExamTypes.PRESENTATION:
        return messages['common.presentation'];
      case ExamTypes.ASSIGNMENT:
        return messages['common.assignment'];
      default:
        return '';
    }
  };

  const examTypeFilter = useMemo(
    () => [
      {
        id: ExamTypes.ONLINE,
        title: messages['common.online'],
      },
      {
        id: ExamTypes.OFFLINE,
        title: messages['common.offline'],
      },
      {
        id: ExamTypes.MIXED,
        title: messages['common.mixed'],
      },
      {
        id: ExamTypes.PRACTICAL,
        title: messages['common.practical'],
      },
      {
        id: ExamTypes.FIELDWORK,
        title: messages['common.field_work'],
      },
      {
        id: ExamTypes.PRESENTATION,
        title: messages['common.presentation'],
      },
      {
        id: ExamTypes.ASSIGNMENT,
        title: messages['common.assignment'],
      },
    ],
    [locale],
  );

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
        headerName: messages['subject.title'] as string,
        field: 'exam_subject_title',
        width: 250,
        filterable: true,
        sortable: true,
        filter: {
          apiPath: API_EXAM_SUBJECTS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'subject_id',
      },
      {
        headerName: messages['common.created'] as string,
        field: 'created_at',
        width: 250,
        sortable: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <Typography>
              {getMomentDateFormat(data.created_at, 'MM-DD-YYYY')}
            </Typography>
          );
        },
      },
      {
        headerName: messages['common.exam_type'] as string,
        field: 'type',
        width: 250,
        filterable: true,
        filter: {
          options: examTypeFilter,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          return <div>{examType(data.type)}</div>;
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 100,
        hide: true,
        renderCell: (props: any) => {
          let published_at = props.row?.published_at;
          return (
            <CustomChip
              icon={
                published_at ? (
                  <CheckCircleOutline fontSize={'small'} />
                ) : (
                  <CancelIcon fontSize={'small'} />
                )
              }
              color={published_at ? 'primary' : 'secondary'}
              label={
                published_at ? (
                  <IntlMessages id='common.publishing' />
                ) : (
                  <IntlMessages id='common.un_publish' />
                )
              }
            />
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 400,
        sortable: false,
        renderCell: (props: any) => {
          let data = props.row;
          let isStartDateOver: any = '';

          if (ExamTypes.MIXED != data.type && data?.exams?.length == 1) {
            isStartDateOver =
              new Date(data?.exams[0]?.start_date).getTime() <
              new Date().getTime();
          }

          if (ExamTypes.MIXED == data.type && data?.exams?.length == 2) {
            isStartDateOver =
              new Date(data?.exams[0]?.start_date).getTime() <
                new Date().getTime() ||
              new Date(data?.exams[1]?.start_date).getTime() <
                new Date().getTime();
          }

          return (
            <DatatableButtonGroup>
              {exam_permissions.canRead && (
                <ReadButton
                  onClick={() => {
                    router.push(LINK_EXAM_DETAILS + `${data.id}`);
                  }}
                />
              )}
              {!data?.published_at && exam_permissions.canUpdate ? (
                <EditButton
                  onClick={() => {
                    router.push(LINK_EXAM_UPDATE + `${data.id}`);
                  }}
                />
              ) : (
                ''
              )}
              {!data?.published_at && exam_permissions.canDelete ? (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteExamItem(data.id)}
                />
              ) : (
                ''
              )}

              {!isStartDateOver &&
                !data?.published_at &&
                exam_permissions.canCreate && (
                  <ConfirmationButton
                    buttonType={'publish'}
                    labelMessageKey={'common.publishing' as string}
                    confirmAction={() => publishAction(data.id)}
                  />
                )}

              {!isStartDateOver &&
                data?.published_at &&
                exam_permissions.canCreate && (
                  <ConfirmationButton
                    buttonType={'reject'}
                    labelMessageKey={messages['common.un_publish'] as string}
                    confirmAction={() => unPublishAction(data.id)}
                  />
                )}
            </DatatableButtonGroup>
          );
        },
      },
    ],
    [messages],
  );

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconExam /> <IntlMessages id='exam.label' />
          </>
        }
        extra={[
          exam_permissions.canCreate ? (
            <Link key={1} href={LINK_EXAM_CREATE}>
              <AddButton
                onClick={() => {}}
                isLoading={loading}
                tooltip={
                  <IntlMessages
                    id={'common.add_new'}
                    values={{
                      subject: messages['exam.label'],
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
        />
      </PageContentBlock>
    </>
  );
};
export default ExamPage;
