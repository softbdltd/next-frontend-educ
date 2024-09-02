import React, {FC} from 'react';
import {TextField} from '@mui/material';
import {QuestionSelectionType} from '../../dashboard/exams/ExamEnums';
interface HiddenInputProps {
  index: number;
  question: any;
  register: any;
  section: any;
}
const HiddenInput: FC<HiddenInputProps> = ({
  index,
  question,
  register,
  section,
}) => {
  return (
    <>
      {section?.question_selection_type != QuestionSelectionType.RANDOM && (
        <TextField
          id={'questions[' + index + '].exam_section_question_id '}
          type={'hidden'}
          {...register('questions[' + index + '].exam_section_question_id')}
          defaultValue={question?.exam_section_question_id}
          sx={{display: 'none'}}
        />
      )}
      <TextField
        id={'questions[' + index + '].question_id'}
        type={'hidden'}
        {...register('questions[' + index + '].question_id')}
        defaultValue={question?.question_id}
        sx={{display: 'none'}}
      />
      <TextField
        id={'questions[' + index + '].question_type'}
        type={'hidden'}
        {...register('questions[' + index + '].question_type')}
        defaultValue={question?.question_type}
        sx={{display: 'none'}}
      />
      <TextField
        id={'questions[' + index + '].individual_marks'}
        type={'hidden'}
        {...register('questions[' + index + '].individual_marks')}
        defaultValue={question?.individual_marks}
        sx={{display: 'none'}}
      />
    </>
  );
};

export default HiddenInput;
