import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';

interface Props {
  errors: any;
  control: any;
}

const BankInfoFormSection = ({errors, control}: Props) => {
  let fieldIds: any = {
    bank_name: 'bank_name',
    branch_name: 'branch_name',
    routing_number: 'routing_number',
    account_name: 'account_name',
    account_number: 'account_number',
    contact_person_name: 'contact_person_name',
    mobile_number: 'mobile_number',
  };

  const {messages} = useIntl();

  return (
    <Grid
      item
      xs={12}
      alignItems={'center'}
      sx={{
        paddingTop: '20px !important',
      }}>
      <fieldset style={{padding: '10px', border: '1.5px solid #b8b1b1'}}>
        <legend>{messages['common.bank_info']}</legend>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.bank_name}`}
              label={messages['common.bank_name']}
              control={control}
              errorInstance={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.branch_name}`}
              label={messages['common.branch_name']}
              control={control}
              errorInstance={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.routing_number}`}
              label={messages['common.routing_number']}
              control={control}
              errorInstance={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.account_name}`}
              label={messages['common.account_name']}
              control={control}
              errorInstance={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.account_number}`}
              label={messages['common.account_number']}
              control={control}
              errorInstance={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.contact_person_name}`}
              label={messages['common.contact_person_name']}
              control={control}
              errorInstance={errors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id={`${fieldIds.mobile_number}`}
              label={messages['common.mobile_number']}
              control={control}
              errorInstance={errors}
            />
          </Grid>
        </Grid>
      </fieldset>
    </Grid>
  );
};

export default BankInfoFormSection;
