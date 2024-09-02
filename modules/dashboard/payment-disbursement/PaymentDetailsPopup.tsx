import React from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useFetchSinglePaymentInfoForInstitute} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import IconPayment from '../../../@core/icons/IconPayment';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {
  getMomentDateFormat,
  localizedNumbers,
} from '../../../@core/utilities/helpers';

type Props = {
  itemId: number;
  onClose: () => void;
};

const PaymentDetailsPopup = ({itemId, ...props}: Props) => {
  const {messages, locale} = useIntl();
  const {data: itemData, isLoading} =
    useFetchSinglePaymentInfoForInstitute(itemId);
  const authUser = useAuthUser<CommonAuthUser>();
  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconPayment />
            <IntlMessages id='common.payment_disbursement' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
          </>
        }>
        <Grid container spacing={5}>
          {authUser?.isSystemUser && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.title']}
                  value={itemData?.accessor_title}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.title_en']}
                  value={itemData?.accessor_title_en}
                  isLoading={isLoading}
                />
              </Grid>
            </>
          )}
          {!authUser?.training_center_id && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.training_center_bn']}
                  value={itemData?.training_center_title}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.training_center_en']}
                  value={itemData?.training_center_title_en}
                  isLoading={isLoading}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.total_enrollments']}
              value={localizedNumbers(
                itemData?.enrollment_ids?.length || 0,
                locale,
              )}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.amount']}
              value={
                itemData?.amount
                  ? localizedNumbers(itemData?.amount, locale)
                  : ''
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.payment_date']}
              value={getMomentDateFormat(
                itemData?.disbursement_created_at,
                'DD MMM YYYY',
              )}
              isLoading={isLoading}
            />
          </Grid>
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
              label={messages['common.account_name']}
              value={itemData?.account_name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.account_number']}
              value={
                itemData?.account_number
                  ? localizedNumbers(itemData?.account_number, locale)
                  : ''
              }
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.routing_number']}
              value={
                itemData?.routing_number
                  ? localizedNumbers(itemData?.routing_number, locale)
                  : ''
              }
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
              value={
                itemData?.mobile_number
                  ? localizedNumbers(itemData?.mobile_number, locale)
                  : ''
              }
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default PaymentDetailsPopup;
