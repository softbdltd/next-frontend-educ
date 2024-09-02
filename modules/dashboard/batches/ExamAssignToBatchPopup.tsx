import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import Grid from '@mui/material/Grid';
import yup from '../../../@core/libs/yup';
import {
  useFetchBatchExams,
  useFetchExams,
} from '../../../services/instituteManagement/hooks';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {isBreakPointUp, useBreakPointDown} from '../../../@core/utility/Utils';
import IconExam from '../../../@core/icons/IconExam';
import {ExamTypes} from '../exams/ExamEnums';
import {
  assignExamsToBatch,
  publishSingleResult,
} from '../../../services/instituteManagement/BatchService';
import {Body1, S1} from '../../../@core/elements/common';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import Divider from '@mui/material/Divider';
import _ from 'lodash';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {Fonts} from '../../../shared/constants/AppEnums';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Fab} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

interface ExamAssignToBatchPopupProps {
  batchId: number;
  resultPublishedAt: any;
  onClose: () => void;
  openExamAssignModal: (itemId: number, resultPublishedAt: any) => void;
}

const ExamAssignToBatchPopup: FC<ExamAssignToBatchPopupProps> = ({
  batchId,
  resultPublishedAt,
  openExamAssignModal,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();

  const [exams, setExams] = useState<any>([]);
  const [selectedExams, setSelectedExams] = useState<Array<any>>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const isDownSm = useBreakPointDown('sm');

  const [examFilters] = useState<any>({
    batch_id: batchId,
    is_result_config_courses: 1,
  });
  const {data: batchExams} = useFetchBatchExams(batchId);
  const {data: examsData, isLoading} = useFetchExams(examFilters);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      exams: yup
        .array()
        .of(yup.object())
        .required()
        .min(1)
        .label(messages['exam.label'] as string),
    });
  }, [messages]);

  const {
    control,
    formState: {isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    let examData = (examsData && examsData.length > 0 ? examsData : [])?.filter(
      (item: any) =>
        new Date(item?.exams[0]?.end_date).getTime() > new Date().getTime(),
    );

    if (
      batchExams &&
      batchExams.length > 0 &&
      examData &&
      examData.length > 0
    ) {
      const arrayFiltered = _.xorBy(examData, batchExams, 'id');
      setExams(arrayFiltered);
    } else {
      setExams(examsData);
    }

    setSelectedExams(batchExams ? batchExams : []);
  }, [batchExams, examsData]);

  const onAddClick = useCallback(() => {
    if (selectedExamId) {
      let lists = [...selectedExams];
      const xm = exams.find((item: any) => item.id == selectedExamId);
      const xmMain = exams.filter((item: any) => item.id != selectedExamId);

      if (xm) {
        lists.push(xm);
        setSelectedExams(lists);
      }

      if (xmMain) {
        setExams(xmMain);
      }

      setSelectedExamId(null);
    }
  }, [exams, selectedExamId, selectedExams]);

  const onDeleteClick = useCallback(
    (examId: number) => {
      if (examId) {
        let examList = [...exams];
        const xm = selectedExams.filter((item: any) => item.id != examId);
        const xmMain = selectedExams.filter((item: any) => item.id == examId);

        if (xm) {
          setSelectedExams(xm);
        }

        if (xmMain) {
          setExams([...xmMain, ...examList]);
        }

        setSelectedExamId(null);
      }
    },
    [exams, selectedExams],
  );

  const onExamChange = useCallback((selected: number) => {
    setSelectedExamId(selected);
  }, []);

  const onSubmitExams = async () => {
    /*todo: this portion is change for de-assign all exam.*/
    /*if (selectedExams && selectedExams.length <= 0) {
      errorStack(<IntlMessages id='common.add_exam' />);
      return;
    }*/

    try {
      let formData: any = {};
      if (selectedExams && selectedExams) {
        formData.exam_type_ids = (selectedExams || []).map(
          (exam: any) => exam.id,
        );

        await assignExamsToBatch(batchId, formData);
        successStack(messages['batch.exam_assign_success']);
        props.onClose();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const onSubmitResult = async (examTypeId: number) => {
    try {
      let params = {
        is_published: 1, //todo: 1 is published 0 is unpublished
        batch_id: batchId,
      };

      /*
      mark_update_not_complete*/

      if (examTypeId) {
        let response = await publishSingleResult(examTypeId, params);
        if (isResponseSuccess(response)) {
          successStack(messages['exam.result_publish']);
          props.onClose();
          openExamAssignModal(batchId, resultPublishedAt);
        } else {
          let error_code = response?.data.error_code;
          let mgs = messages['batch.exam_not_assigned_in_batch'];
          if (error_code == 'exam_not_assigned_in_batch') {
            mgs = messages['batch.exam_not_assigned_in_batch'];
          } else if (error_code == 'exams_not_finished') {
            mgs = mgs = messages['batch.result_failed_exams_not_finished'];
          } else if (error_code == 'exam_result_already_published') {
            mgs = mgs = messages['batch.result_failed_already_published'];
          } else if (error_code == 'mark_update_not_complete') {
            mgs = mgs = messages['batch.mark_update_not_complete'];
          }
          errorStack(mgs);
        }
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

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
      default:
        return '';
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconExam />
          <IntlMessages id='batch.assign_exam' />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          {!resultPublishedAt && (
            <SubmitButton
              onClick={() => onSubmitExams()}
              isSubmitting={isSubmitting}
              isLoading={isLoading}
              type={'button'}
            />
          )}
        </>
      }>
      <Grid container spacing={1}>
        {exams && exams.error_code == 'no_config' ? (
          <Grid item xs={12} sx={{textAlign: 'center'}}>
            <S1>{messages['batch.result_failed_no_config']}</S1>
          </Grid>
        ) : (
          <>
            {!resultPublishedAt && (
              <Grid item xs={12} sx={{marginBottom: '10px'}}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <CustomFilterableFormSelect
                      required
                      id='exams'
                      label={messages['exam.label']}
                      control={control}
                      options={(exams || []).map((exam: any) => ({
                        ...exam,
                        type_label: getTypeLabel(exam.type),
                      }))}
                      optionTitleProp={['title', 'type_label']}
                      optionValueProp={'id'}
                      isLoading={isLoading}
                      onChange={onExamChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    {isDownSm ? (
                      <Tooltip title={messages['common.add'] as string}>
                        <Fab
                          size='small'
                          color='primary'
                          sx={{
                            marginLeft: '20px',
                          }}
                          onClick={() => onAddClick()}
                          aria-label='add'>
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    ) : (
                      <CommonButton
                        btnText='common.add'
                        onClick={() => onAddClick()}
                        style={{marginLeft: '10px'}}
                        variant='outlined'
                        color='primary'
                      />
                    )}
                  </Grid>
                </Grid>
                {selectedExams && selectedExams.length > 0 && (
                  <Divider sx={{marginY: 2}} />
                )}
              </Grid>
            )}

            {selectedExams && selectedExams.length > 0 && (
              <>
                <Grid item xs={4} sx={{textAlign: 'center'}}>
                  <Body1 sx={{fontWeight: Fonts.BOLD}}>
                    {messages['common.exam_name']}
                  </Body1>
                </Grid>
                <Grid item xs={4} sx={{textAlign: 'center'}}>
                  <Body1 sx={{fontWeight: Fonts.BOLD}}>
                    {messages['common.exam_type']}
                  </Body1>
                </Grid>
                <Grid item xs={4} sx={{textAlign: 'center'}}>
                  <Body1 sx={{fontWeight: Fonts.BOLD}}>
                    {messages['common.actions']}
                  </Body1>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{marginBottom: 2}} />
                </Grid>
              </>
            )}

            {selectedExams.map((exam: any) => {
              let match = (
                (batchExams && batchExams.length > 0 && batchExams) ||
                []
              ).filter((entry: any) => entry.id === exam.id);

              return (
                <Grid item xs={12} key={exam.id}>
                  <Grid container spacing={1}>
                    <Grid item xs={4} sx={{textAlign: 'center'}}>
                      <Body1>{exam.title}</Body1>
                    </Grid>
                    <Grid item xs={4} sx={{textAlign: 'center'}}>
                      <Body1>{getTypeLabel(exam.type)}</Body1>
                    </Grid>
                    <Grid item xs={4} sx={{textAlign: 'center'}}>
                      {exam.exam_result_published_at ? (
                        <Body1>{messages['exam.result_already_publish']}</Body1>
                      ) : (
                        <>
                          {match && match.length > 0 && (
                            <ConfirmationButton
                              buttonType={'approve'}
                              confirmAction={() => onSubmitResult(exam.id)}
                              labelMessageKey={'exam.number_publish'}
                              dialogTitle={
                                messages['exam.number_publish'] as string
                              }
                              sx={{marginRight: '10px'}}
                              showIconOnly={isDownSm}
                            />
                          )}

                          <ConfirmationButton
                            buttonType={'delete'}
                            confirmAction={async () => onDeleteClick(exam.id)}
                            showIconOnly={isDownSm}
                          />
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Divider sx={{marginY: '10px'}} />
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default ExamAssignToBatchPopup;
