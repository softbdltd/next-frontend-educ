import React, {FC} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useIntl} from 'react-intl';

const PREFIX = 'DeleteAccountView';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.button}`]: {
    margin: theme.spacing(1),
    width: '150px',
    marginLeft: '10px',
    padding: '10px',
  },
}));

interface DeleteAccountViewProps {
  onBack: () => void;
}

const DeleteAccountView: FC<DeleteAccountViewProps> = ({onBack}) => {
  const {messages} = useIntl();

  const handleClick = () => {};

  return (
    <StyledCard>
      <Box sx={{backgroundColor: '#f510100f', padding: '20px'}}>
        <Box style={{display: 'flex'}}>
          <DeleteIcon
            style={{
              color: '#f04f47',
              marginRight: '5px',
              transform: 'scale(1.2)',
              marginTop: '6px',
            }}
          />
          <Typography variant={'h6'} style={{fontWeight: 'bold'}}>
            {messages['common.deactivate_account']}
          </Typography>
        </Box>
        <Typography style={{marginLeft: '30px', marginBottom: '10px'}}>
          {messages['common.deactivate_warning_text']}
        </Typography>
      </Box>

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography style={{marginLeft: '30px', fontWeight: 'bold'}}>
              {messages['common.deactivate_confirm_text']}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{marginLeft: '30px'}}>
            <Button
              variant='contained'
              color='error'
              className={classes.button}
              onClick={handleClick}>
              {messages['common.proceed']}
            </Button>
            <Button
              variant={'contained'}
              onClick={onBack}
              color='primary'
              className={classes.button}>
              {messages['common.cancel']}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default DeleteAccountView;
