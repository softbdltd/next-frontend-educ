import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo, useState} from 'react';
import { getAllKeysFromErrorObj, getMomentDateFormat } from "../../../../@core/utilities/helpers";
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import yup from '../../../../@core/libs/yup';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import {Box, Grid, Zoom} from '@mui/material';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import {useFetchGuardian} from '../../../../services/learnerManagement/hooks';
import {Guardian} from '../../../../services/learnerManagement/typing';
import {
  createGuardian,
  updateGuardian,
} from '../../../../services/learnerManagement/GuardianService';
import CustomHookForm from '../component/CustomHookForm';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomDatePicker from '../../../../@core/elements/input/CustomDatePicker';
import {
  MOBILE_NUMBER_REGEX,
  NID_REGEX,
} from '../../../../@core/common/patternRegex';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import moment from 'moment';
import {GUARDIAN_DATE_OF_BIRTH_MIN_AGE} from '../../../../@core/common/constants';

interface GuardianAddEditPageProps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues = {
  name: '',
  name_en: '',
  nid: '',
  mobile: '',
  date_of_birth: '',
  relationship_type: '',
  relationship_title: '',
  relationship_title_en: '',
};

const GuardianAddEditPage: FC<GuardianAddEditPageProps> = ({
  itemId,
  onClose: onGuardianAddEditFormClose,
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const [showOther, setShowOther] = useState(1);

  const relationshipTypes = useMemo(() => {
    let relationShips = [];
    for (let i = 1; i <= 7; i++) {
      relationShips.push({
        id: i,
        title: messages['common.guardian_types'][i - 1],
      });
    }
    return relationShips;
  }, [messages]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup
        .string()
        .title()
        .label(messages['guardian.name'] as string),
      name_en: yup
        .string()
        .title('en', false)
        .label(messages['guardian.name'] as string),
      relationship_type: yup
        .string()
        .required()
        .label(messages['guardian.relationship_type'] as string),
      relationship_title:
        showOther == 7
          ? yup
              .string()
              .title()
              .label(messages['guardian.relationship_title'] as string)
          : yup.string().nullable(),
      relationship_title_en:
        showOther == 7
          ? yup
              .string()
              .title('en', false)
              .label(messages['guardian.relationship_title'] as string)
          : yup.string().nullable(),
      mobile: yup
        .string()
        .matches(MOBILE_NUMBER_REGEX)
        .label(messages['common.mobile_en'] as string),
      nid: yup
        .mixed()
        .label(messages['common.nid'] as string)
        .test(
          'nid_validation',
          messages['common.nid_validation'] as string,
          (value) => !value || Boolean(value.match(NID_REGEX)),
        ),
      date_of_birth: yup
        .string()
        .nullable(true)
        .trim()
        .label(messages['common.date_of_birth'] as string)
        .test(
          'DOB',
          messages['common.invalid_date_of_birth_20'] as string,
          (value) =>
            !value ||
            Boolean(
              moment().diff(moment(value), 'years') >=
                GUARDIAN_DATE_OF_BIRTH_MIN_AGE,
            ),
        ),
    });
  }, [messages, showOther]);

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const {
    data: itemData,
    isLoading,
    mutate: mutateGuardian,
  } = useFetchGuardian(itemId);

  useEffect(() => {
    if (itemData) {
      reset({
        name: itemData?.name,
        name_en: itemData?.name_en,
        nid: itemData?.nid,
        mobile: itemData?.mobile,
        date_of_birth: itemData?.date_of_birth
          ? getMomentDateFormat(itemData.date_of_birth, 'YYYY-MM-DD')
          : '',
        relationship_type:
          itemData?.relationship_type === 7
            ? (setShowOther(7), itemData?.relationship_type)
            : (setShowOther(itemData?.relationship_type),
              itemData?.relationship_type),
        relationship_title: itemData?.relationship_title,
        relationship_title_en: itemData?.relationship_title_en,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const onSubmit: SubmitHandler<Guardian> = async (data: Guardian) => {
    try {
      if (itemId) {
        await updateGuardian(itemId, data);
        updateSuccessMessage('guardian.info');
      } else {
        await createGuardian(data);
        createSuccessMessage('guardian.info');
      }
      mutateGuardian();
      onGuardianAddEditFormClose();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['guardian.title']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton
                onClick={onGuardianAddEditFormClose}
                isLoading={isLoading}
              />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
            </React.Fragment>
          }
          onClose={onGuardianAddEditFormClose}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='name'
                label={messages['guardian.name']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='name_en'
                label={messages['guardian.name_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='nid'
                label={messages['guardian.nid']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='mobile'
                label={messages['guardian.mobile']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
                placeholder='017xxxxxxxx'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomDatePicker
                id='date_of_birth'
                label={messages['guardian.date_of_birth']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFilterableFormSelect
                required
                id='relationship_type'
                label={messages['guardian.relationship_type']}
                isLoading={isLoading}
                control={control}
                options={relationshipTypes}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={(value: number) => setShowOther(value)}
              />
            </Grid>
            {showOther === 7 && (
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='relationship_title'
                    label={messages['guardian.relationship_title_bn']}
                    control={control}
                    errorInstance={errors}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    id='relationship_title_en'
                    label={messages['guardian.relationship_title_en']}
                    control={control}
                    errorInstance={errors}
                    isLoading={isLoading}
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          {isSubmitting && (
            <div role={'alert'} aria-live="assertive" style={{ position: 'absolute', top: '-9999px' }}>
              {messages['common.submitting'] as string}
            </div>
          )}
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default GuardianAddEditPage;
