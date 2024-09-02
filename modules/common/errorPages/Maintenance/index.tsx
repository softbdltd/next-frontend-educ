import React from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import IntlMessages from '../../../@core/utility/IntlMessages';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {grey} from '@mui/material/colors';
import {Fonts} from '../../../shared/constants/AppEnums';
import {initialUrl} from '../../../shared/constants/AppConst';
import {useRouter} from 'next/router';

const PREFIX = 'Maintenance';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledBox = styled(Box)(() => {
  return {
    [`& .${classes.button}`]: {
      fontWeight: Fonts.BOLD,
      fontSize: 16,
      textTransform: 'capitalize',
    },
  };
});

const Maintenance = () => {
  const router = useRouter();

  const onGoBackToHome = () => {
    router.push(initialUrl);
  };

  return (
    <StyledBox
      py={{xl: 8}}
      flex={1}
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'>
      <Box mb={{xs: 8, xl: 16}}>
        <Box
          component='h3'
          mb={{xs: 4, xl: 12}}
          fontSize={{xs: 20, md: 24}}
          fontWeight={Fonts.BOLD}>
          <IntlMessages id='error.mantainanceMessage1' />
        </Box>
        <Box
          mb={{xs: 5, xl: 16}}
          color={grey[600]}
          fontSize={16}
          fontWeight={Fonts.MEDIUM}>
          <Typography>
            <IntlMessages id='error.mantainanceMessage2' />
          </Typography>
          <Typography>
            <IntlMessages id='error.mantainanceMessage3' />.
          </Typography>
        </Box>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={onGoBackToHome}>
          <IntlMessages id='error.takeMeToHome' />
        </Button>
      </Box>
      <Box mb={5} maxWidth={{xs: 300, sm: 400, xl: 672}} width='100%'>
        <img src={'/images/errorPageImages/maintenance.png'} alt='404' />
      </Box>
    </StyledBox>
  );
};

export default Maintenance;
