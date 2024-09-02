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
import {Add, Delete} from '@mui/icons-material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {
  useFetchLocalizedCMSGlobalConfig,
  useFetchLocalizedSliders,
  useFetchSliderBanner,
} from '../../../services/cmsManagement/hooks';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import {Box, Button, IconButton} from '@mui/material';
import SliderTemplateShowTypes from '../sliderBanners/SliderTemplateShowTypes';
import {
  createSliderBanner,
  updateSliderBanner,
} from '../../../services/cmsManagement/SliderBannerService';
import RowStatus from '../../../@core/utilities/RowStatus';
import IconSliderBanner from '../../../@core/icons/IconSliderBanner';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';

interface SliderBannerAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  slider_id: '',
  title: '',
  title_en: '',
  sub_title: '',
  banner_template_code: '',
  link: '',
  button_text: '',
  image_alt_title: '',
  banner_image_path: '',
  is_button_available: '1',
  row_status: '1',
};

const SliderBannerAddEditPopup: FC<SliderBannerAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const [educSliderSelected, setEducSliderSelected] = useState<any>(false);

  const isEdit = itemId != null;
  const {
    data: itemData,
    isLoading,
    mutate: mutateSliderBanner,
  } = useFetchSliderBanner(itemId);

  const {data: cmsGlobalConfig, isLoading: isFetching} =
    useFetchLocalizedCMSGlobalConfig();

  const [sliderFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: sliders, isLoading: isSliderLoading} =
    useFetchLocalizedSliders(sliderFilters);

  const [allLanguages, setAllLanguages] = useState<any>([]);
  const [languageList, setLanguageList] = useState<any>([]);
  const [selectedLanguageList, setSelectedLanguageList] = useState<any>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<
    string | null
  >(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<string>>([]);

  const [isButtonAvailable, setIsButtonAvailable] = useState<boolean>(true);
  const [isFileRemove, setIsFileRemove] = useState<boolean>(false);
  const [selectedTemplateCode, setSelectedTemplateCode] = useState<
    string | null
  >(null);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      slider_id: yup
        .string()
        .trim()
        .required()
        .label(messages['slider.label'] as string),

      title: yup
        .string()
        .title('bn', true)
        .label(messages['common.title'] as string),
      title_en: yup
        .string()
        .title('en', false)
        .label(messages['common.title_en'] as string),

      banner_image_path: yup
        .string()
        .required()
        .label(messages['common.image_path'] as string),
      image_alt_title: yup
        .string()
        .required()
        .label(messages['common.image_alt_title'] as string),
      banner_template_code: yup
        .string()
        .required()
        .label(messages['slider.banner_template_code'] as string),
      is_button_available: yup
        .string()
        .required()
        .label('common.is_button_available'),

      link: yup
        .mixed()
        .label(messages['common.link'] as string)
        .when('is_button_available', {
          is: (val: number) => {
            return val == 1;
          },
          then: yup.string().required(),
        }),

      button_text: yup
        .mixed()
        .label(messages['common.button_text'] as string)
        .when('is_button_available', {
          is: (val: number) => {
            return val == 1;
          },
          then: yup.string().required(),
        }),

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
            button_text: yup
              .string()
              .max(20)
              .label(messages['common.button_text'] as string)
              .when('is_button_available', {
                is: (val: number) => {
                  return val == 1;
                },
                then: yup.string().required(),
              }),
          }),
    });
  }, [messages, selectedCodes]);

  const {
    register,
    reset,
    control,
    setError,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const templateCodes = useMemo(
    () => [
      {
        code: SliderTemplateShowTypes.BT_CB,
        title: messages['slider.template_code_bt_cb'],
      },
      {
        code: SliderTemplateShowTypes.BT_LR,
        title: messages['slider.template_code_bt_lr'],
      },
      {
        code: SliderTemplateShowTypes.BT_RL,
        title: messages['slider.template_code_bt_rl'],
      },
      {
        code: SliderTemplateShowTypes.BT_OB,
        title: messages['slider.template_code_bt_ob'],
      },
    ],
    [messages],
  );

  useEffect(() => {
    if (cmsGlobalConfig) {
      const filteredLanguage = cmsGlobalConfig.language_configs?.filter(
        (item: any) => item.code != LanguageCodes.BANGLA,
      );

      setAllLanguages(filteredLanguage);
      setLanguageList(filteredLanguage);
    }
  }, [cmsGlobalConfig]);

  useEffect(() => {
    if (itemData) {
      let data: any = {
        slider_id: itemData?.slider_id,
        title: itemData?.title,
        sub_title: itemData?.sub_title,
        is_button_available: itemData?.is_button_available,
        button_text: itemData?.button_text,
        link: itemData?.link,
        image_alt_title: itemData?.image_alt_title,
        banner_template_code: itemData?.banner_template_code,
        banner_image_path: itemData?.banner_image_path,
        row_status: String(itemData?.row_status),
      };

      const selectedSlider = sliders?.find(
        (slider: any) => slider?.id === itemData?.slider_id,
      );

      setEducSliderSelected(selectedSlider?.show_in === ShowInTypes.NICE3);

      setSelectedTemplateCode(itemData?.banner_template_code);

      const otherLangData = itemData?.other_language_fields;

      if (otherLangData) {
        let keys: any = Object.keys(otherLangData);
        keys.map((key: string) => {
          data['language_' + key] = {
            code: key,
            title: otherLangData[key].title,
            sub_title: otherLangData[key].sub_title,
            image_alt_title: otherLangData[key].image_alt_title,
            button_text: otherLangData[key].button_text,
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
      setIsButtonAvailable(itemData?.is_button_available == 1);
    } else {
      reset(initialValues);
      setIsButtonAvailable(true);
    }
  }, [itemData, allLanguages, sliders]);

  const sliderChangeHandler = useCallback(
    (slider_id: any) => {
      const selectedSlider = sliders?.find(
        (slider: any) => slider?.id === slider_id,
      );

      setEducSliderSelected(selectedSlider?.show_in === ShowInTypes.NICE3);
    },
    [educSliderSelected, sliders],
  );

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

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      let data = {...formData};

      let otherLanguagesFields: any = {};
      delete data.language_list;

      selectedLanguageList.map((language: any) => {
        const langObj = formData['language_' + language.code];

        otherLanguagesFields[language.code] = {
          title: langObj.title,
          sub_title: langObj.sub_title,
          alt_title: langObj.alt_title,
          button_text: langObj.button_text,
        };
      });

      delete data['language_en'];

      if (selectedLanguageList.length > 0)
        data.other_language_fields = otherLanguagesFields;

      if (itemId) {
        await updateSliderBanner(itemId, data);
        updateSuccessMessage('banners.label');
        mutateSliderBanner();
      } else {
        await createSliderBanner(data);
        createSuccessMessage('banners.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const templateOnChange = (code: any) => {
    if (
      (code == 'BT_CB' || code == 'BT_OB') &&
      (selectedTemplateCode == 'BT_LR' || selectedTemplateCode == 'BT_RL')
    ) {
      if (getValues('banner_image_path')) {
        setIsFileRemove((prev) => !prev);
        setValue('banner_image_path', '');
      }
    } else if (
      (code == 'BT_LR' || code == 'BT_RL') &&
      (selectedTemplateCode == 'BT_CB' || selectedTemplateCode == 'BT_OB')
    ) {
      if (getValues('banner_image_path')) {
        setIsFileRemove((prev) => !prev);
        setValue('banner_image_path', '');
      }
    }

    setSelectedTemplateCode(code);
  };

  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <IconSliderBanner />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='banners.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='banners.label' />}}
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
          <CustomFilterableFormSelect
            required
            id={'slider_id'}
            label={messages['slider.label']}
            isLoading={isSliderLoading}
            control={control}
            options={sliders}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
            onChange={sliderChangeHandler}
          />
        </Grid>
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
        <Grid item xs={12} sm={6} md={6}>
          <CustomFilterableFormSelect
            required={true}
            id={'banner_template_code'}
            label={messages['slider.banner_template_code']}
            isLoading={false}
            control={control}
            options={templateCodes}
            optionValueProp={'code'}
            optionTitleProp={['title']}
            errorInstance={errors}
            onChange={templateOnChange}
          />
        </Grid>
        {/* 450x350*/}
        {selectedTemplateCode && (
          <Grid item xs={12} sm={6} md={6}>
            <FileUploadComponent
              id='banner_image_path'
              defaultFileUrl={itemData?.banner_image_path}
              errorInstance={errors}
              setValue={setValue}
              register={register}
              label={messages['common.image_path']}
              required={true}
              height={educSliderSelected ? 450 : 600}
              width={
                educSliderSelected
                  ? 350
                  : ['BT_CB', 'BT_OB'].includes(selectedTemplateCode)
                  ? 1800
                  : 900
              }
              removeFile={isFileRemove}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='image_alt_title'
            label={messages['common.image_alt_title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <FormRadioButtons
            id='is_button_available'
            label={'common.is_button_available'}
            control={control}
            radios={[
              {
                label: messages['common.yes'],
                key: 1,
              },
              {
                label: messages['common.no'],
                key: 0,
              },
            ]}
            defaultValue={initialValues.is_button_available}
            onChange={useCallback(() => {
              setIsButtonAvailable((prev) => !prev);
            }, [])}
          />
        </Grid>
        {isButtonAvailable && (
          <React.Fragment>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                required
                id='link'
                label={messages['common.link']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                required
                id='button_text'
                label={messages['common.button_text']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
          </React.Fragment>
        )}
        <Grid item xs={12}>
          <Grid container spacing={5}>
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
                {messages['slider_banner.add_language']}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {selectedLanguageList.map((language: any) => (
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
                      onClick={(event) => {
                        onDeleteLanguage(language);
                      }}>
                      <Delete color={'error'} />
                    </IconButton>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} order={{xs: 4}}>
                    <CustomTextInput
                      id={'language_' + language.code + '[image_alt_title]'}
                      label={messages['common.image_alt_title']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  {isButtonAvailable && (
                    <Grid item xs={12} sm={6} md={6} order={{xs: 5}}>
                      <CustomTextInput
                        required
                        id={'language_' + language.code + '[button_text]'}
                        label={messages['common.button_text']}
                        control={control}
                        errorInstance={errors}
                      />
                    </Grid>
                  )}
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

export default SliderBannerAddEditPopup;
