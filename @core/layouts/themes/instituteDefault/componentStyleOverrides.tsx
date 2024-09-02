import {Theme} from '@mui/system';
import {Components} from '@mui/material/styles/components';

export default function componentStyleOverrides(theme: Theme) {
  const overrideRules: Components = {
    MuiTypography: {
      styleOverrides: {
        root: {
          //TODO: DO NOT USE
        },
      },
    },
  };

  return overrideRules;
}
