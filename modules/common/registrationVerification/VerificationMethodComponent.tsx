import React, {FC, useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import yup from '../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Grid, Typography} from '@mui/material';
import CustomTextInput from '../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../@core/elements/button/SubmitButton/SubmitButton';
import CustomFormSelect from '../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {MOBILE_NUMBER_REGEX} from '../../@core/common/patternRegex';
import {StyledPaper, classes} from './index.style';
import { H3 } from '../../@core/elements/common';

const VERIFICATION_METHOD = {
  MOBILE: '1',
  EMAIL: '2',
};
const verificationMethod = [
  {
    id: VERIFICATION_METHOD.MOBILE,
    label: 'Mobile',
  },
  {
    id: VERIFICATION_METHOD.EMAIL,
    label: 'Email',
  },
];

interface VerificationMethodComponentProps {
  onSendSuccess: (data: any) => void;
}

const VerificationMethodComponent: FC<VerificationMethodComponentProps> = ({
  onSendSuccess,
}) => {
  const {messages} = useIntl();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      verify_method: yup
        .string()
        .required()
        .label(messages['common.verify_method'] as string),
      mobile:
        selectedMethod && selectedMethod == VERIFICATION_METHOD.MOBILE
          ? yup
              .string()
              .trim()
              .required()
              .matches(MOBILE_NUMBER_REGEX)
              .label(messages['common.mobile_en'] as string)
          : yup.string().nullable(),
      email:
        selectedMethod && selectedMethod == VERIFICATION_METHOD.EMAIL
          ? yup
              .string()
              .trim()
              .required()
              .email()
              .label(messages['common.email'] as string)
          : yup.string().nullable(),
    });
  }, [messages, selectedMethod]);

  const {
    handleSubmit,
    // register,
    control,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  const onVerifyMethodChange = useCallback((methodId: string | null) => {
    setSelectedMethod(methodId);
  }, []);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    onSendSuccess(data);
  };

  return (
    <StyledPaper>
      <H3 tabIndex={0} className={classes.visuallyHidden}>
        {messages['common.verify_method']}
      </H3>
      <Typography
        tabIndex={0}
        variant={'h5'}
        style={{marginBottom: '10px', fontWeight: 'bold'}}>
        {messages['common.verify_text']}
      </Typography>
      <Typography style={{marginBottom: '10px'}}>
        {messages['common.verify_account']}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <CustomFormSelect
              id='verify_method'
              isLoading={false}
              label={messages['common.verify_method']}
              control={control}
              options={verificationMethod}
              optionValueProp={'id'}
              optionTitleProp={['label']}
              errorInstance={errors}
              onChange={onVerifyMethodChange}
            />
          </Grid>

          {selectedMethod && selectedMethod == VERIFICATION_METHOD.MOBILE && (
            <Grid item xs={12}>
              <CustomTextInput
                id='mobile'
                label={messages['common.mobile']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
          )}

          {selectedMethod && selectedMethod == VERIFICATION_METHOD.EMAIL && (
            <Grid item xs={12}>
              <CustomTextInput
                id='email'
                label={messages['common.email']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <SubmitButton
              isSubmitting={isSubmitting}
              isLoading={false}
              label={messages['common.send'] as string}
            />
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
};

export default VerificationMethodComponent;
