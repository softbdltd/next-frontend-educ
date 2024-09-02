import React from 'react';
import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import moment from 'moment';
import {DATE_FORMAT, TIME_FORMAT} from '../../../@core/utilities/DateTime';
import {ICalendar} from '../../../shared/Interface/common.interface';
import ImageView from '../../../@core/elements/display/ImageView/ImageView';
import {Link} from '../../../@core/elements/common';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import DownloadIcon from '@mui/icons-material/Download';

type Props = {
  itemData: ICalendar;
  isLoading?: boolean;
};

const EventCalendarDetails = ({itemData, isLoading, ...props}: Props) => {
  const eventStart = itemData?.start_time
    ? `${itemData.start_date}T${itemData.start_time}`
    : itemData?.start_date;
  const eventEnd = itemData?.end_time
    ? `${itemData.end_date}T${itemData.end_time}`
    : itemData?.end_date;
  const start_date = eventStart ? moment(eventStart).format(DATE_FORMAT) : null;
  const end_date = eventEnd ? moment(eventEnd).format(DATE_FORMAT) : null;
  const start_time = eventStart ? moment(eventStart).format(TIME_FORMAT) : null;
  const end_time = eventEnd ? moment(eventEnd).format(TIME_FORMAT) : null;
  const {messages} = useIntl();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            label={messages['common.title']}
            value={itemData?.title}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            label={messages['common.title_en']}
            value={itemData?.title_en}
          />
        </Grid>
        {itemData?.image_path && (
          <Grid item xs={12} sm={6} md={6}>
            <ImageView
              label={messages['common.photo']}
              imageUrl={itemData?.image_path}
              isLoading={isLoading}
            />
          </Grid>
        )}
        {itemData?.file_path && (
          <Grid item xs={12} sm={6} md={6}>
            <Link
              underline='none'
              href={`${FILE_SERVER_FILE_VIEW_ENDPOINT + itemData?.file_path}`}
              download
              target={'_blank'}
              style={{
                display: 'flex',
                justifyContent: 'start',
                marginTop: '2rem',
              }}>
              <CommonButton
                startIcon={<DownloadIcon />}
                key={1}
                onClick={() => console.log('file downloading')}
                btnText={'common.download_file'}
                variant={'outlined'}
                color={'primary'}
              />
            </Link>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            label={messages['common.event_start_date']}
            value={start_date}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            label={messages['common.event_end_date']}
            value={end_date}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            label={messages['common.start_time']}
            value={start_time}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            label={messages['common.end_time']}
            value={end_time}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default EventCalendarDetails;
