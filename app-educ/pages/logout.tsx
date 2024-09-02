import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Loader} from '../../@core';
import {educDomain} from '../../@core/common/constants';
import EducFrontPage from '../../@core/layouts/hoc/EducFrontPage';
import {clearAllCookies} from '../../@core/libs/cookieHelpers';
import {
  getBrowserCookie,
  removeBrowserCookie,
} from '../../@core/libs/cookieInstance';
import {signOut} from '../../redux/actions';
import {
  COOKIE_KEY_CDAP_ACCESS_TOKEN,
  COOKIE_KEY_CDAP_ID_TOKEN,
  COOKIE_KEY_CDAP_SESSION_STATE,
  COOKIE_KEY_USER_DOMAIN,
  NOT_LOGOUT_ERROR_CODE,
} from '../../shared/constants/AppConst';

export default EducFrontPage(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {error, redirected_from} = router.query;

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      if (error && error == NOT_LOGOUT_ERROR_CODE) {
        router.push(redirected_from ? String(redirected_from) : educDomain());
      } else {
        clearAllCookies();

        removeBrowserCookie(COOKIE_KEY_CDAP_SESSION_STATE);
        removeBrowserCookie(COOKIE_KEY_CDAP_ACCESS_TOKEN);
        removeBrowserCookie(COOKIE_KEY_CDAP_ID_TOKEN);
        dispatch(signOut());

        const domain = getBrowserCookie(COOKIE_KEY_USER_DOMAIN);
        if (domain) {
          removeBrowserCookie(COOKIE_KEY_USER_DOMAIN);
          const protocol = window.location.protocol;
          window.location.href = protocol + '//' + domain;
        } else {
          removeBrowserCookie(COOKIE_KEY_USER_DOMAIN);
          router.push(educDomain());
        }
      }
    }
  }, [dispatch, router.query]);

  return <Loader />;
});
