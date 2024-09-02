import {styled} from '@mui/material/styles';
import {Paper} from '@mui/material';

const PREFIX = 'VerifyCodeComponent';

export const classes = {
  sendCode: `${PREFIX}-sendCode`,
  errorMessage: `${PREFIX}-errorMessage`,
};

export const StyledPaper = styled(Paper)(({theme}) => ({
  margin: 'auto',
  padding: '20px',
  width: '100%',
  maxWidth: '400px',

  [`& .${classes.sendCode}`]: {
    marginTop: '15px',
    marginBottom: '15px',
  },

  [`& .${classes.errorMessage}`]: {
    color: theme.palette.error.main,
    marginTop: '5px',
  },
}));
