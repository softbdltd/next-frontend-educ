import React from 'react';
import AuthLayout from '../DefaultPage/AuthLayout';

const withLayout = (ComposedComponent: any) => (props: any) => {
  return (
    <AuthLayout>
      <ComposedComponent {...props} />
    </AuthLayout>
  );
};
export default withLayout;
