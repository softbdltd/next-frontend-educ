import DefaultPage from '../../@core/layouts/hoc/DefaultPage';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {onSSOSignInCallback} from '../../redux/actions';
import {useRouter} from 'next/router';
import * as queryString from 'querystring';
import {onCDAPSignInCallbackV2} from '../../redux/actions/CDAPAuthentication';
import {getCDAPSSOUrl} from '../../@core/common/CDAPConfig';
import {getBrowserCookie} from '../../@core/libs/cookieInstance';
import {COOKIE_KEY_CDAP_ACCESS_TOKEN} from '../../shared/constants/AppConst';

export default DefaultPage(() => {
  const router = useRouter();
  const query = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    const authResult: any = queryString.parse(
      window.location.hash.replace('#', ''),
    );

    console.log('cdap_access_token: ', authResult);

    if (authResult?.id_token) {
      const cdapAccessToken = getBrowserCookie(COOKIE_KEY_CDAP_ACCESS_TOKEN);
      if (cdapAccessToken) {
        dispatch(
          onCDAPSignInCallbackV2(
            authResult,
            router,
            authResult?.redirected_from as string,
          ),
        );
      } else {
        router.push(getCDAPSSOUrl());
      }
    } else if (query && query.code) {
      dispatch(
        onSSOSignInCallback(
          query?.code as string,
          query.redirected_from as string,
          query?.session_state as string,
          router,
        ),
      );
    } else {
    }
  }, [dispatch, query.code]);

  return <></>;
});
