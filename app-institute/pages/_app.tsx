import React from 'react';
import {NextComponentType} from 'next';
import {AppContext, AppInitialProps, AppProps} from 'next/app';
import {Provider} from 'react-redux';
import {useStore} from '../../redux/store';
import ContextProvider from '../../@core/utility/ContextProvider';
import AuthRoutes from '../../@core/utility/AuthRoutes';
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
import DomainProvider from '../../@core/contexts/domain';
import InstituteDetailsProvider from '../../@core/layouts/frontEnd/InstituteDefaultLayout/contexts/InstituteDetailsProvider';
import PromotionBannerProvider from '../../@core/utility/ContextProvider/PromotionBannerProvider';
// import {removeBrowserCookie} from '../../@core/libs/cookieInstance';
// import {POPUP_EDUC_LANDING} from '../../shared/constants/AppConst';

const EducAdminApp: NextComponentType<
  AppContext,
  AppInitialProps,
  AppProps
> = ({Component, pageProps}: any) => {
  const store = useStore(pageProps.initialReduxState);

  /*useEffect(() => {
    window.onbeforeunload = function (event) {
      removeBrowserCookie(POPUP_EDUC_LANDING);
    };
  }, []);*/

  return (
    <React.Fragment>
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
                        <PromotionBannerProvider>
                          <DomainProvider>
                            <InstituteDetailsProvider>
                              <SnackbarProvider
                                maxSnack={20}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}>
                                <Component {...pageProps} />
                              </SnackbarProvider>
                            </InstituteDetailsProvider>
                          </DomainProvider>
                        </PromotionBannerProvider>
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
