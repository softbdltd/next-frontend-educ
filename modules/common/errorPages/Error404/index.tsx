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

const PREFIX = 'Error404';

const classes = {
  button: `${PREFIX}-button`,
  image: `${PREFIX}-image`,
};

const StyledBox = styled(Box)(() => {
  return {
    [`& .${classes.button}`]: {
      fontWeight: Fonts.BOLD,
      fontSize: 16,
      textTransform: 'capitalize',
    },
    [`& .${classes.image}`]: {
      width: '100%',
    },
  };
});

const Error404 = () => {
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
      <Box
        mb={{xs: 4, xl: 8}}
        width='100%'
        maxWidth={{xs: 200, sm: 300, xl: 706}}>
        <img
          className={classes.image}
          src={'/images/errorPageImages/404.png'}
          alt='404'
        />
      </Box>
      <Box mb={{xs: 4, xl: 5}}>
        <Box
          mb={{xs: 3, xl: 10}}
          fontSize={{xs: 20, md: 24}}
          fontWeight={Fonts.BOLD}>
          <IntlMessages id='error.404Error' />.
        </Box>
        <Box
          mb={{xs: 4, xl: 10}}
          color={grey[600]}
          fontSize={16}
          fontWeight={Fonts.MEDIUM}>
          <Typography>
            <IntlMessages id='error.message1' />
          </Typography>
          <Typography>
            <IntlMessages id='error.message2' />
          </Typography>
        </Box>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={onGoBackToHome}>
          <IntlMessages id='error.goBackToHome' />
        </Button>
      </Box>
    </StyledBox>
  );
};

export default Error404;
