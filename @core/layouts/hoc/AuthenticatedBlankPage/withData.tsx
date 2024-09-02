import React, {useEffect} from 'react';
import Router, {useRouter} from 'next/router';
import Loader from '../../../../@core/core/Loader';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../redux/store';
import {getHostUrl} from '../../../common/SSOConfig';

const withData = (ComposedComponent: any) => (props: any) => {
  const {user: authUser, loading} = useSelector<AppState, AppState['auth']>(
    ({auth}) => auth,
  );

  const {asPath} = useRouter();
  const queryParams = asPath.split('?')[1];

  useEffect(() => {
    if (!loading && !authUser) {
      Router.push(getHostUrl() + (queryParams ? '?' + queryParams : ''));
    }
  }, [loading, authUser]);

  if (loading) return <Loader />;
  if (!authUser) return <Loader />;

  return <ComposedComponent {...props} />;
};
export default withData;
