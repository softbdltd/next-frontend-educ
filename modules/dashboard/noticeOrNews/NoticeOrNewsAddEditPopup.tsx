import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {
  useFetchLocalizedCMSGlobalConfig,
  useFetchNoticeOrNews,
} from '../../../services/cmsManagement/hooks';
import yup from '../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  createNoticeOrNews,
  updateNoticeOrNews,
} from '../../../services/cmsManagement/NoticeOrNewsService';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {Box, Button, Grid, IconButton} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import TextEditor from '../../../@core/components/editor/TextEditor';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import NoticeOrNewsTypes from '../../../@core/utilities/NoticeOrNewsTypes';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {Add, Delete} from '@mui/icons-material';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import {getMomentDateFormat} from '../../../@core/utilities/helpers';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {getAllInstitutes} from '../../../services/instituteManagement/InstituteService';
import {getAllOrganizations} from '../../../services/organaizationManagement/OrganizationService';
import {getAllIndustryAssociations} from '../../../services/IndustryAssociationManagement/IndustryAssociationService';
import RowStatus from '../../../@core/utilities/RowStatus';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import {getAllMinistries} from '../../../services/ministryManagement/ministryService';

interface NoticeOrNewsAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  type: '',
  title: '',
  title_en: '',
  institute_id: '',
  organization_id: '',
  industry_association_id: '',
  ministry_id: '',
  details: '',
  main_image_path: '',
  grid_image_path: '',
  thumb_image_path: '',
  file_path: '',
  image_alt_title: '',
  show_in: '',
  file_alt_title: '',
  row_status: '1',
  other_language_fields: '',
};

const NoticeOrNewsAddEditPopup: FC<NoticeOrNewsAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;
  const authUser = useAuthUser<CommonAuthUser>();

  const {data: cmsGlobalConfig, isLoading: isFetching} =
    useFetchLocalizedCMSGlobalConfig();

  const {
    data: itemData,
    isLoading,
    mutate: mutateNoticeOrNews,
  } = useFetchNoticeOrNews(itemId);

  const [instituteList, setInstituteList] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [ministryList, setMinistryList] = useState([]);
  const [industryAssociationList, setIndustryAssociationList] = useState([]);
  const [isLoadingSectionNameList, setIsLoadingSectionNameList] =
    useState<boolean>(false);
  const [showInId, setShowInId] = useState<number | null>(null);
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
      title_en: yup
        .string()
        .title('en', false)
        .label(messages['common.title_en'] as string),

      type: yup
        .string()
        .required()
        .label(messages['common.type'] as string),
      show_in: authUser?.isSystemUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['common.show_in'] as string)
        : yup.string(),
      institute_id: yup
        .mixed()
        .label(messages['common.institute'] as string)
        .when('show_in', {
          is: (val: number) => {
            return val == ShowInTypes.TSP;
          },
          then: yup.string().required(),
        }),
      organization_id: yup
        .mixed()
        .label(messages['organization.label'] as string)
        .when('show_in', {
          is: (val: number) => {
            return val == ShowInTypes.INDUSTRY;
          },
          then: yup.string().required(),
        }),
      industry_association_id: yup
        .mixed()
        .label(messages['common.industry_association'] as string)
        .when('show_in', {
          is: (val: number) => {
            return val == ShowInTypes.INDUSTRY_ASSOCIATION;
          },
          then: yup.string().required(),
        }),
      ministry_id: yup
        .mixed()
        .label(messages['common.ministry'] as string)
        .when('show_in', {
          is: (val: number) => {
            return val == ShowInTypes.MINISTRY;
          },
          then: yup.string().required(),
        }),
      main_image_path: yup
        .string()
        .nullable()
        .label(messages['common.main_image_path'] as string),
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
  }, [selectedCodes, messages, authUser]);

  const type = useMemo(
    () => [
      {
        id: NoticeOrNewsTypes.NOTICE,
        label: messages['notice_type.notice'],
      },
      {
        id: NoticeOrNewsTypes.NEWS,
        label: messages['notice_type.news'],
      },
      {
        id: NoticeOrNewsTypes.UPCOMING_EVENTS,
        label: messages['common.upcoming_events'],
      },
    ],
    [messages],
  );

  const {
    register,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      let data: any = {
        type: itemData?.type,
        title: itemData?.title,
        institute_id: itemData?.institute_id,
        organization_id: itemData?.organization_id,
        industry_association_id: itemData?.industry_association_id,
        ministry_id: itemData?.ministry_id,
        details: itemData?.details,
        image_alt_title: itemData?.image_alt_title,
        show_in: itemData?.show_in,
        file_alt_title: itemData?.file_alt_title,
        main_image_path: itemData?.main_image_path,
        grid_image_path: itemData?.grid_image_path,
        file_path: itemData?.file_path,
        thumb_image_path: itemData?.thumb_image_path,
        published_at: itemData?.published_at
          ? getMomentDateFormat(itemData.published_at, 'YYYY-MM-DD')
          : '',
        archived_at: itemData?.archived_at
          ? getMomentDateFormat(itemData.archived_at, 'YYYY-MM-DD')
          : '',
        row_status: itemData?.row_status,
      };

      const otherLangData = itemData?.other_language_fields;

      if (otherLangData) {
        let keys: any = Object.keys(otherLangData);
        keys.map((key: string) => {
          data['language_' + key] = {
            code: key,
            title: otherLangData[key].title,
            details: otherLangData[key].details,
            image_alt_title: otherLangData[key].image_alt_title,
            file_alt_title: otherLangData[key].file_alt_title,
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
      setShowInId(itemData?.show_in);
      if (authUser?.isSystemUser) {
        changeShowInAction(itemData?.show_in);
      }
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

  const changeShowInAction = useCallback((id: number) => {
    (async () => {
      setIsLoadingSectionNameList(true);

      if (id != ShowInTypes.TSP) {
        setValue('institute_id', '');
      }
      if (id != ShowInTypes.INDUSTRY) {
        setValue('organization_id', '');
      }

      if (id != ShowInTypes.INDUSTRY_ASSOCIATION) {
        setValue('industry_association_id', '');
      }
      if (id != ShowInTypes.MINISTRY) {
        setValue('ministry_id', '');
      }
      try {
        if (id === ShowInTypes.TSP && instituteList.length == 0) {
          const response = await getAllInstitutes({
            row_status: RowStatus.ACTIVE,
          });
          if (response && response?.data) {
            setInstituteList(response.data);
          }
        } else if (id == ShowInTypes.INDUSTRY && industryList.length == 0) {
          const response = await getAllOrganizations({
            row_status: RowStatus.ACTIVE,
          });
          if (response && response?.data) {
            setIndustryList(response.data);
          }
        } else if (
          id == ShowInTypes.INDUSTRY_ASSOCIATION &&
          industryAssociationList.length == 0
        ) {
          const response = await getAllIndustryAssociations({
            row_status: RowStatus.ACTIVE,
          });
          if (response && response?.data) {
            setIndustryAssociationList(response.data);
          }
        } else if (id == ShowInTypes.MINISTRY && ministryList.length == 0) {
          const response = await getAllMinistries({
            row_status: RowStatus.ACTIVE,
          });
          if (response && response?.data) {
            setMinistryList(response.data);
          }
        }
      } catch (e) {}

      setShowInId(id);
      setIsLoadingSectionNameList(false);
    })();
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
      if (!authUser?.isSystemUser) {
        delete formData.show_in;
        delete formData.institute_id;
        delete formData.organization_id;
        delete formData.industry_association_id;
        delete formData.ministry_id;
      }

      if (formData.show_in != ShowInTypes.TSP) {
        delete formData.institute_id;
      }
      if (formData.show_in != ShowInTypes.INDUSTRY) {
        delete formData.organization_id;
      }
      if (formData.show_in != ShowInTypes.INDUSTRY_ASSOCIATION) {
        delete formData.industry_association_id;
      }
      if (formData.show_in != ShowInTypes.MINISTRY) {
        delete formData.ministry_id;
      }

      let data = {...formData};

      let otherLanguagesFields: any = {};
      delete data.language_list;

      selectedLanguageList.map((language: any) => {
        const langObj = formData['language_' + language.code];

        otherLanguagesFields[language.code] = {
          title: langObj.title,
          details: langObj.details,
          image_alt_title: langObj.image_alt_title,
          file_alt_title: langObj.file_alt_title,
        };
      });
      delete data['language_en'];

      if (selectedLanguageList.length > 0)
        data.other_language_fields = otherLanguagesFields;

      if (itemId) {
        await updateNoticeOrNews(itemId, data);
        updateSuccessMessage('common.notice_or_news');
        mutateNoticeOrNews();
      } else {
        await createNoticeOrNews(data);
        createSuccessMessage('common.notice_or_news');
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
          <IconStaticPage />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{
                subject: <IntlMessages id='common.notice_or_news' />,
              }}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{
                subject: <IntlMessages id='common.notice_or_news' />,
              }}
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
        {authUser?.isSystemUser && (
          <React.Fragment>
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                required
                id={'show_in'}
                label={messages['faq.show_in']}
                isLoading={isFetching}
                control={control}
                options={cmsGlobalConfig?.show_in}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={changeShowInAction}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              {showInId == ShowInTypes.TSP && (
                <CustomFilterableFormSelect
                  required
                  id={'institute_id'}
                  label={messages['institute.label']}
                  isLoading={isLoadingSectionNameList}
                  control={control}
                  options={instituteList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              )}
              {showInId == ShowInTypes.INDUSTRY && (
                <CustomFilterableFormSelect
                  required
                  id={'organization_id'}
                  label={messages['organization.label']}
                  isLoading={isLoadingSectionNameList}
                  control={control}
                  options={industryList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              )}
              {showInId == ShowInTypes.INDUSTRY_ASSOCIATION && (
                <CustomFilterableFormSelect
                  required
                  id={'industry_association_id'}
                  label={messages['common.industry_association']}
                  isLoading={isLoadingSectionNameList}
                  control={control}
                  options={industryAssociationList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              )}
              {showInId == ShowInTypes.MINISTRY && (
                <CustomFilterableFormSelect
                  required
                  id={'ministry_id'}
                  label={messages['common.ministry']}
                  isLoading={isLoadingSectionNameList}
                  control={control}
                  options={ministryList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              )}
            </Grid>
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
          <CustomFormSelect
            required
            isLoading={false}
            id='type'
            label={messages['common.type']}
            control={control}
            options={type}
            optionValueProp={'id'}
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='file_path'
            defaultFileUrl={itemData?.file_path}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            acceptedFileTypes={['application/pdf']}
            label={messages['common.file_path']}
            required={false}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='main_image_path'
            defaultFileUrl={itemData?.main_image_path}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            acceptedFileTypes={['image/*']}
            label={messages['common.main_image_path']}
            height={'550'}
            width={'1080'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='grid_image_path'
            defaultFileUrl={itemData?.grid_image_path}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            acceptedFileTypes={['image/*']}
            label={messages['common.grid_image_path']}
            required={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='thumb_image_path'
            defaultFileUrl={itemData?.thumb_image_path}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            acceptedFileTypes={['image/*']}
            label={messages['common.thumb_image_path']}
            required={false}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='image_alt_title'
            label={messages['common.image_alt_title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='file_alt_title'
            label={messages['common.file_alt_title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
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

        <Grid item xs={12}>
          <TextEditor
            id={'details'}
            label={messages['common.details']}
            errorInstance={errors}
            value={itemData?.details || initialValues.details}
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
            {messages['notice_or_news.add_language']}
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
                  <Grid item xs={10} sm={11} md={11}>
                    <CustomTextInput
                      required
                      id={'language_' + language.code + '[title]'}
                      label={messages['common.title']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={2} sm={1} md={1}>
                    <IconButton
                      aria-label='delete'
                      color={'error'}
                      onClick={() => {
                        onDeleteLanguage(language);
                      }}>
                      <Delete color={'error'} />
                    </IconButton>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <CustomTextInput
                      id={'language_' + language.code + '[image_alt_title]'}
                      label={messages['common.image_alt_title']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomTextInput
                      id={'language_' + language.code + '[file_alt_title]'}
                      label={messages['common.file_alt_title']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      minWidth: {xs: '100%', sm: '100%'},
                      maxWidth: {xs: '100px', sm: '100px'},
                    }}>
                    <TextEditor
                      id={'language_' + language.code + '[details]'}
                      label={messages['common.details']}
                      errorInstance={errors}
                      value={
                        itemData?.other_language_fields?.[language.code]
                          ?.details || initialValues.details
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

export default NoticeOrNewsAddEditPopup;
