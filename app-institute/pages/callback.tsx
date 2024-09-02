import DefaultPage from '../../@core/layouts/hoc/DefaultPage';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {onSSOSignInCallback} from '../../redux/actions';
import {useRouter} from 'next/router';

export default DefaultPage(() => {
  const router = useRouter();
  const query = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    // const authResult: any = queryString.parse(
    //   window.location.hash.replace('#', ''),
    // );
    // console.log('authResult', authResult);
    console.log('callback- query', query);
    if (query && query.code) {
      dispatch(
        onSSOSignInCallback(
          query.code as string,
          query.redirected_from as string,
          query.session_state as string,
          router,
        ),
      );
    }
  }, [dispatch, query]);

  return <></>;
});
