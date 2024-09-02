import React, {useEffect, useState} from 'react';
import {useFetchDomainDetails} from '../../../services/domainManagement/hooks';

interface DomainDetailsContextProps {
  [x: string]: any;
}

export const DomainDetailsContext =
  React.createContext<DomainDetailsContextProps>({});

export default function DomainProvider({children}: any) {
  const [details, setDetails] = useState<any>({});
  const [domainFilterParams, setDomainFilterParams] = useState<any>(null);
  const {data: domainDetails} = useFetchDomainDetails(domainFilterParams);

  useEffect(() => {
    if (window?.location?.hostname) {
      setDomainFilterParams({
        domain: window.location.hostname,
      });
    }
  }, []);

  useEffect(() => {
    if (domainDetails) {
      setDetails(domainDetails);
    }
  }, [domainDetails]);

  return (
    <DomainDetailsContext.Provider value={{...details}}>
      {children}
    </DomainDetailsContext.Provider>
  );
}
