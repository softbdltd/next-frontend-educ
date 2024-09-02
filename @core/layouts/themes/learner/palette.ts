import {rgba} from 'polished';
import {PaletteOptions} from '@mui/material/styles/createPalette';

const palette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#000000',
    white: '#fff',
  },
  primary: {
    main: '#048340',
    light: '#2dc778',
    dark: '#086936',
    contrastText: '#fff',
  },
  secondary: {
    main: '#3F51B5',
    light: '#536DFE',
    dark: '#303F9F',
    contrastText: '#fff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#fff',
  },
  warning: {
    main: '#ED6C02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#fff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#fff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#fff',
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
  text: {
    primary: rgba(0, 0, 0, 0.87),
    secondary: rgba(0, 0, 0, 0.6),
    disabled: rgba(0, 0, 0, 0.38),
  },
  background: {
    paper: '#ffffff',
    default: '#fff',
  },
  action: {
    active: rgba(0, 0, 0, 0.54),
    hover: rgba(0, 0, 0, 0.04),
    hoverOpacity: 0.04,
    selected: rgba(0, 0, 0, 0.08),
    selectedOpacity: 0.08,
    disabled: rgba(0, 0, 0, 0.26),
    disabledBackground: rgba(0, 0, 0, 0.12),
    disabledOpacity: 0.38,
    focus: rgba(0, 0, 0, 0.12),
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
  },
};

export default palette;
