import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../redux/store';
import {Loader} from '../../../../@core';
import {getSSOLoginUrl} from '../../../common/SSOConfig';
import {adminDomain} from '../../../common/constants';

const withData = (ComposedComponent: any) => (props: any) => {
  const {loading, user} = useSelector<AppState, AppState['auth']>(
    ({auth}) => auth,
  );

  useEffect(() => {
    if (!user && !loading) {
      // Router.push('/signin' + (queryParams ? '?' + queryParams : ''));
      window.location.href = getSSOLoginUrl();
    }

    if (user && !user.isYouthUser) {
      window.location.href = adminDomain();
    }
  }, [user, loading]);
  if (!user || loading) return <Loader />;

  if (loading) return <Loader />;

  return <ComposedComponent {...props} />;
};
export default withData;
