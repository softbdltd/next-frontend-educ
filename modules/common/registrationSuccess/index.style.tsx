import {styled} from '@mui/material/styles';
import {Container} from '@mui/material';
import {SECONDARY_APP_HEADER_HEIGHT} from '../../@core/common/constants';

export const StyledContainer = styled(Container)(({theme}) => ({
  height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
  display: 'flex',
  [theme.breakpoints.only('xs')]: {
    height: 'calc(100vh - 56px)',
  },
  [theme.breakpoints.only('sm')]: {
    height: 'calc(100vh - 75px)',
  },
}));
