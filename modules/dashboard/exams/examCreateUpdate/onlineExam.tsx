import Grid from '@mui/material/Grid';
import React, {useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import Box from '@mui/material/Box';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import ExamQuestionTypeSection from './components/ExamQuestionTypeSection';
import {Body1, S2} from '../../../../@core/elements/common';
import {QuestionType} from '../../questionsBank/QuestionBanksEnums';
import CustomDateTimePicker from '../../../../@core/elements/input/CustomDateTimePicker';
import {ExamTypes} from '../ExamEnums';

interface IProps {
  useFrom: any;
  examType: number;
  subjectId: any;
}

const OnlineExam = ({useFrom, examType, subjectId}: IProps) => {
  const {messages} = useIntl();
  const [totalMarks, setTotalMarks] = useState<Array<number>>([0, 0, 0, 0]);

  const isMixed = examType == ExamTypes.MIXED;

  const questionTypes = useMemo(
    () => [
      {
        id: QuestionType.MCQ,
        label: messages['question.type.mcq'],
      },
      {
        id: QuestionType.FILL_IN_THE_BLANK,
        label: messages['common.fill_in_the_blanks'],
      },
      {
        id: QuestionType.YES_NO,
        label: messages['question.type.y_n'],
      },
      {
        id: QuestionType.DESCRIPTIVE,
        label: messages['common.descriptive'],
      },
    ],
    [messages],
  );
  const updateTotalMarks = (index: number, mark: number) => {
    setTotalMarks((prev) => {
      prev[index] = mark;
      return [...prev];
    });
  };

  return (
    <Box sx={{marginTop: '10px'}}>
      <fieldset>
        <legend style={{color: '#0a8fdc'}}>{messages['common.online']}</legend>
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <CustomDateTimePicker
              required
              id={isMixed ? `online[start_date]` : 'start_date'}
              label={messages['common.exam_date']}
              register={useFrom.register}
              errorInstance={useFrom.errors}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomTextInput
              required
              id={isMixed ? `online[duration]` : 'duration'}
              type={'number'}
              label={messages['common.duration_min']}
              control={useFrom.control}
              errorInstance={useFrom.errors}
            />
          </Grid>
          <Grid item xs={4}>
            <S2>
              {messages['common.total_marks']}:{' '}
              {totalMarks.reduce((a, b) => a + b, 0)}
            </S2>
          </Grid>

          <Grid item xs={12}>
            <Body1 sx={{color: '#0a8fdc'}}>{messages['question.type']}</Body1>
          </Grid>

          {questionTypes.map((questionType, i) => {
            const idPrefix = isMixed
              ? `online[exam_questions]`
              : 'exam_questions';
            return (
              <Grid key={i} item xs={12}>
                <ExamQuestionTypeSection
                  useFrom={useFrom}
                  questionType={questionType}
                  index={i}
                  idPrefix={idPrefix}
                  subjectId={subjectId}
                  setTotalMarks={updateTotalMarks}
                />
              </Grid>
            );
          })}
        </Grid>
      </fieldset>
    </Box>
  );
};

export default OnlineExam;
