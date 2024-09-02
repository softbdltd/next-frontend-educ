import {Checkbox, FormControlLabel} from '@mui/material';

interface IProps {
  label: any;
}

const QuestionTypeCheckedBox = ({label}: IProps) => {
  return (
    <FormControlLabel
      disabled
      control={<Checkbox checked={true} />}
      label={label}
      componentsProps={
        label
          ? {
              typography: {
                sx: {color: 'green !important'},
              },
            }
          : {}
      }
    />
  );
};

export default QuestionTypeCheckedBox;
