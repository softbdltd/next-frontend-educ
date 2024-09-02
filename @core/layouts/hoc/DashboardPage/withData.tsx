import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import Loader from '../../../../@core/core/Loader';
import {AppState} from '../../../../redux/store';
import {getSSOLoginUrl} from '../../../common/SSOConfig';
import {adminDomain, learnerDomain} from '../../../common/constants';
import {LINK_FRONTEND_LEARNER_FEED} from '../../../common/appLinks';
import {useRouter} from 'next/router';
import {checkHasRoutePermission} from '../../../../@core/utility/authorizations';

const withData = (ComposedComponent: any) => (props: any) => {
  const {user, loading} = useSelector<AppState, AppState['auth']>(
    ({auth}) => auth,
  );
  const {pathname} = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      window.location.href = getSSOLoginUrl();
    }
    if (user && user.isYouthUser) {
      window.location.href = learnerDomain() + LINK_FRONTEND_LEARNER_FEED;
    }

    /** Checking if has route permission*/
    if (user && !user.isYouthUser) {
      let hasPermission = checkHasRoutePermission(user, pathname);
      if (!hasPermission) {
        window.location.href = adminDomain();
      }
    }
  }, [user, loading]);
  if (!user || loading) return <Loader />;

  return <ComposedComponent {...props} />;
};

export default withData;
