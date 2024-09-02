import React from 'react';
import {Container, Stack, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useRouter} from 'next/router';
import CallMadeIcon from '@mui/icons-material/CallMade';
import IntlMessages from '../../@core/utility/IntlMessages';
import {initialUrl} from '../../shared/constants/AppConst';
import {H6} from '../elements/common';

const UnderConstructionComponent = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const onGoBackToHome = () => {
    router.push(initialUrl);
  };

  return (
    <Container maxWidth={'lg'} sx={{py: 2}}>
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
        <H6 fontWeight={'bold'} style={{fontSize: '1.5rem'}}>
          {messages['common.construction']}
        </H6>
        <Typography variant={'body1'} color={'#5E6062'}>
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

export default UnderConstructionComponent;
