import Grid from '@mui/material/Grid';
import CustomTextInput from '../../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {ExamTypes, QuestionSelectionType} from '../../ExamEnums';
import CustomCheckbox from '../../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import QuestionSetPopup from './questionSetPopup/QuestionSetPopup';
import IntlMessages from '../../../../../@core/utility/IntlMessages';
import AddButton from '../../../../../@core/elements/button/AddButton/AddButton';
import _, {cloneDeep} from 'lodash';
import CustomFilterableFormSelect from '../../../../../@core/elements/input/CustomFilterableFormSelect';
import {Body2, S2} from '../../../../../@core/elements/common';

interface IProps {
  useFrom: any;
  questionType: any;
  index: number;
  idPrefix: any;
  subjectId?: any;
  examSets?: any;
  examType?: number;
  setTotalMarks: (index: number, mark: number) => void;
}

const ExamQuestionTypeSection = ({
  useFrom,
  questionType,
  index,
  idPrefix,
  subjectId,
  examSets,
  examType,
  setTotalMarks,
}: IProps) => {
  const {messages, formatNumber} = useIntl();

  const isOffline = examType == ExamTypes.OFFLINE;
  const isMixed = examType == ExamTypes.MIXED;

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedSelectionType, setSelectedSelectionType] = useState<any>(null);
  const [offlineQuestions, setOfflineQuestions] = useState<any>([]);
  const [localQuestions, setLocalQuestions] = useState<any>([]);
  const [offlineQuestionModalIndex, setOfflineQuestionModalIndex] =
    useState<any>(null);

  const [isOpenAddQuestionModal, setIsAddQuestionAssignModal] =
    useState<boolean>(false);
  const [questionTypeId, setQuestionTypeId] = useState<any>('');
  const [numberOfQuestion, setNumberOfQuestion] = useState<number | null>(null);
  const [marks, setMarks] = useState<number | null>(null);

  const questionSelectionType = useMemo(
    () => [
      {
        key: QuestionSelectionType.FIXED,
        label: messages['common.fixed'],
      },
      {
        key: QuestionSelectionType.RANDOM,
        label: messages['common.random'],
      },
      {
        key: QuestionSelectionType.RANDOM_FROM_QUESTION_BANK,
        label: messages['common.random_from_elect'],
      },
    ],
    [messages],
  );

  useEffect(() => {
    let values: any[];
    if (idPrefix == 'exam_questions') {
      values = useFrom.getValues('exam_questions');
    } else if (idPrefix == 'online[exam_questions]') {
      values = useFrom.getValues('online').exam_questions;
    } else {
      values = useFrom.getValues('offline').exam_questions;
    }
    if (values) {
      let obj = values.find(
        (val: any) => val.question_type == String(questionType.id),
      );
      if (obj) {
        setIsChecked(obj.is_question_checked);
        setQuestionTypeId(questionType.id);
        setMarks(obj?.total_marks ? obj.total_marks : null);
        setTotalMarks(
          index,
          obj.is_question_checked
            ? obj?.total_marks
              ? Number(obj.total_marks)
              : 0
            : 0,
        );
        setNumberOfQuestion(
          obj.number_of_questions ? obj.number_of_questions : null,
        );
        setSelectedSelectionType(
          obj.question_selection_type ? obj.question_selection_type : null,
        );
        if (obj.questions) {
          if (examSets) {
            let grouped = _.mapValues(
              _.groupBy(obj.questions, 'exam_set_uuid'),
            );

            let ques: any = [];
            (examSets || []).map((set: any) => {
              ques.push({
                id: set.id,
                questions:
                  set?.uuid && grouped[set.uuid] ? grouped[set.uuid] : [],
              });
            });
            setLocalQuestions(ques);
            setOfflineQuestions(ques);
          } else {
            setLocalQuestions([{questions: obj.questions}]);
          }
        } else {
          let initialOfflineQue = (examSets || []).map((data: any) => {
            return {id: data.id, questions: []};
          });
          setOfflineQuestions(initialOfflineQue);
        }
      }
    }
  }, [useFrom.getValues, examSets]);

  const onChangeQuestionSelectionType = (type: any) => {
    setSelectedSelectionType(type ? String(type) : null);
  };

  const openAddQuestionModal = useCallback((index?: any) => {
    if (isOffline || isMixed) {
      setOfflineQuestionModalIndex(index);
    }

    setIsAddQuestionAssignModal(true);
  }, []);

  const closeAddQuestionModal = useCallback(() => {
    setIsAddQuestionAssignModal(false);
  }, []);

  const onQuestionsSubmitted = (data: any) => {
    if (isOffline || isMixed) {
      let ques = cloneDeep(offlineQuestions);

      ques[offlineQuestionModalIndex].questions = data.questions;

      setOfflineQuestions(ques);
      setLocalQuestions(ques);

      useFrom.setValue(`${idPrefix}[${index}][question_sets]`, ques);
    } else {
      setLocalQuestions([{questions: data.questions}]);
      useFrom.setValue(`${idPrefix}[${index}][questions]`, data.questions);
    }
  };

  const onTotalMarkUpdate = useCallback(
    (value: string) => {
      setMarks(value ? Number(value) : null);
      setTotalMarks(index, value ? Number(value) : 0);

      if (
        value &&
        numberOfQuestion &&
        localQuestions &&
        localQuestions.length > 0
      ) {
        let individualMark = Number(
          (Number(value) / numberOfQuestion).toFixed(2),
        );

        if (isOffline || isMixed) {
          let localQues = [...localQuestions];
          localQues.map((ques: any) => {
            ques.questions = (ques.questions || []).map((qu: any) => ({
              ...qu,
              individual_marks: individualMark,
            }));
          });
          setLocalQuestions(localQues);
          setOfflineQuestions(localQues);
          useFrom.setValue(`${idPrefix}[${index}][question_sets]`, localQues);
        } else if (localQuestions[0]?.questions) {
          let localQues = [...localQuestions];
          (localQues[0].questions || []).map((question: any) => {
            question.individual_marks = individualMark;
          });
          setLocalQuestions(localQues);

          useFrom.setValue(
            `${idPrefix}[${index}][questions]`,
            localQues[0]?.questions,
          );
        }
      }
    },
    [localQuestions],
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <CustomCheckbox
          id={`${idPrefix}[${index}][is_question_checked]`}
          label={questionType.label}
          register={useFrom.register}
          errorInstance={useFrom.errors}
          checked={isChecked}
          onChange={() => {
            setIsChecked((prev) => !prev);
            setQuestionTypeId(questionType.id);
            setTotalMarks(index, isChecked ? 0 : (marks as number));
          }}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={3} sx={{display: 'none'}}>
        <CustomTextInput
          id={`${idPrefix}[${index}][question_type]`}
          label={questionType.label}
          control={useFrom.control}
          errorInstance={useFrom.errors}
          defaultValue={questionType.id}
          isLoading={false}
        />
      </Grid>
      {isChecked && (
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <CustomTextInput
                required
                id={`${idPrefix}[${index}][number_of_questions]`}
                label={messages['common.number_of_questions']}
                type={'number'}
                InputProps={{inputProps: {min: 0}}}
                control={useFrom.control}
                errorInstance={useFrom.errors}
                isLoading={false}
                onInput={(value: string) => {
                  setNumberOfQuestion(value ? Number(value) : null);
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomTextInput
                required
                id={`${idPrefix}[${index}][total_marks]`}
                label={messages['common.total_marks']}
                type={'number'}
                InputProps={{inputProps: {min: 0}}}
                control={useFrom.control}
                errorInstance={useFrom.errors}
                isLoading={false}
                onInput={onTotalMarkUpdate}
              />
            </Grid>

            <Grid item xs={3}>
              <CustomFilterableFormSelect
                required
                id={`${idPrefix}[${index}][question_selection_type]`}
                label={messages['common.question_selection_type']}
                isLoading={false}
                control={useFrom.control}
                errorInstance={useFrom.errors}
                options={questionSelectionType}
                onChange={onChangeQuestionSelectionType}
                optionValueProp='key'
                optionTitleProp={['label']}
              />
            </Grid>

            {selectedSelectionType &&
            selectedSelectionType != QuestionSelectionType.RANDOM &&
            numberOfQuestion &&
            marks &&
            examSets &&
            examSets.length > 0 ? (
              <Grid item xs={examSets.length < 3 ? 4 : 12}>
                <Grid container>
                  {examSets.map((examSet: any, idx: number) => (
                    <Grid
                      key={examSet.index}
                      item
                      xs={Math.floor(12 / examSets.length)}
                      textAlign={'center'}
                      sx={{
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}>
                      <S2 sx={{whiteSpace: 'nowrap'}}>
                        {messages['common.set']} {formatNumber(idx + 1)}
                      </S2>
                      <AddButton
                        key={1}
                        onClick={() => openAddQuestionModal(idx)}
                        isLoading={false}
                        tooltip={
                          <IntlMessages
                            id={'common.add_new'}
                            values={{
                              subject: messages['question_set.label'],
                            }}
                          />
                        }
                      />
                      <Body2
                        sx={{
                          textAlign: 'center',
                          display: 'block',
                          marginTop: '6px',
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'normal',
                          lineBreak: 'strict',
                        }}>
                        {localQuestions?.[idx]?.questions &&
                        localQuestions?.[idx]?.questions.length > 0 ? (
                          formatNumber(
                            localQuestions?.[idx]?.questions.length,
                          ) + messages['exam.question_selected']
                        ) : useFrom.errors?.exam_questions?.[index]
                            ?.question_sets ||
                          useFrom.errors?.exam_questions?.[index]
                            ?.question_sets?.[idx] ||
                          useFrom.errors?.exam_questions?.[index]
                            ?.question_sets?.[idx]?.questions ? (
                          <span style={{color: 'red'}}>
                            {messages['exam.no_question_selected']}
                          </span>
                        ) : (
                          ''
                        )}
                      </Body2>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ) : selectedSelectionType &&
              selectedSelectionType != QuestionSelectionType.RANDOM &&
              numberOfQuestion &&
              marks ? (
              <Grid item xs={3} textAlign={'center'}>
                <AddButton
                  onClick={() => openAddQuestionModal()}
                  isLoading={false}
                  tooltip={
                    <IntlMessages
                      id={'common.add_new'}
                      values={{
                        subject: messages['question_set.label'],
                      }}
                    />
                  }
                />
                <Body2
                  sx={{
                    textAlign: 'center',
                    display: 'inline-block',
                    marginLeft: '10px',
                    marginTop: '6px',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    wordBreak: 'normal',
                    lineBreak: 'strict',
                  }}>
                  {localQuestions?.[0]?.questions
                    ? formatNumber(localQuestions?.[0]?.questions.length) +
                      messages['exam.question_selected']
                    : messages['exam.no_question_selected']}
                </Body2>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>

          {isOpenAddQuestionModal &&
            numberOfQuestion &&
            marks &&
            selectedSelectionType && (
              <QuestionSetPopup
                key={1}
                onClose={closeAddQuestionModal}
                questionType={questionTypeId}
                subjectId={subjectId}
                totalQuestions={numberOfQuestion}
                totalMarks={marks}
                selectionType={selectedSelectionType}
                onQuestionsSubmitted={onQuestionsSubmitted}
                selectedQuestions={
                  isOffline || isMixed
                    ? localQuestions[offlineQuestionModalIndex]?.questions
                    : localQuestions[0]?.questions
                }
              />
            )}
        </Grid>
      )}
    </Grid>
  );
};

export default ExamQuestionTypeSection;
