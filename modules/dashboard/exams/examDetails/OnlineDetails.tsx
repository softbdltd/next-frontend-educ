import {Grid} from '@mui/material';
import DetailsInputView from '../../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import {QuestionSelectionType} from '../ExamEnums';
import {QuestionType} from '../../questionsBank/QuestionBanksEnums';
import {Body1, Body2, H6, S1} from '../../../../@core/elements/common';
import {
  getIntlDateFromString,
  getIntlNumber,
  question_type,
} from '../../../../@core/utilities/helpers';
import React from 'react';
import MCQTypeQuestion from '../../../learner/examQuestionPaper/MCQTypeQuestion';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import NoDataFoundComponent from '../../../learner/common/NoDataFoundComponent';
import QuestionTitleHeader from '../../../learner/examQuestionPaper/QuestionTitleHeader';

interface IProps {
  exam: any;
  examData: any;
  register: any;
  control: any;
  errors: any;
  setValue: any;
}

const OnlineDetails = ({
  exam,
  examData,
  register,
  control,
  errors,
  setValue,
}: IProps) => {
  const {messages, formatNumber, formatTime} = useIntl();

  let answerIndex = 0;
  let questionIndex = 1;

  // FIXED = '1',
  //   RANDOM = '2',
  //   RANDOM_FROM_QUESTION_BANK = '3',

  const questionSelection = (type: string) => {
    switch (type) {
      case QuestionSelectionType.FIXED:
        return messages['common.fixed'];
      case QuestionSelectionType.RANDOM:
        return messages['common.random'];
      case QuestionSelectionType.RANDOM_FROM_QUESTION_BANK:
        return messages['common.random_from_elect'];
      default:
        return '';
    }
  };

  return (
    <fieldset style={{borderRadius: '5px', border: '1px solid #b8b8b8'}}>
      <legend style={{color: '#0a8fdc', fontSize: '1.5rem'}}>
        {messages['common.online']}
      </legend>
      <Grid container spacing={2} padding={'30px'}>
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
        </Grid>
        <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
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
                  return (
                    <React.Fragment key={section?.uuid}>
                      <Grid item xs={12} display={'flex'}>
                        <Body1
                          sx={{
                            fontWeight: 'bold',
                            whiteSpace: 'pre',
                          }}>
                          {messages[
                            question_type[section?.question_type - 1].label
                          ] +
                            ' | ' +
                            messages['common.marks'] +
                            ': '}
                        </Body1>
                        <Body2 sx={{marginTop: '3px'}}>
                          {getIntlNumber(formatNumber, section?.total_marks)}
                        </Body2>
                        &nbsp;&nbsp;&nbsp;
                        <Body2
                          sx={{
                            marginTop: '3px',
                            fontWeight: 'bold',
                            whiteSpace: 'pre',
                          }}>
                          {'('}
                          {messages['common.question_selection_type']}
                          {': '}
                          {questionSelection(
                            section?.question_selection_type,
                          )}{' '}
                          {section?.question_selection_type ==
                          QuestionSelectionType.RANDOM_FROM_QUESTION_BANK
                            ? getIntlNumber(
                                formatNumber,
                                section?.number_of_questions,
                              ) + messages['exam.question']
                            : ''}
                          {')'}
                        </Body2>
                      </Grid>

                      {section?.questions &&
                      section?.questions.length &&
                      QuestionSelectionType.RANDOM !=
                        section?.question_selection_type ? (
                        section.questions.map((question: any) => {
                          let ansIndex = answerIndex++;

                          let questionHeader = (
                            <QuestionTitleHeader
                              index={questionIndex++}
                              question={question}
                            />
                          );
                          if (section?.question_type == QuestionType?.MCQ) {
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
                                      'questions[' + ansIndex + '].answers[0]'
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
                            section?.question_type == QuestionType.DESCRIPTIVE
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
                                {questionHeader}
                                <Grid item xs={11}>
                                  <FileUploadComponent
                                    id={'questions[' + ansIndex + '].file_path'}
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
                            messageType={messages['common.question'] as string}
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
  );
};

export default OnlineDetails;
