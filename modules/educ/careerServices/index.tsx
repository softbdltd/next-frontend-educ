import React from 'react';
import {Container, Stack, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {H3} from '../../../@core/elements/common';
import Box from '@mui/material/Box';
import IntlMessages from '../../../@core/utility/IntlMessages';
import Button from '@mui/material/Button';
import {useRouter} from 'next/router';
import {initialUrl} from '../../../shared/constants/AppConst';
import CallMadeIcon from '@mui/icons-material/CallMade';

const CareerServices = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const onGoBackToHome = () => {
    router.push(initialUrl);
  };

  return (
    <Container maxWidth={'lg'}>
      <Stack mt={4} textAlign={'center'} spacing={2} justifyContent={'center'}>
        <Box
          mb={{xs: 2, xl: 8}}
          width='100%'
          sx={{
            pt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img src={'/images/under_construction.png'} alt='404' width='350px' />
        </Box>
        <H3 fontWeight={'bold'} style={{fontSize: '1.5rem'}}>
          {messages['common.construction']}
        </H3>
        <Typography variant={'body1'} tabIndex={0} color={'#5E6062'}>
          {messages['common.working']}
        </Typography>
        <Box>
          <Button
            variant='outlined'
            color='primary'
            endIcon={<CallMadeIcon />}
            onClick={onGoBackToHome}>
            <IntlMessages id='common.back_to_home' />
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default CareerServices;
