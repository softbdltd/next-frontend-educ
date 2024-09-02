import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {Box, Button} from '@mui/material';
import {H4} from '../../../@core/elements/common';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import {educDomain} from '../../../@core/common/constants';
import React from 'react';

const YouthCdapRegistrationFailedView = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const getErrorMessage = () => {
    let errorKey = router.query.error;
    if (errorKey) {
      return messages[`cdap_reg.${errorKey}`];
    } else {
      return '';
    }
  };

  return (
    <Box sx={{width: '100%', display: 'flex'}}>
      <Box sx={{margin: 'auto', textAlign: 'center'}}>
        <SentimentVeryDissatisfiedIcon
          color={'info'}
          sx={{width: '65px', height: '65px', marginBottom: '10px'}}
        />
        <H4>{getErrorMessage()}</H4>
        <Box sx={{marginTop: '20px'}}>
          <Button
            size={'medium'}
            variant={'contained'}
            onClick={() => {
              router.push(educDomain());
            }}>
            {messages['error.goBackToHome']}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default YouthCdapRegistrationFailedView;
