import React from 'react';
import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {formatDateTime} from '../../../services/global/globalService';

type Props = {
  itemData: any;
};

const EventCalendarDetails = ({itemData, ...props}: Props) => {
  // if (itemData) {
  //   itemData.start_date = moment(itemData.start).format(DATE_FORMAT);
  //   itemData.end_date = moment(itemData.end).format(DATE_FORMAT);
  //   itemData.start_time = moment(itemData.start).format(TIME_FORMAT);
  //   itemData.end_time = moment(itemData.end).format(TIME_FORMAT);
  // }
  formatDateTime(itemData);
  const {messages} = useIntl();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <DetailsInputView
            label={messages['common.title']}
            value={itemData?.title}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.event_start_date']}
            value={itemData?.start_date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.event_end_date']}
            value={itemData?.start_date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.start_time']}
            value={itemData?.start_time}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.end_time']}
            value={itemData?.end_time}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default EventCalendarDetails;
