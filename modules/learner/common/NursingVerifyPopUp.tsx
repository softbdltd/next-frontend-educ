import {Grid, TextField} from '@mui/material';
import React, {useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IconBranch from '../../../@core/icons/IconBranch';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import RowStatus from '../../../@core/utilities/RowStatus';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {updateYouthNursingStatus} from '../../../services/learnerManagement/YouthService';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';

type Props = {
  setVerificationStatus: any;
  setIsSentVerificationAPI: any;
  onClose: () => void;
};

const NursingVerifyPopUp = ({...props}: Props) => {
  const authUser = useAuthUser<YouthAuthUser>();
  const {messages} = useIntl();
  const isEdit = false;
  const valueRef = useRef<any>('');
  const {successStack, errorStack, warningStack} = useNotiStack();

  const onVerificationSubmit = async () => {
    if (!valueRef.current.value) {
      warningStack(<IntlMessages id='common.nurse_id_message' />);
      return 2;
    } else {
      try {
        const data = {
          nurse_number: valueRef.current.value,
          first_name: authUser?.first_name,
          last_name: authUser?.last_name,
          first_name_en: authUser?.first_name_en,
          last_name_en: authUser?.last_name_en,
          mobile: authUser?.mobile,
          email: authUser?.email,
          nurse_type: regTypes,
        };
        // console.log('nurse verification', data, regTypes);
        const response = await updateYouthNursingStatus(data);

        if (isResponseSuccess(response)) {
          {
            successStack(<IntlMessages id='common.request_sent_msg' />);
          }
        }
        props.setVerificationStatus(RowStatus.PENDING);
        props.setIsSentVerificationAPI(true);
        props.onClose();
      } catch (error: any) {
        processServerSideErrors({error, errorStack});
      }
    }
  };

  const [regTypes, setRegTypes] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setRegTypes(event.target.value as string);
  };

  const registrationTypes = [
    {
      id: 1,
      title: messages['common.bsc'],
    },
    {
      id: 2,
      title: messages['common.diploma'],
    },
  ];

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconBranch />
            <IntlMessages id='common.verify' />
          </>
        }
        maxWidth={'sm'}
        actions={
          <>
            <CancelButton onClick={props.onClose} />
            <SubmitButton
              onClick={onVerificationSubmit}
              label={messages['common.submit']}
            />
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            {isEdit ? (
              <DetailsInputView
                label={messages['common.nurse_id']}
                value={'abcd134'}
              />
            ) : (
              <>
                <TextField
                  margin='dense'
                  id='nurse_number'
                  inputProps={{ type: 'number'}}
                  label={messages['common.nurse_id']}
                  type='text'
                  fullWidth
                  variant='outlined'
                  inputRef={valueRef}
                  sx={{marginBottom: '15px'}}
                />
                <FormControl fullWidth>
                  <InputLabel id='registration-types-label'>
                    {messages['common.registration_type']}
                  </InputLabel>
                  <Select
                    labelId='registration-types-label'
                    id='demo-simple-select'
                    value={regTypes}
                    label='Registration Types'
                    onChange={handleChange}>
                    {registrationTypes.map((itm) => (
                      <MenuItem key={itm.id} value={itm.id}>
                        {itm.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default NursingVerifyPopUp;
