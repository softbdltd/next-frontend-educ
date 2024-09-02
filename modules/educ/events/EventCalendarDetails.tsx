import React from 'react';
import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import DetailsInputView from '../../@core/elements/display/DetailsInputView/DetailsInputView';
import {formatDateTime} from '../../services/global/globalService';
import ImageView from '../../@core/elements/display/ImageView/ImageView';
import {Link} from '../../@core/elements/common';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../@core/common/apiRoutes';
import CommonButton from '../../@core/elements/button/CommonButton/CommonButton';
import DownloadIcon from '@mui/icons-material/Download';

type Props = {
  itemData: any;
  isLoading?: boolean;
};

const EventCalendarDetails = ({itemData, isLoading, ...props}: Props) => {
  // if (itemData) {
  //   itemData.start_date = moment(itemData.start).format(DATE_FORMAT);
  //   itemData.end_date = moment(itemData.end).format(DATE_FORMAT);
  //   itemData.start_time = moment(itemData.start).format(TIME_FORMAT);
  //   itemData.end_time = moment(itemData.end).format(TIME_FORMAT);
  // }
  formatDateTime(itemData);
  const {messages} = useIntl();
  console.log('calendar evemt', itemData);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.title']}
          value={itemData?.title}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DetailsInputView
          label={messages['common.title_en']}
          value={itemData?.title_en}
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
      {itemData?.image_path && (
        <Grid item xs={12} md={6}>
          <Link
            href={FILE_SERVER_FILE_VIEW_ENDPOINT + itemData?.image_path}
            target={'_blank'}>
            <ImageView
              label={messages['common.photo']}
              imageUrl={itemData?.image_path}
              isLoading={isLoading}
            />
          </Link>
        </Grid>
      )}
      {itemData?.file_path && (
        <Grid item xs={12} md={6}>
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
    </Grid>
  );
};
export default EventCalendarDetails;
