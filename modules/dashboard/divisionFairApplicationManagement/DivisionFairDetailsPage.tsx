import React from 'react';
import {useRouter} from 'next/router';
import {useFetchLocalizedProductFairDetails} from '../../../services/organaizationManagement/hooks';
import DivisionFairComponent from '../divisionFairApplicationComponent/DivisionFairComponent';
import {Button} from '@mui/material';
import {useIntl} from 'react-intl';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {LINK_BACKEND_SME_DIVISION_FAIR_APPLICATION_MANAGEMENT} from '../../../@core/common/appLinks';

const DivisionFairDetailsPage = () => {
  const router = useRouter();
  const {id} = router.query;
  const {messages} = useIntl();

  const {data: productFairData, isLoading: isLoadingProductFairData} =
    useFetchLocalizedProductFairDetails(id);

  return (
    <>
      <Button
        variant={'contained'}
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          router.push(LINK_BACKEND_SME_DIVISION_FAIR_APPLICATION_MANAGEMENT)
        }>
        {messages['common.back']}
      </Button>
      <DivisionFairComponent
        productFairData={productFairData}
        isLoadingProductFairData={isLoadingProductFairData}
        detailsPage={true}
      />
    </>
  );
};

export default DivisionFairDetailsPage;
