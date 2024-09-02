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
import {Add, Delete, WorkOutline} from '@mui/icons-material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {useFetchLocalizedCMSGlobalConfig} from '../../../services/cmsManagement/hooks';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {Box, Button, IconButton} from '@mui/material';
import TextEditor from '../../../@core/components/editor/TextEditor';
import {
  getStaticPageOrBlockByPageCode,
  updateStaticPage,
} from '../../../services/cmsManagement/StaticPageService';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import StaticPageCategoryTypes from '../../../@core/utilities/StaticPageCategoryTypes';
import {IStaticPageContent} from '../../../shared/Interface/common.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';

// import {IStaticPage} from '../../../shared/Interface/common.interface';

interface StaticPageAddEditPopupProps {
  pageCode: string;
  pageCategory: number;
  onClose: () => void;
}

const initialValues: Partial<IStaticPageContent> = {
  title: '',
  sub_title: '',
  content: '',
  row_status: '1',
  show_in: '',
};

const StaticPageAddEditPopup: FC<StaticPageAddEditPopupProps> = ({
  pageCode,
  pageCategory,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser<CommonAuthUser>();
  const {data: cmsGlobalConfig, isLoading: isLoadingConfigData} =
    useFetchLocalizedCMSGlobalConfig();

  const [allLanguages, setAllLanguages] = useState<any>([]);
  const [languageList, setLanguageList] = useState<any>([]);
  const [selectedLanguageList, setSelectedLanguageList] = useState<any>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<
    string | null
  >(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<string>>([]);
  const [itemData, setItemData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showInList, setShowInList] = useState<Array<any>>([]);
  const [showIn, setShowIn] = useState<number | null>(null);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      show_in:
        authUser &&
        authUser.isSystemUser &&
        pageCategory == StaticPageCategoryTypes.COMMON
          ? yup
              .string()
              .trim()
              .required()
              .label(messages['common.show_in'] as string)
          : yup.string(),
      title: yup
        .string()
        .title('bn', true)
        .label(messages['common.title'] as string),
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
          }),
    });
  }, [messages, selectedCodes, authUser]);

  const {
    register,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<IStaticPageContent>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (authUser && authUser?.isSystemUser) {
      switch (pageCategory) {
        case StaticPageCategoryTypes.COMMON:
          setShowIn(ShowInTypes.NICE3);
          break;
        case StaticPageCategoryTypes.EDUC:
          setShowIn(ShowInTypes.NICE3);
          break;
        case StaticPageCategoryTypes.LEARNER:
          setShowIn(ShowInTypes.LEARNER);
          break;
        case StaticPageCategoryTypes.RPL:
          setShowIn(ShowInTypes.RPL);
          break;
        case StaticPageCategoryTypes.MINISTRY:
          setShowIn(ShowInTypes.MINISTRY);
          break;
        default:
          setShowIn(null);
      }
    }
  }, [pageCategory, authUser]);

  useEffect(() => {
    if (authUser && !authUser?.isSystemUser) {
      (async () => {
        setIsLoading(true);
        const response = await getStaticPageOrBlockByPageCode(pageCode, {});
        if (response && response.data) setItemData(response.data);
        setIsLoading(false);
      })();
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && showIn) {
      (async () => {
        setIsLoading(true);
        setItemData(null);
        try {
          const params: any = {show_in: showIn};

          const response = await getStaticPageOrBlockByPageCode(
            pageCode,
            params,
          );
          if (response && response.data) setItemData(response.data);
        } catch (e) {}
        setIsLoading(false);
      })();
    }
  }, [authUser, showIn]);

  useEffect(() => {
    if (cmsGlobalConfig) {
      const filteredLanguage = cmsGlobalConfig.language_configs?.filter(
        (item: any) => item.code != LanguageCodes.BANGLA,
      );

      setAllLanguages(filteredLanguage);
      setLanguageList(filteredLanguage);

      const filteredShowIn = cmsGlobalConfig?.show_in?.filter((item: any) =>
        [
          ShowInTypes.NICE3,
          ShowInTypes.LEARNER,
          ShowInTypes.RPL,
          ShowInTypes.MINISTRY,
        ].includes(item.id),
      );

      setShowInList(filteredShowIn);
    }
  }, [cmsGlobalConfig]);

  useEffect(() => {
    if (itemData) {
      let data: any = {
        show_in: itemData?.show_in,
        title: itemData?.title,
        sub_title: itemData?.sub_title,
        content: itemData?.content,
        row_status: String(itemData?.row_status),
      };

      const otherLangData = itemData?.other_language_fields;

      if (otherLangData) {
        let keys: any = Object.keys(otherLangData);
        keys.map((key: string) => {
          data['language_' + key] = {
            code: key,
            title: otherLangData[key].title,
            sub_title: otherLangData[key].sub_title,
            content: otherLangData[key].content,
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
      reset({...initialValues, ...{show_in: showIn ? showIn : ''}});
      setSelectedCodes([]);
      setSelectedLanguageList([]);
      setLanguageList([...allLanguages]);
    }
  }, [itemData, allLanguages]);

  const onLanguageListChange = useCallback((selected: any) => {
    setSelectedLanguageCode(selected);
  }, []);

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

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      if (authUser?.isSystemUser) {
        formData.show_in = showIn;
      }

      let data = {...formData};

      let otherLanguagesFields: any = {};
      delete data.language_list;

      selectedLanguageList.map((language: any) => {
        const langObj = formData['language_' + language.code];

        otherLanguagesFields[language.code] = {
          title: langObj.title,
          sub_title: langObj.sub_title,
          content: langObj.content,
        };
      });
      delete data['language_en'];

      if (selectedLanguageList.length > 0)
        data.other_language_fields = otherLanguagesFields;

      await updateStaticPage(pageCode, data);
      updateSuccessMessage('static_page.label');

      props.onClose();
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
          <WorkOutline />
          <IntlMessages
            id='common.edit'
            values={{subject: <IntlMessages id='static_page.label' />}}
          />
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
        {authUser &&
          authUser.isSystemUser &&
          pageCategory == StaticPageCategoryTypes.COMMON && (
            <React.Fragment>
              <Grid item xs={12} sm={6} md={6}>
                <FormRadioButtons
                  id='show_in'
                  label={'common.show_in'}
                  control={control}
                  radios={showInList.map((item: any) => {
                    return {
                      label: item.title,
                      key: item.id,
                    };
                  })}
                  defaultValue={initialValues.show_in}
                  onChange={(value: number) => {
                    setShowIn(value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} />
            </React.Fragment>
          )}
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

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='sub_title'
            label={messages['common.sub_title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextEditor
            id={'content'}
            label={messages['common.content']}
            errorInstance={errors}
            value={itemData?.content || initialValues.content}
            height={'300px'}
            key={1}
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            setError={setError}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomFilterableFormSelect
            id={'language_list'}
            label={messages['common.language']}
            isLoading={isLoadingConfigData}
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
            {messages['static_page.add_language']}
          </Button>
        </Grid>

        <Grid item xs={12}>
          {selectedLanguageList.map((language: any, index: number) => (
            <Box key={language.code} sx={{marginTop: '10px'}}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {language.native_name}
                </legend>
                <Grid container spacing={5}>
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
                      id={'language_' + language.code + '[sub_title]'}
                      label={messages['common.sub_title']}
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

                  <Grid
                    item
                    xs={12}
                    order={{xs: 4}}
                    sx={{
                      minWidth: {xs: '100%', sm: '100%'},
                      maxWidth: {xs: '100px', sm: '100px'},
                    }}>
                    <TextEditor
                      id={'language_' + language.code + '[content]'}
                      label={messages['common.content']}
                      errorInstance={errors}
                      value={
                        itemData?.other_language_fields?.[language.code]
                          ?.content || initialValues.content
                      }
                      height={'300px'}
                      key={1}
                      register={register}
                      setValue={setValue}
                      clearErrors={clearErrors}
                      setError={setError}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
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

export default StaticPageAddEditPopup;
