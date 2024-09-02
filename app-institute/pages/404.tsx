import React from 'react';
import DefaultPage from '../../@core/layouts/hoc/DefaultPage';
import asyncComponent from '../../@core/utility/asyncComponent';

const Error404 = asyncComponent(
  () => import('../../modules/errorPages/Error404'),
);
export default DefaultPage(() => <Error404 />);
