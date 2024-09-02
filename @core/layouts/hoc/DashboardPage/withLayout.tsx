import React from 'react';
import StandardLayout from '../../backend/Standard';

const withLayout = (ComposedComponent: any) => (props: any) => {
  return (
    <StandardLayout>
      <ComposedComponent {...props} />
    </StandardLayout>
  );
};

export default withLayout;
