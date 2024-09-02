import React from 'react';
import {useAppToken} from "../../../@core/utility/AppHooks";
import Loader from "../../../@core/core/Loader";

function AppRootWrapper({children}: any) {
  const [loading] = useAppToken();

  if (loading) {
    return <Loader/>;
  }

  return <>{children}</>;
}


export default AppRootWrapper;
