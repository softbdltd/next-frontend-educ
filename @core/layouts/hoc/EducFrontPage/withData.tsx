import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../../../../redux/store';
import {Loader} from '../../../../@core';
import {SUBSCRIPTION_DATA_KEY} from '../../../../shared/constants/AppConst';
import {learnerSubscribe} from '../../../../services/learnerManagement/YouthService';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';

const withData = (ComposedComponent: any) => (props: any) => {
  const {loading, user} = useSelector<AppState, AppState['auth']>(
    ({auth}) => auth,
  );
  const dispatch = useDispatch();

  const handleSubscriptionData = async (subscriptionData: any) => {
    const localStorageSubscriptionTypes = subscriptionData?.type ?? [];
    const authSubscriptionTypes = user?.learner_subscriptions ?? [];
    try {
      let apiResponse;
      if (
        // Check whether the localStorageSubscriptionTypes contain only one subscription type, and if that subscription type is not included in authSubscriptionTypes.
        localStorageSubscriptionTypes?.length === 1 &&
        !authSubscriptionTypes?.find(
          (i: any) => i?.type === localStorageSubscriptionTypes?.[0],
        )
      ) {
        apiResponse = await learnerSubscribe({
          email: subscriptionData?.email,
          type: localStorageSubscriptionTypes,
        });
      } else if (
        // check if localStorageSubscriptionTypes contains all types
        localStorageSubscriptionTypes?.length > authSubscriptionTypes?.length
      ) {
        const filteredSubscriptionTypes = localStorageSubscriptionTypes?.filter(
          (item: any) =>
            !authSubscriptionTypes?.find((i: any) => i?.type === item),
        );
        apiResponse = await learnerSubscribe({
          email: subscriptionData?.email,
          type: filteredSubscriptionTypes,
        });
      }

      if (apiResponse?.data) {
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: {
            ...user,
            learner_subscriptions: [
              ...authSubscriptionTypes,
              ...apiResponse?.data,
            ],
          },
        });
      }

      localStorage.removeItem(SUBSCRIPTION_DATA_KEY);
    } catch (error: any) {
      console.log('subscription api error', error);
    }
  };

  useEffect(() => {
    if (user?.isYouthUser) {
      const retrievedSubscriptionData = localStorage.getItem(
        SUBSCRIPTION_DATA_KEY,
      );
      const subscriptionData: any = retrievedSubscriptionData
        ? JSON.parse(retrievedSubscriptionData)
        : null;
      if (subscriptionData) {
        handleSubscriptionData(subscriptionData);
      }
    }
  }, [user]);

  if (loading) return <Loader />;

  return <ComposedComponent {...props} />;
};
export default withData;
