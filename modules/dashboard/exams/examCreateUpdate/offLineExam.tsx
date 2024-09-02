import {useIntl} from 'react-intl';
import Grid from '@mui/material/Grid';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import Box from '@mui/material/Box';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DoneIcon from '@mui/icons-material/Done';
import {Body1, S2} from '../../../../@core/elements/common';
import ExamQuestionTypeSection from './components/ExamQuestionTypeSection';
import {QuestionType} from '../../questionsBank/QuestionBanksEnums';
import CustomDateTimePicker from '../../../../@core/elements/input/CustomDateTimePicker';
import {ExamTypes} from '../ExamEnums';
import Button from '@mui/material/Button';

interface IProps {
  useFrom: any;
  examType: number;
  subjectId: any;
}

const OffLineExam = ({useFrom, examType, subjectId}: IProps) => {
  const {messages, formatNumber} = useIntl();

  const examSetField = useRef<any>();
  const [examSets, setExamSets] = useState<Array<any>>([]);
  const [totalMarks, setTotalMarks] = useState<Array<number>>([0, 0, 0, 0]);

  const isMixed = examType == ExamTypes.MIXED;

  useEffect(() => {
    let sets = isMixed
      ? useFrom.getValues('offline').sets
      : useFrom.getValues('sets');

    if (sets) {
      let array = sets.map((set: any, i: number) => {
        return {
          ...set,
          index: i,
          id: `SET##${i + 1}`,
        };
      });
      setExamSets(array);
    }
  }, [useFrom.getValues]);

  const onInput = useCallback(() => {
    if (examSetField.current.value <= 5) {
      let formKey = isMixed ? 'offline[sets]' : 'sets';

      if (examSets.length > 0) {
        let prevExamSets = [...examSets];
        if (examSetField.current.value > examSets.length) {
          let idx = examSets.length;
          for (
            let i = 0;
            i < examSetField.current.value - examSets.length;
            i++
          ) {
            prevExamSets.push({
              index: idx,
              id: `SET##${idx + 1}`,
            });
            idx++;
          }
          useFrom.setValue(formKey, prevExamSets);
          setExamSets(prevExamSets);
        } else {
          let newSet = prevExamSets.slice(0, examSetField.current.value);
          useFrom.setValue(formKey, newSet);
          setExamSets(newSet);
        }
      } else {
        let array: any = [];
        for (let i = 0; i < examSetField.current.value; i++) {
          array.push({
            index: i,
            id: `SET##${i + 1}`,
          });
        }
        useFrom.setValue(formKey, array);
        setExamSets(array);
      }
    }
  }, [examSets, useFrom]);

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
        <legend style={{color: '#0a8fdc'}}>{messages['common.offline']}</legend>
        <Grid container spacing={5}>
          {/*Exams*/}
          <Grid item xs={4}>
            <CustomDateTimePicker
              required
              id={isMixed ? `offline[start_date]` : 'start_date'}
              label={messages['common.exam_date']}
              register={useFrom.register}
              errorInstance={useFrom.errors}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomTextInput
              required
              id={isMixed ? `offline[duration]` : 'duration'}
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
          <Grid item xs={6}>
            <CustomTextInput
              id={isMixed ? `offline[venue]` : 'venue'}
              label={messages['common.venue']}
              control={useFrom.control}
              errorInstance={useFrom.errors}
              isLoading={false}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomTextInput
              required
              id={isMixed ? `offline[total_set]` : 'total_set'}
              label={messages['common.number_of_sets']}
              control={useFrom.control}
              errorInstance={useFrom.errors}
              isLoading={false}
              type={'number'}
              inputRef={examSetField}
              defaultValue={''}
              InputProps={{
                inputProps: {
                  max: 5,
                  min: 1,
                },
              }}
            />
            <Button
              sx={{marginTop: '5px'}}
              variant={'contained'}
              color={'primary'}
              size={'small'}
              onClick={() => onInput()}>
              <DoneIcon />
              {messages['common.add']}
            </Button>
          </Grid>

          {/*Exam Sets*/}
          {examSets?.map((item, i) => {
            const idPrefix = isMixed ? `offline[sets]` : 'sets';
            return (
              <Fragment key={i}>
                <Grid item xs={12}>
                  <S2 sx={{marginBottom: '-30px'}}>
                    {messages['common.set']} {formatNumber(i + 1)}
                  </S2>
                </Grid>
                <Grid item xs={6}>
                  <CustomTextInput
                    sx={{display: 'none'}}
                    id={`${idPrefix}[${i}][id]`}
                    label={messages['common.set_name']}
                    control={useFrom.control}
                    errorInstance={useFrom.errors}
                    isLoading={false}
                    defaultValue={item.id}
                  />
                  <CustomTextInput
                    required
                    sx={{mt: '-19px'}}
                    id={`${idPrefix}[${i}][title]`}
                    label={messages['common.set_name']}
                    control={useFrom.control}
                    errorInstance={useFrom.errors}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomTextInput
                    id={`${idPrefix}[${i}][title_en]`}
                    label={messages['common.set_name_en']}
                    control={useFrom.control}
                    errorInstance={useFrom.errors}
                    isLoading={false}
                  />
                </Grid>
              </Fragment>
            );
          })}

          {/*Exam Sections*/}
          {examSets.length > 0 && (
            <Grid item xs={12}>
              <Body1 sx={{color: '#0a8fdc'}}>{messages['question.type']}</Body1>
            </Grid>
          )}

          {examSets.length > 0 &&
            questionTypes.map((questionType, i) => {
              const idPrefix = isMixed
                ? `offline[exam_questions]`
                : 'exam_questions';
              return (
                <Grid key={i} item xs={12}>
                  <ExamQuestionTypeSection
                    useFrom={useFrom}
                    questionType={questionType}
                    index={i}
                    idPrefix={idPrefix}
                    subjectId={subjectId}
                    examSets={examSets}
                    examType={examType}
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

export default OffLineExam;
