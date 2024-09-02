import yup from '../../../@core/libs/yup';
import Grid from '@mui/material/Grid';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {Add, Book, Delete} from '@mui/icons-material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {
  useFetchLocalizedCMSGlobalConfig,
  useFetchPublication,
} from '../../../services/cmsManagement/hooks';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {Box, Button, IconButton} from '@mui/material';
import {IPublication} from '../../../shared/Interface/common.interface';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  createPublication,
  updatePublication,
} from '../../../services/cmsManagement/PublicationsService';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import {getMomentDateFormat} from '../../../@core/utilities/helpers';

interface Props {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title: '',
  title_en: '',
  author: '',
  author_en: '',
  description: '',
  description_en: '',
  industry_association_id: '',
  image_path: '',
  file_path: '',
  published_at: '',
  archived_at: '',
  row_status: '1',
};

const PublicationsAddEditPopup: FC<Props> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();

  const isEdit = itemId != null;

  const {
    data: itemData,
    isLoading,
    mutate: mutatePartners,
  } = useFetchPublication(itemId);

  const {data: cmsGlobalConfig, isLoading: isFetching} =
    useFetchLocalizedCMSGlobalConfig();

  const [allLanguages, setAllLanguages] = useState<any>([]);
  const [languageList, setLanguageList] = useState<any>([]);
  const [selectedLanguageList, setSelectedLanguageList] = useState<any>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<
    string | null
  >(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<string>>([]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .title('bn', true)
        .label(messages['common.title'] as string),

      author: yup
        .string()
        .required()
        .label(messages['publication.author'] as string),
      // author_en: yup
      //   .string()
      //   .title('en', false)
      //   .label(messages['publication.author'] as string),
      description: yup
        .string()
        .required()
        .label(messages['common.description'] as string),
      // description_en: yup
      //   .string()
      //   .title('en', false)
      //   .label(messages['common.description'] as string),
      image_path: yup
        .string()
        .required()
        .label(messages['common.logo'] as string),
      language_en: !selectedCodes.includes(LanguageCodes.ENGLISH)
        ? yup.object().shape({})
        : yup.object().shape({
            title: yup
              .string()
              .title(
                'bn',
                true,
                messages['common.special_character_error'] as string,
              )
              .label(messages['common.title'] as string),
            description: yup
              .string()
              .trim()
              .required()
              .label(messages['common.title'] as string),
          }),
    });
  }, [messages]);

  const {
    register,
    reset,
    control,
    setError,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<IPublication>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      let data: any = {
        title: itemData?.title,
        title_en: itemData?.title_en,
        author: itemData?.author,
        author_en: itemData?.author_en,
        description: itemData?.description,
        description_en: itemData?.description_en,
        industry_association_id: itemData?.industry_association_id,
        image_path: itemData?.image_path,
        file_path: itemData?.file_path,
        show_in: itemData?.show_in,
        published_at: itemData?.published_at
          ? getMomentDateFormat(itemData.published_at, 'YYYY-MM-DD')
          : '',
        archived_at: itemData?.archived_at
          ? getMomentDateFormat(itemData.archived_at, 'YYYY-MM-DD')
          : '',
        row_status: String(itemData?.row_status),
      };

      const otherLangData = itemData?.other_language_fields;

      if (otherLangData) {
        let keys: any = Object.keys(otherLangData);
        keys.map((key: string) => {
          data['language_' + key] = {
            code: key,
            title: otherLangData[key].title,
            author: otherLangData[key].author,
            description: otherLangData[key].description,
            image_alt_title: otherLangData[key].image_alt_title,
          };
        });
        setSelectedCodes(keys);

        setSelectedLanguageList(
          allLanguages.filter((item: any) => keys.includes(item.code)),
        );

        setLanguageList(
          allLanguages.filter((item: any) => !keys.includes(item.code)),
        );
      }

      reset(data);
    } else {
      reset(initialValues);
    }
  }, [itemData, allLanguages]);

  useEffect(() => {
    if (cmsGlobalConfig) {
      const filteredLanguage = cmsGlobalConfig.language_configs?.filter(
        (item: any) => item.code != LanguageCodes.BANGLA,
      );

      setAllLanguages(filteredLanguage);
      setLanguageList(filteredLanguage);
    }
  }, [cmsGlobalConfig]);

  const onAddOtherLanguageClick = useCallback(() => {
    if (selectedLanguageCode) {
      let lists = [...selectedLanguageList];
      const lang = allLanguages.find(
        (item: any) => item.code == selectedLanguageCode,
      );

      if (lang) {
        lists.push(lang);
        setSelectedLanguageList(lists);
        setSelectedCodes((prev) => [...prev, lang.code]);

        setLanguageList((prevState: any) =>
          prevState.filter((item: any) => item.code != selectedLanguageCode),
        );
        setSelectedLanguageCode(null);
      }
    }
  }, [selectedLanguageCode, selectedLanguageList]);

  const onLanguageListChange = useCallback((selected: any) => {
    setSelectedLanguageCode(selected);
  }, []);

  const onDeleteLanguage = useCallback(
    (language: any) => {
      if (language) {
        setSelectedLanguageList((prevState: any) =>
          prevState.filter((item: any) => item.code != language.code),
        );

        let languages = [...languageList];
        languages.push(language);
        setLanguageList(languages);

        setSelectedCodes((prev) =>
          prev.filter((code: any) => code != language.code),
        );
      }
    },
    [selectedLanguageList, languageList, selectedCodes],
  );
  console.log('errors->', errors);

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      let data = {...formData};

      //Todo: educ for now
      data.show_in = 1;

      let otherLanguagesFields: any = {};
      delete data.language_list;

      selectedLanguageList.map((language: any) => {
        const langObj = formData['language_' + language.code];

        otherLanguagesFields[language.code] = {
          title: langObj.title,
          author: langObj.author,
          description: langObj.description,
          image_alt_title: langObj.image_alt_title,
        };
      });
      delete data['language_en'];

      if (selectedLanguageList.length > 0)
        data.other_language_fields = otherLanguagesFields;

      if (itemId) {
        await updatePublication(itemId, data);
        updateSuccessMessage('menu.publication');
        mutatePartners();
      } else {
        await createPublication(data);
        createSuccessMessage('menu.publication');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <Book />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='menu.publication' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='menu.publication' />}}
            />
          )}
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='title'
            label={messages['common.title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        {/*<Grid item xs={6}>*/}
        {/*  <CustomTextInput*/}
        {/*    id='title_en'*/}
        {/*    label={messages['common.title_en']}*/}
        {/*    control={control}*/}
        {/*    errorInstance={errors}*/}
        {/*    isLoading={isLoading}*/}
        {/*  />*/}
        {/*</Grid>*/}
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='author'
            label={messages['publication.author']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        {/*<Grid item xs={6}>*/}
        {/*  <CustomTextInput*/}
        {/*    id='author_en'*/}
        {/*    label={messages['publication.author_en']}*/}
        {/*    control={control}*/}
        {/*    errorInstance={errors}*/}
        {/*    isLoading={isLoading}*/}
        {/*  />*/}
        {/*</Grid>*/}
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='description'
            label={messages['common.description']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
            multiline={true}
            rows={3}
          />
        </Grid>
        {/*<Grid item xs={6}>*/}
        {/*  <CustomTextInput*/}
        {/*    id='description_en'*/}
        {/*    label={messages['common.description_en']}*/}
        {/*    control={control}*/}
        {/*    errorInstance={errors}*/}
        {/*    isLoading={isLoading}*/}
        {/*    multiline={true}*/}
        {/*    rows={3}*/}
        {/*  />*/}
        {/*</Grid>*/}
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='image_path'
            defaultFileUrl={itemData?.image_path}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.logo']}
            required={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='file_path'
            defaultFileUrl={itemData?.file_path}
            setValue={setValue}
            register={register}
            label={messages['common.pdf']}
            errorInstance={errors}
            allowMultiple={false}
            acceptedFileTypes={['application/pdf']}
            sizeLimitText='500MB'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            id='published_at'
            label={messages['common.publish_at']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
          <Box sx={{fontStyle: 'italic', fontWeight: 'bold', marginTop: '6px'}}>
            {messages['common.give_publish_date']}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            id='archived_at'
            label={messages['common.archived_at']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomFilterableFormSelect
            id={'language_list'}
            label={messages['common.language']}
            isLoading={isFetching}
            control={control}
            options={languageList}
            optionValueProp={'code'}
            optionTitleProp={['native_name']}
            errorInstance={errors}
            onChange={onLanguageListChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Button
            variant={'outlined'}
            color={'primary'}
            onClick={onAddOtherLanguageClick}
            disabled={!selectedLanguageCode}>
            <Add />
            {messages['educ_publication.add_language']}
          </Button>
        </Grid>

        <Grid item xs={12}>
          {selectedLanguageList.map((language: any, index: number) => (
            <Box key={language.code} sx={{marginTop: '10px'}}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {language.native_name}
                </legend>
                <Grid container spacing={{xs: 2, md: 5}}>
                  <Grid item xs={10} sm={6} md={6}>
                    <CustomTextInput
                      required
                      id={'language_' + language.code + '[title]'}
                      label={messages['common.title']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    md={5}
                    order={{xs: 3, sm: 2, md: 2}}>
                    <CustomTextInput
                      required
                      id={'language_' + language.code + '[author]'}
                      label={messages['publication.author']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={2} sm={1} md={1} order={{xs: 2, sm: 3, md: 3}}>
                    <IconButton
                      aria-label='delete'
                      color={'error'}
                      onClick={() => {
                        onDeleteLanguage(language);
                      }}>
                      <Delete color={'error'} />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} order={4}>
                    <CustomTextInput
                      required
                      id={'language_' + language.code + '[description]'}
                      label={messages['common.description']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} order={5}>
                    <CustomTextInput
                      id={'language_' + language.code + '[image_alt_title]'}
                      label={messages['common.image_alt_title']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <FormRowStatus
            id='row_status'
            control={control}
            defaultValue={initialValues.row_status}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default PublicationsAddEditPopup;
