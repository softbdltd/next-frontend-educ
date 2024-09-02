import {Grid, Typography} from '@mui/material';
import React from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';

interface NoDataFoundComponentProps {
  message?: string;
  messageType?: string | MessageFormatElement[];
  messageTextType?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'inherit';
  sx?: any;
}

const NoDataFoundComponent = ({
  message,
  messageType,
  messageTextType,
  sx,
}: NoDataFoundComponentProps) => {
  const {messages} = useIntl();

  return (
    <Grid
      container
      sx={
        sx
          ? sx
          : {
              justifyContent: 'center',
              marginTop: 5,
            }
      }>
      <Typography
        tabIndex={0}
        variant={messageTextType ?? 'h4'}
        sx={{
          textTransform: 'lowercase',
          ':first-letter': {
            textTransform: 'capitalize',
          },
        }}>
        {messageType ? (
          <IntlMessages
            id={'common.no_data_found_dynamic'}
            values={{
              messageType: messageType,
            }}
          />
        ) : (
          message ?? messages['common.no_data_found']
        )}
      </Typography>
    </Grid>
  );
};

export default NoDataFoundComponent;
