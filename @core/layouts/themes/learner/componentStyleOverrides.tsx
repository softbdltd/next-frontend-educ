import {Theme} from '@mui/system';
import {Components} from '@mui/material/styles/components';
import {ThemeMode} from '../../../../shared/constants/AppEnums';

export default function componentStyleOverrides(theme: Theme) {
  const overrideRules: Components = {
    MuiTypography: {
      styleOverrides: {
        root: {
          // TODO: DO NOT USE
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background:
            theme.palette.mode === ThemeMode.LIGHT
              ? theme.palette.grey['50']
              : theme.palette.grey['900'],
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          background:
            theme.palette.mode === ThemeMode.LIGHT
              ? theme.palette.grey['50']
              : theme.palette.grey['900'],
        },
      },
    },
  };

  return overrideRules;
}
