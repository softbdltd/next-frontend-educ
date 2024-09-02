import React from 'react';
import {styled} from '@mui/material/styles';
import {Button, Container, Paper, Typography} from '@mui/material';

const PREFIX = 'YouthConfirmEmail';

const classes = {
  PaperBox: `${PREFIX}-PaperBox`,
  btn: `${PREFIX}-btn`,
  text: `${PREFIX}-text`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.PaperBox}`]: {
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.btn}`]: {
    width: '200px',
    height: '50px',
    marginTop: '40px',
  },

  [`& .${classes.text}`]: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
}));

const YouthConfirmEmail = () => {
  return (
    <StyledContainer maxWidth={'sm'} style={{marginTop: '100px'}}>
      <Paper className={classes.PaperBox}>
        <Typography variant={'h5'} className={classes.text}>
          Confirm your email address
        </Typography>
        <Typography style={{marginBottom: '10px'}}>
          Please click the button below to confirm your email
        </Typography>
        <Button variant='contained' className={classes.btn}>
          Confirm email
        </Button>
      </Paper>
    </StyledContainer>
  );
};

export default YouthConfirmEmail;
