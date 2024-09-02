import {useIntl} from 'react-intl';
import {Grid} from '@mui/material';
import React from 'react';
import DetailsInputView from '../../../../@core/elements/display/DetailsInputView/DetailsInputView';
import DecoratedRowStatus from '../../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import {
  getIntlDateFromString,
  getIntlNumber,
} from '../../../../@core/utilities/helpers';

interface IProps {
  exam: any;
  examData: any;
  examType: any;
}

const OtherExamDetails = ({exam, examData, examType}: IProps) => {
  const {messages, formatTime, formatNumber} = useIntl();

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.title']}
          value={examData?.title}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.title_en']}
          value={examData?.title_en}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.exam_type']}
          value={examType(examData?.type)}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.total_marks']}
          value={getIntlNumber(formatNumber, exam?.total_marks)}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.start_date']}
          value={getIntlDateFromString(formatTime, exam?.start_date)}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.end_date']}
          value={getIntlDateFromString(formatTime, exam?.end_date)}
          isLoading={false}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.status']}
          value={<DecoratedRowStatus rowStatus={examData?.row_status} />}
          isLoading={false}
        />
      </Grid>
    </Grid>
  );
};

export default OtherExamDetails;
