import React from 'react';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {useForm} from 'react-hook-form';
import {Button, Container, Paper, Typography} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';

const PREFIX = 'ChoosePayment';

const classes = {
  paperBox: `${PREFIX}-paperBox`,
  btn: `${PREFIX}-btn`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  display: 'flex',
  height: 'calc(100vh - 70px)',

  [`& .${classes.paperBox}`]: {
    margin: 'auto',
  },

  [`& .${classes.btn}`]: {
    marginTop: '12px',
    width: '100px',
  },
}));

const ChoosePayment = () => {
  const {messages} = useIntl();

  const {
    control,
    formState: {errors},
  } = useForm<any>();
  return (
    <StyledContainer maxWidth={'sm'}>
      <Paper style={{padding: '20px'}} className={classes.paperBox}>
        <Typography variant={'h6'} style={{fontWeight: 'bold'}} mb={5}>
          {messages['common.enter_bkash_number']}
        </Typography>
        <form>
          <CustomTextInput
            id='phone_number'
            label={messages['common.phone_number']}
            control={control}
            errorInstance={errors}
          />
          <Button variant='contained' className={classes.btn}>
            {messages['common.next']}
          </Button>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default ChoosePayment;
