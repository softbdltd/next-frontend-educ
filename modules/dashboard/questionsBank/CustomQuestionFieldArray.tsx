import React, {useMemo, useState} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import TextInputSkeleton from '../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {OPTIONS, QuestionType} from './QuestionBanksEnums';
import {AnswerType} from '../rplQuestionBanks/QuestionEnums';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';

type Props = {
  id: string;
  isLoading?: boolean;
  register: any;
  errors: any;
  control: any;
  subjects?: any;
  isFetchingSubjects?: any;
  itemNum?: any;
  selectedTypeOnChange?: any;
  onSubjectChange?: any;
};

const CustomQuestionFieldArray = ({
  id,
  isLoading,
  errors,
  control,
  subjects,
  isFetchingSubjects,
  itemNum,
  selectedTypeOnChange,
  onSubjectChange,
}: Props) => {
  const {messages} = useIntl();

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const onChangeType = (value: any) => {
    selectedTypeOnChange(value ? String(value) : null);
    setSelectedType(value ? String(value) : null);
  };

  const questionTypes = useMemo(
    () => [
      {
        key: QuestionType.MCQ,
        label: messages['question.type.mcq'],
      },
      {
        key: QuestionType.FILL_IN_THE_BLANK,
        label: messages['common.fill_in_the_blanks'],
      },
      {
        key: QuestionType.YES_NO,
        label: messages['question.type.y_n'],
      },
      {
        key: QuestionType.DESCRIPTIVE,
        label: messages['common.descriptive'],
      },
    ],
    [messages],
  );

  const answerOptions = useMemo(
    () => [
      {
        id: OPTIONS.OPTION_1,
        label: messages['option.option1'],
      },
      {
        id: OPTIONS.OPTION_2,
        label: messages['option.option2'],
      },
      {
        id: OPTIONS.OPTION_3,
        label: messages['option.option3'],
      },
      {
        id: OPTIONS.OPTION_4,
        label: messages['option.option4'],
      },
    ],
    [messages],
  );

  const yesNoOption = useMemo(
    () => [
      {
        id: AnswerType.YES,
        label: messages['answer.type.yes'],
      },
      {
        id: AnswerType.NO,
        label: messages['answer.type.no'],
      },
    ],
    [messages],
  );

  let subjectId = `${id}[subject_id]`;
  let questionTypeId = `${id}[question_type]`;
  let titleId = `${id}[title]`;
  let titleEnId = `${id}[title_en]`;
  let option1Id = `${id}[option_1]`;
  let option2Id = `${id}[option_2]`;
  let option3Id = `${id}[option_3]`;
  let option4Id = `${id}[option_4]`;
  let option1EnId = `${id}[option1_en]`;
  let option2EnId = `${id}[option2_en]`;
  let option3EnId = `${id}[option3_en]`;
  let option4EnId = `${id}[option4_en]`;
  let answersId = `${id}[answers]`;
  let answers1Id = `${id}[answers1]`;

  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <React.Fragment>
      <Box border={2} marginTop={2} padding={2}>
        <Grid container item spacing={4}>
          <Grid item xs={12}>
            <Typography variant={'h6'}>
              {messages['question_no.label']} {itemNum + 1}
            </Typography>
          </Grid>
          {/*<Grid item xs={12} sm=6> md=6*/}
          {/*  <CustomFilterableFormSelect*/}
          {/*    required*/}
          {/*    id={subjectId}*/}
          {/*    label={messages['subject.label']}*/}
          {/*    isLoading={isFetchingSubjects}*/}
          {/*    control={control}*/}
          {/*    options={subjects}*/}
          {/*    optionValueProp={'id'}*/}
          {/*    optionTitleProp={['title']}*/}
          {/*    errorInstance={errors}*/}
          {/*  />*/}
          {/*</Grid>*/}
          <Grid item xs={12} sm={6} md={6}>
            <CustomFilterableFormSelect
              required
              id={subjectId}
              label={messages['subject.label']}
              isLoading={isFetchingSubjects}
              control={control}
              options={subjects}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              onChange={onSubjectChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <CustomFilterableFormSelect
              required
              id={questionTypeId}
              label={messages['question.type']}
              isLoading={false}
              control={control}
              options={questionTypes}
              optionValueProp={'key'}
              optionTitleProp={['label']}
              errorInstance={errors}
              onChange={onChangeType}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              required
              id={titleId}
              label={messages['common.question']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
            />
            {selectedType == QuestionType.FILL_IN_THE_BLANK && (
              <Box
                sx={{
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  marginTop: '6px',
                  color: 'green',
                }}>
                Ex: This is [[fill in the blank]] question.(Ans will be in [[]]
                (double square brackets), and it will be blank in question.)
              </Box>
            )}
          </Grid>
          {selectedType != QuestionType.FILL_IN_THE_BLANK && (
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id={titleEnId}
                label={messages['common.question_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
          )}

          {selectedType == QuestionType.MCQ && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  required
                  id={option1Id}
                  label={messages['option.option1']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id={option1EnId}
                  label={messages['option.option1_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  required
                  id={option2Id}
                  label={messages['option.option2']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id={option2EnId}
                  label={messages['option.option2_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  required
                  id={option3Id}
                  label={messages['option.option3']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id={option3EnId}
                  label={messages['option.option3_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  required
                  id={option4Id}
                  label={messages['option.option4']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id={option4EnId}
                  label={messages['option.option4_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
            </>
          )}

          {selectedType == QuestionType.MCQ && (
            <Grid item xs={12} sm={6} md={6}>
              <CustomSelectAutoComplete
                id={answersId}
                required={true}
                label={messages['question.answer']}
                isLoading={false}
                control={control}
                options={answerOptions}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>
          )}
          {selectedType == QuestionType.YES_NO && (
            <Grid item xs={12} sm={6} md={6}>
              <CustomFilterableFormSelect
                id={answers1Id}
                required={true}
                label={messages['question.answer']}
                isLoading={false}
                control={control}
                options={yesNoOption}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default CustomQuestionFieldArray;
