import {useTheme} from '@mui/material';
import {useContext} from 'react';
import AppContextPropsType from '../../redux/types/AppContextPropsType';
import AppContext from '../../@core/utility/AppContext';
import AppLocale from '../../shared/localization';
import typography from '../layouts/themes/default/typography';

export function useCustomStyle() {
  const theme = useTheme();
  const {locale} = useContext<AppContextPropsType>(AppContext);
  const currentAppLocale = AppLocale[locale.locale];
  return typography(theme, currentAppLocale.locale);
}
