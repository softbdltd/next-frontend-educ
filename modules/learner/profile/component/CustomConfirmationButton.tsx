import ConfirmationButton from '../../../../@core/elements/button/ConfirmationButton';
import {styled} from '@mui/material/styles';

const CustomConfirmationButton = styled(ConfirmationButton)(({theme}) => ({
  border: '1px solid',
  borderColor: theme.palette.error.main,
  borderRadius: 40,
  marginLeft: 5,
  padding: '5px 20px',
}));

export default CustomConfirmationButton;
