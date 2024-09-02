import {styled} from '@mui/material/styles';
import {Paper} from '@mui/material';

const PREFIX = 'VerifyCodeComponent';

export const classes = {
  sendCode: `${PREFIX}-sendCode`,
  errorMessage: `${PREFIX}-errorMessage`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
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
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));
