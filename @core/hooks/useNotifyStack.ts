import {
  OptionsObject,
  SnackbarKey,
  SnackbarMessage,
  useSnackbar,
} from 'notistack';
import {useCallback} from 'react';

const useNotiStack = () => {
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const errorStack = useCallback(
    (message: SnackbarMessage, options?: OptionsObject) =>
      enqueueSnackbar(message, {...{variant: 'error'}, ...options}),
    [],
  );

  const successStack = useCallback(
    (message: SnackbarMessage, options?: OptionsObject) =>
      enqueueSnackbar(message, {...{variant: 'success'}, ...options}),
    [],
  );

  const warningStack = useCallback(
    (message: SnackbarMessage, options?: OptionsObject) =>
      enqueueSnackbar(message, {...{variant: 'warning'}, ...options}),
    [],
  );

  const closeNotiStack = useCallback(
    (key?: SnackbarKey) => closeSnackbar(key),
    [],
  );

  return {
    errorStack,
    successStack,
    warningStack,
    closeNotiStack,
  };
};

export default useNotiStack;
