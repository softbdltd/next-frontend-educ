import React, {FC} from 'react';
import {Checkbox, FormControlLabel, Grid} from '@mui/material';

import {useIntl} from 'react-intl';
import {getIntlNumber} from '../../../../@core/utilities/helpers';
import {Body2} from '../../../../@core/elements/common';

interface McqTypeComponentProps {
  question: any;
  index: number;
}

const MCQTypeComponent: FC<McqTypeComponentProps> = ({question, index}) => {
  const {formatNumber} = useIntl();
  return (
    <Grid container spacing={1}>
      <Grid item xs={10} display={'flex'}>
        <Body2 sx={{fontWeight: 'bold', whiteSpace: 'pre'}}>
          {getIntlNumber(formatNumber, index) + '. ' + ' '}
        </Body2>
        <Body2>{question?.title}</Body2>
        <Body2 sx={{fontWeight: 'bold', marginLeft: '5px'}}>
          {'(' + getIntlNumber(formatNumber, question?.individual_marks) + ')'}
        </Body2>
      </Grid>
      <Grid item xs={2}>
        <Body2 sx={{fontWeight: 'bold', textAlign: 'center'}}>
          {question?.marks_achieved ? (
            <>{getIntlNumber(formatNumber, question?.marks_achieved)}</>
          ) : (
            <>{''}</>
          )}
        </Body2>
      </Grid>
      <Grid item xs={10} display={'flex'} flexDirection={'column'}>
        <FormControlLabel
          disabled
          control={<Checkbox checked={question?.answers?.includes('1')} />}
          label={question?.option_1}
          componentsProps={
            question?.correct_answers?.includes('1')
              ? {
                  typography: {
                    sx: {color: 'green !important', fontWeight: 'bold'},
                  },
                }
              : {}
          }
        />
        <FormControlLabel
          disabled
          control={<Checkbox checked={question?.answers?.includes('2')} />}
          label={question?.option_2}
          componentsProps={
            question?.correct_answers?.includes('2')
              ? {
                  typography: {
                    sx: {color: 'green !important', fontWeight: 'bold'},
                  },
                }
              : {}
          }
        />
        <FormControlLabel
          disabled
          control={<Checkbox checked={question?.answers?.includes('3')} />}
          label={question?.option_3}
          componentsProps={
            question?.correct_answers?.includes('3')
              ? {
                  typography: {
                    sx: {color: 'green !important', fontWeight: 'bold'},
                  },
                }
              : {}
          }
        />
        <FormControlLabel
          disabled
          control={<Checkbox checked={question?.answers?.includes('4')} />}
          label={question?.option_4}
          componentsProps={
            question?.correct_answers?.includes('4')
              ? {
                  typography: {
                    sx: {color: 'green !important', fontWeight: 'bold'},
                  },
                }
              : {}
          }
        />
      </Grid>
    </Grid>
  );
};

export default MCQTypeComponent;
