import {styled} from '@mui/material/styles';
import DeleteButton from '../../../../@core/elements/button/DeleteButton/DeleteButton';

const CircularDeleteButton = styled(DeleteButton)(({theme}) => ({
  border: '1px solid',
  borderColor: theme.palette.error.main,
  borderRadius: 40,
  marginLeft: 5,
  padding: '5px 20px',
}));

export default CircularDeleteButton;
