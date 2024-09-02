import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAuthUser} from '../../@core/utility/AppHooks';
import {educDomain} from '../../@core/common/constants';
import {
  clearAuthCookies,
  clearAuthRefreshCookies,
} from '../../@core/libs/cookieHelpers';
import {onJWTAuthSignout} from '../../redux/actions';

export default () => {
  clearAuthCookies();
  clearAuthRefreshCookies();

  const router = useRouter();
  const authUser = useAuthUser();

  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      dispatch(onJWTAuthSignout());
    } else {
      router.push(educDomain());
    }
  }, [dispatch, authUser]);

  return <></>;
};
