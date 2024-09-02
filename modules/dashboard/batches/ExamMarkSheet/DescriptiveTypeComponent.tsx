import React, {FC, ReactNode} from 'react';
import {useIntl} from 'react-intl';
import {Grid} from '@mui/material';
import {getIntlNumber} from '../../../../@core/utilities/helpers';
import {Body2} from '../../../../@core/elements/common';
import DetailsInputView from '../../../../@core/elements/display/DetailsInputView/DetailsInputView';

interface DescriptiveViewProps {
  question: any;
  inputField?: ReactNode;
  index: number;
}

const DescriptiveTypeComponent: FC<DescriptiveViewProps> = ({
  question,
  inputField,
  index,
}) => {
  const {messages, formatNumber} = useIntl();
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
          {inputField ? (
            inputField
          ) : question?.marks_achieved ? (
            <>{getIntlNumber(formatNumber, question?.marks_achieved)}</>
          ) : (
            <>{''}</>
          )}
        </Body2>
      </Grid>
      <Grid item xs={10} sx={{marginLeft: '20px'}}>
        <DetailsInputView
          label={messages['common.answer']}
          value={
            question?.answers?.[0]
              ? question?.answers?.[0]
              : messages['exam.not_answered']
          }
          isLoading={false}
        />
      </Grid>
    </Grid>
  );
};

export default DescriptiveTypeComponent;
