import React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../redux/store';
import {Loader} from '../../../../@core';

const withData = (ComposedComponent: any) => (props: any) => {
  const {loading} = useSelector<AppState, AppState['auth']>(({auth}) => auth);
  if (loading) return <Loader />;

  return <ComposedComponent {...props} />;
};
export default withData;
