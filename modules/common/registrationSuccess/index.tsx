import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import {Link} from '../../@core/elements/common';
import {StyledContainer} from './index.style';
import {useIntl} from 'react-intl';

const RegistrationSuccess = () => {
  const {messages} = useIntl();

  return (
    <StyledContainer maxWidth={'lg'}>
      <Box sx={{textAlign: 'center', margin: 'auto', maxWidth: '700px'}}>
        <Card>
          <CardContent>
            <CardMedia
              component='img'
              alt={messages['common.registration_success'] as string}
              height='350'
              image='/images/success.png'
            />
            <Typography
              variant={'h5'}
              align={'center'}
              style={{marginTop: '10px', marginBottom: '10px'}}>
              {messages['common.registration_success']}
            </Typography>
            <Link href='/'>
              <Button color='primary' variant={'contained'}>
                {messages['common.goto_homepage']}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    </StyledContainer>
  );
};

export default RegistrationSuccess;
