import React, {FC, useCallback, useState} from 'react';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import FrontendCustomModal from '../../../@core/modals/FrontendCustomModal/FrontendCustomModal';
import {useIntl} from 'react-intl';
import {Body1, Link} from '../../../@core/elements/common';
import {
  getIntlDateFromString,
  getIntlNumber,
  getIntlTimeFromString,
} from '../../../@core/utilities/helpers';
import {LINK_FRONTEND_LEARNER_EXAMS} from '../../../@core/common/appLinks';
import {ExamTypes} from '../../dashboard/exams/ExamEnums';
import UploadExamAnsFilePopup from './UploadExamAnsFilePopup';
import {useFetchPublicYouthBatchExams} from '../../../services/instituteManagement/hooks';
import TableSkeleton from '../../../@core/elements/display/skeleton/TableSkeleton/TableSkeleton';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import Tooltip from '@mui/material/Tooltip';
import {InsertDriveFile} from '@mui/icons-material';

interface ViewExamsPopupProps {
  onClose: () => void;
  learnerId: any;
  batchId: any;
  apprenticeshipId?: string | number | undefined;
}

const ViewExamsPopup: FC<ViewExamsPopupProps> = ({
  onClose,
  learnerId,
  batchId,
  apprenticeshipId,
}) => {
  const {messages, formatDate, formatTime, formatNumber} = useIntl();

  const [isOpenUploadAnsFileModal, setIsOpenUploadAnsFileModal] =
    useState(false);
  const [exam, setExam] = useState<any>([]);

  const [batchExamParams] = useState<any>({learner_id: learnerId});
  const {data: examsData, isLoading} = useFetchPublicYouthBatchExams(
    batchId,
    batchExamParams,
  );

  const getExamTimeDuration = useCallback((duration: any) => {
    let hour = Math.floor(duration / 60);
    let minutes = Math.floor(duration % 60);
    if (hour > 0) {
      if (minutes > 0) {
        return (
          <>
            {getIntlNumber(formatNumber, hour) +
              ' ' +
              messages['common.hour'] +
              ' ' +
              getIntlNumber(formatNumber, minutes) +
              ' ' +
              messages['common.minute']}
          </>
        );
      } else {
        return (
          <>
            {getIntlNumber(formatNumber, hour) + ' ' + messages['common.hour']}
          </>
        );
      }
    } else {
      return (
        <>
          {getIntlNumber(formatNumber, minutes) +
            ' ' +
            messages['common.minute']}
        </>
      );
    }
  }, []);

  const getType = (type: any) => {
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

  const onOpenUploadAnsFileModal = useCallback((exam: any) => {
    setIsOpenUploadAnsFileModal(true);
    setExam(exam);
  }, []);

  const onCloseUploadAnsFileModal = useCallback((submitted?: boolean) => {
    setIsOpenUploadAnsFileModal(false);
    if (submitted) {
      onClose();
    }
  }, []);

  return (
    <FrontendCustomModal
      onClose={onClose}
      open={true}
      title={
        <>
          <DriveFileRenameOutlineIcon />
          <IntlMessages id='common.exam_schedule' />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'lg'}
      actions={
        <Button
          startIcon={<CancelIcon />}
          variant='outlined'
          onClick={onClose}
          color={'warning'}>
          {'Cancel'}
        </Button>
      }>
      <TableContainer component={Paper}>
        <Table size={'small'} aria-label='Language proficiency table'>
          <TableHead>
            <TableRow>
              <TableCell>{messages['common.title']}</TableCell>
              <TableCell>{messages['subject.label']}</TableCell>
              <TableCell>{messages['common.type']}</TableCell>
              <TableCell>{messages['common.start_time']}</TableCell>
              <TableCell>{messages['common.duration']}</TableCell>
              <TableCell>
                {messages['common.obtained_mark']}/
                {messages['common.total_marks']}
              </TableCell>
              <TableCell>{messages['common.status']}</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <TableSkeleton rowSize={5} columnNumbers={4} />
          ) : (
            <TableBody>
              {examsData?.exams && examsData?.exams.length ? (
                (examsData?.exams || []).map((exam: any, index: number) => {
                  let isOver =
                    new Date(exam?.exams[0]?.start_date).getTime() +
                      Number(exam?.exams[0]?.duration) * 60 * 1000 <
                    new Date().getTime();

                  let isStarted =
                    new Date(exam?.exams[0]?.start_date).getTime() <=
                    new Date().getTime();

                  if (
                    exam.type !== ExamTypes.ONLINE &&
                    exam.type !== ExamTypes.OFFLINE &&
                    exam.type !== ExamTypes.MIXED
                  ) {
                    isOver =
                      new Date(exam?.exams[0]?.end_date).getTime() <
                      new Date().getTime();
                  }

                  /*let isOverOthers =
                    new Date(exam?.exams[0]?.end_date).getTime() <
                    new Date().getTime();*/

                  let markSheetPath = `/my-courses/${batchId}/exam/${learnerId}/answersheet/${exam.id}`;

                  return (
                    <TableRow key={index}>
                      <TableCell component='th' scope='language'>
                        {exam?.title}
                      </TableCell>
                      <TableCell component='th' scope='language'>
                        {exam?.subject?.subject_title}
                      </TableCell>
                      <TableCell component='th' scope='language'>
                        {getType(exam?.type)}
                      </TableCell>
                      <TableCell component='th' scope='language'>
                        {exam?.exams[0]?.start_date
                          ? getIntlDateFromString(
                              formatDate,
                              exam?.exams[0]?.start_date,
                            ) +
                            ',' +
                            getIntlTimeFromString(
                              formatTime,
                              exam?.exams[0]?.start_date,
                            )
                          : ''}
                      </TableCell>
                      <TableCell>
                        {exam?.exams[0]?.duration
                          ? getExamTimeDuration(exam.exams[0]?.duration)
                          : ''}
                      </TableCell>
                      <TableCell>
                        {isOver &&
                        exam?.exams[0]?.participated &&
                        exam?.exams[0]?.obtained_mark &&
                        exam.exam_result_published_at
                          ? formatNumber(exam?.exams[0]?.obtained_mark) +
                            '/' +
                            formatNumber(exam?.exams[0]?.total_marks)
                          : !exam.exam_result_published_at
                          ? messages['exam.result_not_publish']
                          : exam?.exams[0]?.participated
                          ? messages['common.in_progress']
                          : messages['common.not_participated']}
                      </TableCell>
                      <TableCell sx={{textAlign: 'center'}}>
                        {exam.type !== ExamTypes.OFFLINE &&
                          (exam?.exams[0]?.participated ? (
                            <Body1 sx={{marginY: '10px'}}>
                              {messages['exam.already_participated']}
                            </Body1>
                          ) : isOver ? (
                            <Body1 sx={{marginY: '10px'}}>
                              {messages['exam.exam_over']}
                            </Body1>
                          ) : isStarted &&
                            exam?.exams[0]?.type == ExamTypes.ONLINE ? (
                            <Link
                              href={
                                LINK_FRONTEND_LEARNER_EXAMS +
                                `${exam?.exams[0].exam_id}`
                              }>
                              <Button
                                variant={'outlined'}
                                onClick={() => {
                                  localStorage.setItem(
                                    'batchId',
                                    JSON.stringify(batchId),
                                  );
                                  localStorage.setItem(
                                    'apprenticeshipId',
                                    JSON.stringify(apprenticeshipId),
                                  );
                                }}>
                                {messages['common.attend_exam']}
                              </Button>
                            </Link>
                          ) : (
                            <></>
                          ))}
                        {isStarted &&
                          !isOver &&
                          exam.type !== ExamTypes.ONLINE &&
                          exam.type !== ExamTypes.OFFLINE &&
                          exam.type !== ExamTypes.MIXED &&
                          !exam?.exams[0]?.participated && (
                            <Button
                              variant={'outlined'}
                              onClick={() => onOpenUploadAnsFileModal(exam)}>
                              {messages['common.file_upload']}
                            </Button>
                          )}

                        {Number(exam.type) == ExamTypes.ONLINE &&
                        exam?.participated ? (
                          <Link
                            href={markSheetPath}
                            passHref={true}
                            style={{marginLeft: '5px'}}>
                            <Button
                              variant={'outlined'}
                              onClick={() => onOpenUploadAnsFileModal(exam)}>
                              {messages['common.answer_sheet']}
                            </Button>
                          </Link>
                        ) : Number(exam.type) != ExamTypes.OFFLINE &&
                          exam?.exams[0]?.file_paths &&
                          exam?.exams[0]?.file_paths.length > 0 ? (
                          <div>
                            {exam?.exams[0]?.file_paths.map(
                              (file: any, i: number) => (
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
                                    <InsertDriveFile
                                      sx={{
                                        color: '#048340',
                                        marginLeft: '10px',
                                      }}
                                    />
                                  </Tooltip>
                                </Link>
                              ),
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <></>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {isOpenUploadAnsFileModal && (
        <UploadExamAnsFilePopup
          onClose={onCloseUploadAnsFileModal}
          exam={exam}
          batchId={batchId}
        />
      )}
    </FrontendCustomModal>
  );
};

export default ViewExamsPopup;
