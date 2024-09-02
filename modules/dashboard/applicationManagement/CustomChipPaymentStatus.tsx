import React from 'react';
import {CheckCircleOutline} from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import FormLabel from '@mui/material/FormLabel';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChip from '../../../@core/elements/display/CustomChip/CustomChip';
import {Fonts} from '../../../shared/constants/AppEnums';

type Props = {
  value: number;
  isLoading?: boolean;
  label?: string | MessageFormatElement[];
};

const CustomChipPaymentStatusStatus = ({value, isLoading, label}: Props) => {
  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <>
      {label && (
        <FormLabel
          style={{
            fontWeight: Fonts.BOLD,
            fontSize: 14,
            marginBottom: '12px',
            display: 'block',
          }}>
          {label}
        </FormLabel>
      )}
      <CustomChip
        icon={value == 1 ? <CheckCircleOutline /> : <CancelIcon />}
        color={value == 1 ? 'primary' : 'secondary'}
        label={
          value == 1 ? (
            <IntlMessages id='common.paid' />
          ) : value == 2 ? (
            <IntlMessages id='common.partially_paid' />
          ) : (
            <IntlMessages id='common.unpaid' />
          )
        }
      />
    </>
  );
};

export default React.memo(CustomChipPaymentStatusStatus);
