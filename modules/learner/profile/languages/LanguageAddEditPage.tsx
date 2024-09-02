import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo} from 'react';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import yup from '../../../../@core/libs/yup';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {Box, Grid, Zoom} from '@mui/material';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import {
  LanguageProficiencySpeakingType,
  LanguageProficiencyType,
} from '../utilities/LanguageProficiencyType';
import {
  useFetchLanguageProficiency,
  useFetchLanguages,
} from '../../../../services/learnerManagement/hooks';
import {YouthLanguageProficiency} from '../../../../services/learnerManagement/typing';
import {
  createLanguageProficiency,
  updateLanguageProficiency,
} from '../../../../services/learnerManagement/LanguageProficiencyService';
import CustomHookForm from '../component/CustomHookForm';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import { getAllKeysFromErrorObj } from "../../../../@core/utilities/helpers";

interface LanguageAddEditPageProps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues = {
  language_id: '',
  reading_proficiency_level: LanguageProficiencyType.EASILY,
  writing_proficiency_level: LanguageProficiencyType.EASILY,
  speaking_proficiency_level: LanguageProficiencySpeakingType.FLUENTLY,
  understand_proficiency_level: LanguageProficiencyType.EASILY,
};

const LanguageAddEditPage: FC<LanguageAddEditPageProps> = ({
  itemId,
  onClose: onLanguageAddEditFormClose,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const {
    data: itemData,
    isLoading,
    mutate: mutateLanguageProficiency,
  } = useFetchLanguageProficiency(itemId);
  const {data: languages, isLoading: isLoadingLanguages} = useFetchLanguages();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      language_id: yup
        .string()
        .required()
        .label(messages['language.label'] as string),
      reading_proficiency_level: yup
        .string()
        .required()
        .label(messages['language.read'] as string),
      writing_proficiency_level: yup
        .string()
        .required()
        .label(messages['language.write'] as string),
      speaking_proficiency_level: yup
        .string()
        .required()
        .label(messages['language.speak'] as string),
      understand_proficiency_level: yup
        .string()
        .required()
        .label(messages['language.understand'] as string),
    });
  }, [messages]);

  const languageProficiencyTypes = useMemo(
    () => [
      {
        key: LanguageProficiencyType.EASILY,
        label: messages['common.easily'],
      },
      {
        key: LanguageProficiencyType.NOT_EASILY,
        label: messages['common.not_easily'],
      },
    ],
    [messages],
  );
  const languageProficiencySpeakingTypes = useMemo(
    () => [
      {
        key: LanguageProficiencySpeakingType.FLUENTLY,
        label: messages['common.fluent'],
      },
      {
        key: LanguageProficiencySpeakingType.NOT_FLUENTLY,
        label: messages['common.not_fluent'],
      },
    ],
    [messages],
  );

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

  useEffect(() => {
    if (itemData) {
      reset({
        language_id: itemData?.language_id,
        reading_proficiency_level: itemData?.reading_proficiency_level,
        writing_proficiency_level: itemData?.writing_proficiency_level,
        speaking_proficiency_level: itemData?.speaking_proficiency_level,
        understand_proficiency_level: itemData?.understand_proficiency_level,
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

  const onSubmit: SubmitHandler<YouthLanguageProficiency> = async (
    data: YouthLanguageProficiency,
  ) => {
    try {
      if (itemId) {
        await updateLanguageProficiency(itemId, data);
        updateSuccessMessage('language_proficiency.title');
      } else {
        await createLanguageProficiency(data);
        createSuccessMessage('language_proficiency.title');
      }
      mutateLanguageProficiency();
      onLanguageAddEditFormClose();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['language_proficiency.title']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton
                onClick={onLanguageAddEditFormClose}
                isLoading={isLoading}
              />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
            </React.Fragment>
          }
          onClose={onLanguageAddEditFormClose}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomFilterableFormSelect
                required
                id='language_id'
                isLoading={isLoadingLanguages}
                control={control}
                options={languages}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                label={messages['common.language']}
              />
            </Grid>
            <Grid item xs={12}>
              <FormRadioButtons
                id='reading_proficiency_level'
                label={'language.read'}
                radios={languageProficiencyTypes}
                control={control}
                defaultValue={LanguageProficiencyType.EASILY}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormRadioButtons
                id='writing_proficiency_level'
                label={'language.write'}
                radios={languageProficiencyTypes}
                control={control}
                defaultValue={LanguageProficiencyType.EASILY}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <FormRadioButtons
                id='speaking_proficiency_level'
                label={'language.speak'}
                radios={languageProficiencySpeakingTypes}
                control={control}
                defaultValue={LanguageProficiencySpeakingType.FLUENTLY}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <FormRadioButtons
                id='understand_proficiency_level'
                label={'language.understand'}
                radios={languageProficiencyTypes}
                control={control}
                defaultValue={LanguageProficiencyType.EASILY}
                isLoading={isLoading}
              />
            </Grid>
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

export default LanguageAddEditPage;
