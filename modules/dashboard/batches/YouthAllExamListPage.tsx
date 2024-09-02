import IconBatch from '../../../@core/icons/IconBatch';
import IntlMessages from '../../../@core/utility/IntlMessages';
import React, {useMemo} from 'react';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {ExamTypes} from '../exams/ExamEnums';
import Tooltip from '@mui/material/Tooltip';
import {ArrowBack, InsertDriveFile, RemoveRedEye} from '@mui/icons-material';
import {Link} from '../../../@core/elements/common';
import {
  API_BATCHES,
  API_BATCHES_LEARNER_EXAMS,
  FILE_SERVER_FILE_VIEW_ENDPOINT,
} from '../../../@core/common/apiRoutes';
import {Button} from '@mui/material';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';

const YouthAllExamListPage = () => {
  const {messages, locale, formatNumber} = useIntl();

  const router = useRouter();
  const {batchId, learnerId} = router.query;

  const getTypeLabel = (type: any) => {
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
      case ExamTypes.ATTENDANCE:
        return messages['common.attendance'];
      default:
        return '';
    }
  };

  const typeLabels: any = [
    {
      id: ExamTypes.ONLINE,
      title: messages['common.online'] as string,
    },
    {
      id: ExamTypes.OFFLINE,
      title: messages['common.offline'] as string,
    },
    {
      id: ExamTypes.MIXED,
      title: messages['common.mixed'] as string,
    },
    {
      id: ExamTypes.PRACTICAL,
      title: messages['common.practical'] as string,
    },
    {
      id: ExamTypes.FIELDWORK,
      title: messages['common.field_work'] as string,
    },
    {
      id: ExamTypes.PRESENTATION,
      title: messages['common.presentation'] as string,
    },
    {
      id: ExamTypes.ASSIGNMENT,
      title: messages['common.assignment'] as string,
    },
    {
      id: ExamTypes.ATTENDANCE,
      title: messages['common.attendance'] as string,
    },
  ];

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        hide: locale == LocaleLanguage.EN,
        width: 250,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        hide: locale == LocaleLanguage.BN,
        width: 250,
      },
      {
        headerName: messages['common.type'] as string,
        field: 'type',
        filterable: true,
        filter: {
          options: typeLabels,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          return <span>{getTypeLabel(data.type)}</span>;
        },
        width: 250,
      },
      {
        headerName: String(
          messages['common.obtained_mark'] +
            ' / ' +
            messages['common.total_marks'],
        ),
        width: 250,
        field: 'obtained_mark',
        renderCell: (props: any) => {
          let data = props.row;
          return (data.exams || []).map((exam: any) => {
            return (
              <span key={exam.id}>
                {String(Number(exam.obtained_mark)) +
                  '/' +
                  String(Number(exam.total_marks))}
              </span>
            );
          });
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'participated',
        sortable: false,
        width: 250,
        renderCell: (props: any) => {
          let data = props.row;
          let exam: any =
            data?.exams && data.exams.length > 0 ? data.exams[0] : null;
          return (
            <span>
              {exam?.participated
                ? messages['common.participated']
                : messages['common.not_participated']}
            </span>
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        width: 800,
        renderCell: (props: any) => {
          let data = props.row;
          let exam: any =
            data?.exams && data.exams.length > 0 ? data.exams[0] : null;

          let markSheetPath = `/batches/${batchId}/learners/${learnerId}/marksheet/${exam?.exam_id}`;
          return Number(exam?.type) == ExamTypes.ONLINE ? (
            <Link href={markSheetPath} passHref={true}>
              <Tooltip title={messages['common.answer_sheet'] as any} arrow>
                <RemoveRedEye sx={{color: 'blue'}} />
              </Tooltip>
            </Link>
          ) : Number(exam?.type) != ExamTypes.OFFLINE &&
            exam?.file_paths &&
            exam?.file_paths.length > 0 ? (
            <div>
              {exam?.file_paths.map((file: any, i: number) => (
                <Link
                  href={FILE_SERVER_FILE_VIEW_ENDPOINT + file}
                  passHref={true}
                  key={i}
                  target={'_blank'}>
                  <Tooltip
                    title={`${
                      messages['common.file_path'] as any
                    } ${formatNumber(i + 1)}`}
                    arrow>
                    <InsertDriveFile sx={{color: 'blue', marginLeft: '10px'}} />
                  </Tooltip>
                </Link>
              ))}
            </div>
          ) : (
            <></>
          );
        },
      },
    ],
    [messages, locale],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_BATCHES + '/' + batchId + API_BATCHES_LEARNER_EXAMS,
    paramsValueModifier: (params: any) => {
      params['learner_id'] = learnerId;
      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconBatch /> <IntlMessages id='exam.label' />
          </>
        }
        extra={[
          <Button
            key={1}
            variant={'contained'}
            color={'primary'}
            size={'small'}
            onClick={() => router.back()}>
            <ArrowBack />
            {messages['common.back']}
          </Button>,
        ]}>
        <DataTable
          columns={columns}
          data={data.exams}
          fetchData={onFetchData}
          loading={loading}
          showColumnToolbar={true}
          totalCount={totalCount}
          // toggleResetTable={isToggleTable}
        />
      </PageContentBlock>
    </>
  );
};

export default YouthAllExamListPage;
