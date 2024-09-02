import React, {useState} from 'react';
import {useFetchLocalizedProductFair} from '../../../services/organaizationManagement/hooks';
import DivisionFairComponent from '../divisionFairApplicationComponent/DivisionFairComponent';

const DivisionFairPage = () => {
  const [productFairFilters, setProductFairFilters] = useState({
    year: 2023,
  });

  const {
    data: productFairData,
    isLoading: isLoadingProductFairData,
    mutate: mutateProductFairData,
  } = useFetchLocalizedProductFair(productFairFilters);
  return (
    <DivisionFairComponent
      productFairData={productFairData}
      isLoadingProductFairData={isLoadingProductFairData}
      mutateProductFairData={mutateProductFairData}
      setProductFairFilters={setProductFairFilters}
    />
  );
};

export default DivisionFairPage;
