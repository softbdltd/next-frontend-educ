import {useIntl} from 'react-intl';
import React, {useEffect, useRef, useState} from 'react';
import {ExamTypes, QuestionSelectionType} from '../ExamEnums';
import {QuestionType} from '../../questionsBank/QuestionBanksEnums';
import {Button, Grid} from '@mui/material';
import DetailsInputView from '../../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {Body1, Body2, H6, S1} from '../../../../@core/elements/common';
import {
  getIntlDateFromString,
  getIntlNumber,
  question_type,
} from '../../../../@core/utilities/helpers';
import MCQTypeQuestion from '../../../learner/examQuestionPaper/MCQTypeQuestion';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import NoDataFoundComponent from '../../../learner/common/NoDataFoundComponent';

import {useReactToPrint} from 'react-to-print';
import QuestionTitleHeader from '../../../learner/examQuestionPaper/QuestionTitleHeader';
import _ from 'lodash';

interface IProps {
  exam: any;
  examData: any;
  register: any;
  control: any;
  errors: any;
  setValue: any;
}

const OfflineDetails = ({
  exam,
  examData,
  register,
  control,
  errors,
  setValue,
}: IProps) => {
  const {messages, formatNumber, formatTime} = useIntl();

  const [examSetUuid, setExamSetUuid] = useState<any>(null);
  const [filteredSet, setFilteredSet] = useState<any>(null);
  const [uuId, setUuid] = useState<any>([]);

  const componentRef = useRef<any>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let answerIndex = 0;
  let questionIndex = 1;

  useEffect(() => {
    if (examSetUuid) {
      let filterSet =
        exam.exam_sets &&
        exam.exam_sets.filter((que: any) => que.uuid == examSetUuid);

      setFilteredSet(filterSet[0]);
    }
  }, [exam, examSetUuid]);

  useEffect(() => {
    let uuId = (exam?.exam_sets || []).map((data: any) => {
      return {
        key: data.uuid,
        label: data.title,
      };
    });

    setExamSetUuid(uuId[0].key);
    setValue('set', uuId[0].key);
    setUuid(uuId);
  }, [exam]);

  return (
    <Grid
      container
      sx={
        examData?.exams && examData?.exams.length > 1 ? {marginTop: '40px'} : {}
      }>
      {ExamTypes.OFFLINE === Number(exam?.type) && (
        <Grid item xs={6}>
          <FormRadioButtons
            id='set'
            label={'common.offline_question_sets'}
            radios={uuId}
            control={control}
            defaultValue={examSetUuid ? examSetUuid : ''}
            isLoading={false}
            onChange={(value) => {
              setExamSetUuid(value);
            }}
          />
        </Grid>
      )}
      <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
        {examSetUuid && (
          <Button
            variant={'contained'}
            sx={{marginLeft: '10px', maxHeight: '41px'}}
            color={'primary'}
            size='small'
            onClick={() => handlePrint()}>
            {messages['common.print']}
          </Button>
        )}
      </Grid>

      {examSetUuid && (
        <Grid item xs={12}>
          <fieldset style={{borderRadius: '5px', border: '1px solid #b8b8b8'}}>
            <legend style={{color: '#0a8fdc', fontSize: '1.5rem'}}>
              {messages['common.offline']}
            </legend>
            <Grid container spacing={2} ref={componentRef} padding={'30px'}>
              <Grid
                item
                display={'flex'}
                alignItems={'center'}
                flexDirection={'column'}
                justifyContent={'center'}
                xs={12}>
                <H6>{examData?.title}</H6>
                <S1>
                  {messages['subject.label']}
                  {': '}
                  {examData?.exam_subject_title}
                </S1>
                <S1>
                  {messages['common.start_date']} {': '}
                  {getIntlDateFromString(formatTime, exam?.start_date)}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {messages['common.end_date']} {': '}
                  {getIntlDateFromString(formatTime, exam?.end_date)}
                </S1>
                <S1 sx={{margin: 'auto'}}>
                  {messages['common.duration']} {': '}
                  {getIntlNumber(formatNumber, exam?.duration)}{' '}
                  {messages['common.minute']}
                </S1>
                <S1 sx={{margin: 'auto'}}>
                  {messages['common.set']}
                  {': '} {filteredSet ? filteredSet.title : ''}
                </S1>
              </Grid>
              <Grid
                item
                xs={12}
                display={'flex'}
                justifyContent={'space-between'}>
                <S1 sx={{marginLeft: 'auto'}}>
                  {messages['common.total_marks']}
                  {': '}
                  {getIntlNumber(formatNumber, exam?.total_marks)}
                </S1>
              </Grid>

              <Grid item xs={12}>
                <form autoComplete='off'>
                  <Grid container spacing={2} mb={3}>
                    {exam && exam?.exam_sections.length ? (
                      exam.exam_sections.map((section: any) => {
                        let questions = (section?.questions).filter(
                          (que: any) =>
                            Number(exam.type) === ExamTypes.ONLINE ||
                            que.exam_set_uuid == examSetUuid,
                        );

                        if (
                          String(section.question_selection_type) ==
                          QuestionSelectionType.RANDOM_FROM_QUESTION_BANK
                        ) {
                          questions = _.sampleSize(
                            questions,
                            section.number_of_questions,
                          );
                        }

                        return (
                          <React.Fragment key={section?.uuid}>
                            <Grid item xs={12} display={'flex'}>
                              <Body1
                                sx={{
                                  fontWeight: 'bold',
                                  whiteSpace: 'pre',
                                }}>
                                {messages[
                                  question_type[section?.question_type - 1]
                                    .label
                                ] +
                                  ' | ' +
                                  messages['common.total_marks'] +
                                  ': '}
                              </Body1>
                              <Body2 sx={{marginTop: '3px'}}>
                                {getIntlNumber(
                                  formatNumber,
                                  section?.total_marks,
                                )}
                              </Body2>
                            </Grid>

                            {section?.questions && section?.questions.length ? (
                              questions.map((question: any) => {
                                let ansIndex = answerIndex++;

                                if (
                                  section?.question_type ==
                                  QuestionType.FILL_IN_THE_BLANK
                                ) {
                                  question.title = question?.title.replace(
                                    /\[{2}(.*?)\]{2}/g,
                                    (s: string) => '_'.repeat(s.length),
                                  );
                                }

                                let questionHeader = (
                                  <QuestionTitleHeader
                                    index={questionIndex++}
                                    question={question}
                                  />
                                );
                                if (
                                  section?.question_type == QuestionType?.MCQ
                                ) {
                                  return (
                                    <React.Fragment key={question?.question_id}>
                                      {questionHeader}
                                      <Grid item xs={11}>
                                        {' '}
                                        <MCQTypeQuestion
                                          index={ansIndex}
                                          question={question}
                                          register={register}
                                        />
                                      </Grid>
                                    </React.Fragment>
                                  );
                                } else if (
                                  section?.question_type == QuestionType.YES_NO
                                ) {
                                  return (
                                    <React.Fragment key={question?.question_id}>
                                      {questionHeader}
                                      <Grid item xs={11}>
                                        <FormRadioButtons
                                          id={
                                            'questions[' +
                                            ansIndex +
                                            '].answers[0]'
                                          }
                                          control={control}
                                          radios={[
                                            {
                                              label: messages['common.yes'],
                                              key: 1,
                                            },
                                            {
                                              label: messages['common.no'],
                                              key: 2,
                                            },
                                          ]}
                                        />
                                      </Grid>
                                    </React.Fragment>
                                  );
                                } else if (
                                  section?.question_type ==
                                  QuestionType.DESCRIPTIVE
                                ) {
                                  return (
                                    <React.Fragment key={question?.question_id}>
                                      {questionHeader}
                                      <Grid item xs={11}>
                                        <DetailsInputView
                                          label={''}
                                          isLoading={false}
                                          value={''}
                                        />
                                      </Grid>
                                    </React.Fragment>
                                  );
                                } else if (
                                  section?.question_type ==
                                  QuestionType.FILL_IN_THE_BLANK
                                ) {
                                  return (
                                    <React.Fragment key={question?.question_id}>
                                      {questionHeader}
                                    </React.Fragment>
                                  );
                                } else {
                                  return (
                                    <React.Fragment key={question?.question_id}>
                                      <Grid item xs={11}>
                                        {questionHeader}{' '}
                                        <FileUploadComponent
                                          id={
                                            'questions[' +
                                            ansIndex +
                                            '].file_path'
                                          }
                                          setValue={setValue}
                                          errorInstance={errors}
                                          register={register}
                                          label={messages['common.file_path']}
                                          disabled={true}
                                        />
                                      </Grid>
                                    </React.Fragment>
                                  );
                                }
                              })
                            ) : section?.questions &&
                              String(section.question_selection_type) ===
                                QuestionSelectionType.RANDOM ? (
                              <Grid item>
                                <NoDataFoundComponent
                                  message={
                                    messages['common.random_question'] as string
                                  }
                                  messageTextType={'body1'}
                                  sx={{
                                    justifyContent: 'start',
                                  }}
                                />
                              </Grid>
                            ) : (
                              <Grid item>
                                <NoDataFoundComponent
                                  messageType={
                                    messages['common.question'] as string
                                  }
                                  messageTextType={'body1'}
                                  sx={{
                                    justifyContent: 'start',
                                  }}
                                />
                              </Grid>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <NoDataFoundComponent />
                    )}
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </fieldset>
        </Grid>
      )}
    </Grid>
  );
};

export default OfflineDetails;
