import React, {useCallback, useEffect, useMemo, useState} from 'react';
import yup from '../../../../@core/libs/yup';
import {NID_REGEX} from '../../../../@core/common/patternRegex';
import moment from 'moment';
import {DATE_OF_BIRTH_MIN_AGE} from '../../../../@core/common/constants';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  getIdentityNumberFieldCaptionKey,
  getMomentDateFormat,
  isResponseSuccess,
} from '../../../../@core/utilities/helpers';
import {
  getYouthProfile,
  verifyYouthNidBrn,
} from '../../../../services/learnerManagement/YouthService';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {Button, Divider, FormHelperText, Grid, Typography} from '@mui/material';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import IdentityNumberTypes from '../../../../@core/utilities/IdentityNumberTypes';
import CustomDatePicker from '../../../../@core/elements/input/CustomDatePicker';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import WarningIcon from '@mui/icons-material/Warning';

interface NidAndBrnVerificationComponentProps {
  isSingleRow?: boolean;
}

const NidAndBrnVerificationComponent = ({
  isSingleRow = false,
}: NidAndBrnVerificationComponentProps) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();
  const [identityNumberType, setIdentityNumberType] = useState<
    string | undefined
  >();

  const validationSchemaNidBrn = useMemo(() => {
    return yup.object().shape({
      identity_number: yup
        .string()
        .trim()
        .required()
        .matches(NID_REGEX)
        .label(messages['common.identity_number'] as string),
      date_of_birth: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['common.date_of_birth'] as string)
        .test(
          'DOB',
          messages['common.invalid_date_of_birth'] as string,
          (value) =>
            moment().diff(moment(value), 'years') >= DATE_OF_BIRTH_MIN_AGE,
        ),
    });
  }, [messages, identityNumberType]);

  const {
    reset: resetNidBrn,
    setError: setErrorNidBrn,
    control: controlNidBrn,
    handleSubmit: handleSubmitNidBrn,
    formState: {errors: errorsNidBrn, isSubmitting: isSubmittingNidBrn},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchemaNidBrn),
  });

  useEffect(() => {
    if (authUser) {
      resetNidBrn({
        identity_number_type: authUser?.identity_number_type ?? '1',
        identity_number: authUser?.identity_number,
        date_of_birth: getMomentDateFormat(
          authUser?.date_of_birth,
          'YYYY-MM-DD',
        ),
      });
      setIdentityNumberType(authUser?.identity_number_type ?? '1');
    } else {
      resetNidBrn({
        identity_number: '',
        date_of_birth: '',
        identity_number_type: '1',
      });
      setIdentityNumberType('1');
    }
  }, [authUser]);

  const handleNidBrnVerification = async (data: any) => {
    let verifyData: any = {
      mobile: authUser?.mobile,
      date_of_birth: data?.date_of_birth,
    };
    verifyData[identityNumberType == '1' ? 'nid' : 'brn'] =
      data?.identity_number;

    try {
      await verifyYouthNidBrn(verifyData);
      updateSuccessMessage('common.identity_verification');
      updateProfile();
    } catch (error: any) {
      processServerSideErrors({
        error,
        setError: setErrorNidBrn,
        validationSchema: validationSchemaNidBrn,
        errorStack,
      });
    }
  };

  const updateProfile = () => {
    (async () => {
      const response = await getYouthProfile();
      if (isResponseSuccess(response) && response.data) {
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: getYouthAuthUserObject({...authUser, ...response.data}),
        });
      }
    })();
  };

  const onIdentityTypeChange = useCallback((value: string) => {
    setIdentityNumberType(value);
  }, []);

  return (
    <React.Fragment>
      <Grid item xs={12} mt={-2}>
        <Grid
          container
          columnSpacing={'2px'}
          alignItems={'center'}
          p={1}
          sx={{border: '1px solid #ff9800', borderRadius: '5px'}}>
          <Grid
            item
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <WarningIcon sx={{color: 'warning.main'}} />
          </Grid>
          <Grid item>
            <Typography color={'warning.main'} tabIndex={0} variant={'h6'}>
              {messages['common.identity_not_verified']}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {isSingleRow ? (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormRadioButtons
                id='identity_number_type'
                label={'common.identity_number_type'}
                radios={[
                  {
                    key: IdentityNumberTypes.NID,
                    label: messages['common.nid_only'],
                  },
                  {
                    key: IdentityNumberTypes.BIRTH_CERT,
                    label: messages['common.birth_certificate_only'],
                  },
                ]}
                control={controlNidBrn}
                defaultValue={identityNumberType}
                isLoading={false}
                onChange={onIdentityTypeChange}
              />
            </Grid>
            <Grid item xs={3} mt={1.3}>
              <CustomTextInput
                required
                id='identity_number'
                label={
                  messages[getIdentityNumberFieldCaptionKey(identityNumberType)]
                }
                isLoading={false}
                control={controlNidBrn}
                errorInstance={errorsNidBrn}
              />
            </Grid>
            <Grid item xs={12} md={3} mt={1.3}>
              <CustomDatePicker
                required
                id='date_of_birth'
                label={messages['common.date_of_birth']}
                isLoading={false}
                control={controlNidBrn}
                errorInstance={errorsNidBrn}
              />
              <FormHelperText sx={{color: 'primary.main', mt: -3}}>
                <IntlMessages
                  id={'common.as_per_identity'}
                  values={{
                    subject:
                      String(identityNumberType) === IdentityNumberTypes.NID
                        ? messages['common.nid_only']
                        : messages['common.birth_certificate_only'],
                  }}
                />
              </FormHelperText>
            </Grid>

            <Grid item xs={3} mt={1.3}>
              <Button
                fullWidth={true}
                variant={'contained'}
                disabled={isSubmittingNidBrn}
                onClick={handleSubmitNidBrn(handleNidBrnVerification)}>
                {messages['common.verify']}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} md={10}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormRadioButtons
                id='identity_number_type'
                label={'common.identity_number_type'}
                radios={[
                  {
                    key: IdentityNumberTypes.NID,
                    label: messages['common.nid_only'],
                  },
                  {
                    key: IdentityNumberTypes.BIRTH_CERT,
                    label: messages['common.birth_certificate_only'],
                  },
                ]}
                control={controlNidBrn}
                defaultValue={identityNumberType}
                isLoading={false}
                onChange={onIdentityTypeChange}
              />
            </Grid>
            <Grid item xs={12} md={6} mt={1.3}>
              <CustomDatePicker
                required
                id='date_of_birth'
                label={messages['common.date_of_birth']}
                isLoading={false}
                control={controlNidBrn}
                errorInstance={errorsNidBrn}
              />
              <FormHelperText sx={{color: 'primary.main', mt: -3}}>
                <IntlMessages
                  id={'common.as_per_identity'}
                  values={{
                    subject:
                      String(identityNumberType) === IdentityNumberTypes.NID
                        ? messages['common.nid_only']
                        : messages['common.birth_certificate_only'],
                  }}
                />
              </FormHelperText>
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                required
                id='identity_number'
                label={
                  messages[getIdentityNumberFieldCaptionKey(identityNumberType)]
                }
                isLoading={false}
                control={controlNidBrn}
                errorInstance={errorsNidBrn}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth={true}
                variant={'contained'}
                disabled={isSubmittingNidBrn}
                onClick={handleSubmitNidBrn(handleNidBrnVerification)}>
                {messages['common.verify']}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid item xs={12} mt={1}>
        <Divider />
      </Grid>
    </React.Fragment>
  );
};

export default NidAndBrnVerificationComponent;
