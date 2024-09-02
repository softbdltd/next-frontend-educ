import React, {FC, useState} from 'react';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {Grid} from '@mui/material';

interface MCQTypeQuestionProps {
  index: number;
  question: any;
  register: any;
}

const McqTypeQuestion: FC<MCQTypeQuestionProps> = ({
  index,
  question,
  register,
}) => {
  const [answers, setAnswers] = useState<any>([0, 0, 0, 0]);
  const onChangeCheckBox = (checkedValue: any) => {
    if ((answers || []).includes(checkedValue)) {
      setAnswers((prev: any) => {
        prev[checkedValue - 1] = 0;
        return prev;
      });
    } else {
      setAnswers((prev: any) => {
        prev[checkedValue - 1] = checkedValue;
        return prev;
      });
    }
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={10} display={'flex'} flexDirection={'column'}>
        <CustomCheckbox
          id={'questions[' + index + '].answers[0]'}
          label={question?.option_1}
          register={register}
          checked={answers?.includes(1)}
          onChange={() => {
            onChangeCheckBox(1);
          }}
          isLoading={false}
        />
        <CustomCheckbox
          id={'questions[' + index + '].answers[1]'}
          label={question?.option_2}
          register={register}
          checked={answers?.includes(2)}
          onChange={() => {
            onChangeCheckBox(2);
          }}
          isLoading={false}
        />
        <CustomCheckbox
          id={'questions[' + index + '].answers[2]'}
          label={question?.option_3}
          register={register}
          checked={answers?.includes(3)}
          onChange={() => {
            onChangeCheckBox(3);
          }}
          isLoading={false}
        />
        <CustomCheckbox
          id={'questions[' + index + '].answers[3]'}
          label={question?.option_4}
          register={register}
          checked={answers?.includes(4)}
          onChange={() => {
            onChangeCheckBox(4);
          }}
          isLoading={false}
        />
      </Grid>
    </Grid>
  );
};

export default McqTypeQuestion;
