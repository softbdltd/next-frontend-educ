import React, {useEffect, useState} from 'react';
import {InstituteDetailsProps} from './InstituteDetailsProps';
import InstituteDetailsContext from './InstituteDetailsContext';
import {useFetchPublicInstituteDetails} from '../../../../../services/instituteManagement/hooks';

const InstituteDetailsProvider: React.FC<React.ReactNode> = ({children}) => {
  const [institute, setInstitute] = useState<InstituteDetailsProps>({});

  const {data: instituteDetails, isLoading} = useFetchPublicInstituteDetails();

  useEffect(() => {
    if (!isLoading && instituteDetails) {
      setInstitute(instituteDetails);
    }
  }, [isLoading, instituteDetails]);

  return (
    <InstituteDetailsContext.Provider
      value={{
        ...institute,
      }}>
      {children}
    </InstituteDetailsContext.Provider>
  );
};

export default InstituteDetailsProvider;
