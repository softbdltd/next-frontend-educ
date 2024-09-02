import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {onJWTAuthSignout} from '../../redux/actions';
import {useAuthUser} from '../../@core/utility/AppHooks';
import {useRouter} from 'next/router';
import InstituteFrontPage from '../../@core/layouts/hoc/InstituteDefaultFrontPage';
import {Loader} from '../../@core';

export default InstituteFrontPage(() => {
    const router = useRouter();
    const authUser = useAuthUser();

    const dispatch = useDispatch();

    useEffect(() => {
        if (authUser) {
            dispatch(onJWTAuthSignout());
        } else {
            router.push(window.location.origin);
        }
    }, [dispatch, authUser]);

    return <Loader/>;
});
