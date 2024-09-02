import {PaletteOptions} from '@mui/material/styles/createPalette';
import {ThemeMode} from '../../../../shared/constants/AppEnums';

const palette: PaletteOptions = {
  mode: ThemeMode.LIGHT,
  background: {
    paper: '#FFFFFF',
    default: '#FFF',
  },
  primary: {
    main: '#0A8FDC',
    light: '#0ab1ff',
    dark: '#085da6',
    contrastText: '#fff',
  },
  secondary: {
    main: '#dc570a',
    light: '#ec7f10',
    dark: '#c74d05',
    contrastText: '#fff',
  },
  text: {
    primary: '#495057',
    secondary: '#74788d',
    disabled: '#909098',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: '#f5f5f5',
    A200: '#eeeeee',
    A400: '#bdbdbd',
    A700: '#616161',
  },
};

export default palette;
