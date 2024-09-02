import React, {FC} from 'react';

import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import {useIntl} from 'react-intl';
import {getIntlNumber} from '../../../../@core/utilities/helpers';
import {Body2} from '../../../../@core/elements/common';
import {Fonts} from '../../../../shared/constants/AppEnums';

const PREFIX = 'FillInTheBlankTypeComponent';

const classes = {
  inputView: `${PREFIX}-inputView`,
  label: `${PREFIX}-label`,
};

const StyledGrid = styled(Grid)(() => {
  return {
    [`& .${classes.inputView}`]: {
      fontWeight: Fonts.MEDIUM,
      padding: '0px 30px',
      borderBottom: '1px solid',
      textAlign: 'center',
    },
  };
});

interface FillInTheBlankTypeComponentProps {
  question: any;
  index: number;
}

const FillInTheBlankTypeComponent: FC<FillInTheBlankTypeComponentProps> = ({
  question,
  index,
}) => {
  const {messages, formatNumber} = useIntl();
  return (
    <StyledGrid container spacing={2}>
      <Grid item xs={10} display={'flex'} key={1}>
        <Body2 sx={{fontWeight: 'bold', whiteSpace: 'pre'}}>
          {getIntlNumber(formatNumber, index) + '. ' + ' '}
        </Body2>
        <Body2 sx={{whiteSpace: 'pre'}}>{question?.title}</Body2>
        <Body2 sx={{fontWeight: 'bold', marginLeft: '5px'}}>
          {'(' + getIntlNumber(formatNumber, question?.individual_marks) + ')'}
        </Body2>
        <Body2 sx={{marginLeft: '10px'}}>
          {messages['question.given_answer']}:
          <span style={{fontWeight: 'bold'}}>
            {question?.answers?.join(', ')}
          </span>
        </Body2>
      </Grid>
      <Grid item xs={2}>
        <Body2 sx={{fontWeight: 'bold', textAlign: 'center'}}>
          {getIntlNumber(formatNumber, question?.marks_achieved)}
        </Body2>
      </Grid>
    </StyledGrid>
  );
};

export default FillInTheBlankTypeComponent;
