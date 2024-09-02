import React from 'react';
import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';

interface BankInfoDetailsViewProps {
  itemData: any;
  isLoading?: boolean;
}

const AddressDetailsView = ({
  itemData,
  isLoading = false,
}: BankInfoDetailsViewProps) => {
  const {messages} = useIntl();

  return (
    <>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.bank_name']}
          value={itemData?.bank_name}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.branch_name']}
          value={itemData?.branch_name}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.branch_name']}
          value={itemData?.branch_name}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.routing_number']}
          value={itemData?.routing_number}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.account_name']}
          value={itemData?.account_name}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.account_number']}
          value={itemData?.account_number}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.contact_person_name']}
          value={itemData?.contact_person_name}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <DetailsInputView
          label={messages['common.mobile_number']}
          value={itemData?.mobile_number}
          isLoading={isLoading}
        />
      </Grid>
    </>
  );
};
export default AddressDetailsView;
