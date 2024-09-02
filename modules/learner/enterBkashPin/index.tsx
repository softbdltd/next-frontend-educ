import React from 'react';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {SubmitHandler, useForm} from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const PREFIX = 'ChoosePayment';

const classes = {
  rootContainer: `${PREFIX}-rootContainer`,
  paperBox: `${PREFIX}-paperBox`,
  sendCode: `${PREFIX}-sendCode`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  display: 'flex',
  height: 'calc(100vh - 70px)',

  [`& .${classes.paperBox}`]: {
    margin: 'auto',
  },

  [`& .${classes.sendCode}`]: {
    marginTop: '15px',
    marginBottom: '15px',
  },
}));

const ChoosePayment = () => {
  const {messages} = useIntl();

  const onSubmit: SubmitHandler<any> = async () => {};
  const {handleSubmit} = useForm();
  return (
    <StyledContainer maxWidth={'sm'}>
      <Paper style={{padding: '20px'}} className={classes.paperBox}>
        <Typography variant={'h6'} style={{fontWeight: 'bold'}}>
          {messages['common.enter_bkash_pin']}
        </Typography>
        <Typography mb={5}>{messages['common.enter_pin']}</Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField id='' variant='outlined' />
            </Grid>
            <Grid item xs={3}>
              <TextField id='' variant='outlined' />
            </Grid>
            <Grid item xs={3}>
              <TextField id='' variant='outlined' />
            </Grid>
            <Grid item xs={3}>
              <TextField id='' variant='outlined' />
            </Grid>
          </Grid>
          <Box className={classes.sendCode}>
            <Link>{messages['common.send_code_text']}</Link>
          </Box>

          <Grid item xs={12}>
            <Button
              variant='contained'
              style={{width: '200px', height: '50px'}}>
              {messages['common.confirm']}
            </Button>
          </Grid>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default ChoosePayment;
