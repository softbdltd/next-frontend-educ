import React from 'react';
import {NextComponentType} from 'next';
import {AppContext, AppInitialProps, AppProps} from 'next/app';
import {Provider} from 'react-redux';
import {useStore} from '../../redux/store';
import ContextProvider from '../../@core/utility/ContextProvider';
import AuthRoutes from '../../@core/utility/AuthRoutes';
import PageMeta from '../../@core/core/PageMeta';
import {LocaleProvider} from '../../@core';
import {SnackbarProvider} from 'notistack';
import Nprogress from '../../@core/utilities/Nprogress';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/index.css';
import '../../@core/services/index';
import {SWRConfig} from 'swr';
import {CookiesProvider} from 'react-cookie';
import DefaultThemeProvider from '../../@core/layouts/themes/default/DefaultThemeProvider';
import {StyledEngineProvider} from '@mui/material/styles';
import AppRootWrapper from '../../@core/components/AppRootWrapper';
import PermissionProvider from '../../@core/contexts/PermissionProvider';
import NotificationProvider from '../../@core/contexts/notification/NotificationProvider';
import NotificationSocket from '../../@core/components/NotificationSocket';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const EducAdminApp: NextComponentType<
  AppContext,
  AppInitialProps,
  AppProps
> = ({Component, pageProps}: any) => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <React.Fragment>
      <PageMeta />
      <Nprogress />
      <AppRootWrapper>
        <CookiesProvider>
          <ContextProvider>
            <Provider store={store}>
              <SWRConfig
                value={{
                  provider: () => new Map(),
                  revalidateIfStale: true,
                  revalidateOnFocus: false,
                  revalidateOnReconnect: false,
                  errorRetryCount: 3,
                }}>
                <LocaleProvider>
                  <StyledEngineProvider injectFirst>
                    <DefaultThemeProvider>
                      <AuthRoutes>
                        <PermissionProvider>
                          <NotificationProvider>
                            <NotificationSocket>
                              <SnackbarProvider
                                maxSnack={20}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}>
                                <Component {...pageProps} />
                              </SnackbarProvider>
                            </NotificationSocket>
                          </NotificationProvider>
                        </PermissionProvider>
                      </AuthRoutes>
                    </DefaultThemeProvider>
                  </StyledEngineProvider>
                </LocaleProvider>
              </SWRConfig>
            </Provider>
          </ContextProvider>
        </CookiesProvider>
      </AppRootWrapper>
    </React.Fragment>
  );
};
export default EducAdminApp;
