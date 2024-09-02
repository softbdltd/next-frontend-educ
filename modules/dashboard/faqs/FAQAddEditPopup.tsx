import {Box, Button, Grid, IconButton} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconFAQ from '../../../@core/icons/IconFAQ';
import yup from '../../../@core/libs/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {
  useFetchFAQ,
  useFetchLocalizedCMSGlobalConfig,
} from '../../../services/cmsManagement/hooks';
import {createFAQ, updateFAQ} from '../../../services/cmsManagement/FAQService';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import {Add, Delete} from '@mui/icons-material';
import ShowInTypes from '../../../@core/utilities/ShowInTypes';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import LanguageCodes from '../../../@core/utilities/LanguageCodes';
import {objectFilter} from '../../../@core/utilities/helpers';
import RowStatus from '../../../@core/utilities/RowStatus';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {useFetchLocalizedInstitutes} from '../../../services/instituteManagement/hooks';
import {useFetchLocalizedOrganizations} from '../../../services/organaizationManagement/hooks';
import {useFetchLocalizedIndustryAssociations} from '../../../services/IndustryAssociationManagement/hooks';
import {useFetchLocalizedMinistries} from '../../../services/ministryManagement/hooks';

interface FAQAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  question: '',
  answer: '',
  show_in: '',
  institute_id: '',
  organization_id: '',
  industry_association_id: '',
  ministry_id: '',
  row_status: '1',
};

const FAQAddEditPopup: FC<FAQAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser<CommonAuthUser>();

  const isEdit = itemId != null;
  const {data: itemData, isLoading, mutate: mutateFAQ} = useFetchFAQ(itemId);

  const {data: cmsGlobalConfig, isLoading: isFetching} =
    useFetchLocalizedCMSGlobalConfig();
  const [languageList, setLanguageList] = useState<any>([]);
  const [showInId, setShowInId] = useState<number | null>(null);
  const [allLanguages, setAllLanguages] = useState<any>([]);
  const [selectedLanguageList, setSelectedLanguageList] = useState<any>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<
    string | null
  >(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<string>>([]);
  const [instituteFilter, setInstituteFilter] = useState<any>(null);
  const [industryFilter, setIndustryFilter] = useState<any>(null);
  const [industryAssociationFilter, setIndustryAssociationFilter] =
    useState<any>(null);
  const [ministryFilter, setMinistryFilter] = useState<any>(null);

  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilter);

  const {data: organizations, isLoading: isLoadingOrganizations} =
    useFetchLocalizedOrganizations(industryFilter);

  const {data: industryAssociations, isLoading: isLoadingIndustryAssociations} =
    useFetchLocalizedIndustryAssociations(industryAssociationFilter);

  const {data: ministries, isLoading: isLoadingMinistries} =
    useFetchLocalizedMinistries(ministryFilter);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      show_in: authUser?.isSystemUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['faq.show_in'] as string)
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
      question: yup
        .string()
        .trim()
        .required()
        .label(messages['faq.question'] as string),
      answer: yup
        .string()
        .trim()
        .required()
        .label(messages['faq.answer'] as string),
      language_en: !selectedCodes.includes(LanguageCodes.ENGLISH)
        ? yup.object().shape({})
        : yup.object().shape({
            question: yup
              .string()
              .trim()
              .required()
              .label(messages['faq.question'] as string),
            answer: yup
              .string()
              .trim()
              .required()
              .label(messages['faq.answer'] as string),
          }),
    });
  }, [messages, selectedCodes, authUser]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

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
        question: itemData?.question,
        answer: itemData?.answer,
        show_in: itemData?.show_in,
        institute_id: itemData?.institute_id,
        ministry_id: itemData?.ministry_id,
        organization_id: itemData?.organization_id,
        industry_association_id: itemData?.industry_association_id,
        row_status: itemData?.row_status,
      };

      const otherLangData = itemData?.other_language_fields;

      if (otherLangData) {
        let keys: any = Object.keys(otherLangData);
        keys.map((key: string) => {
          data['language_' + key] = {
            code: key,
            question: otherLangData[key].question,
            answer: otherLangData[key].answer,
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
  }, [itemData, allLanguages, authUser]);

  const changeShowInAction = useCallback((id: number) => {
    (async () => {
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
      } else if (id == ShowInTypes.MINISTRY) {
        setMinistryFilter({
          row_status: RowStatus.ACTIVE,
        });
      }
      try {
        if (id === ShowInTypes.TSP) {
          setInstituteFilter({row_status: RowStatus.ACTIVE});
        } else if (id == ShowInTypes.INDUSTRY) {
          setIndustryFilter({
            row_status: RowStatus.ACTIVE,
          });
        } else if (id == ShowInTypes.INDUSTRY_ASSOCIATION) {
          setIndustryAssociationFilter({
            row_status: RowStatus.ACTIVE,
          });
        }
      } catch (e) {}

      setShowInId(id);
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
        delete formData.ministry_id;
        delete formData.organization_id;
        delete formData.industry_association_id;
      }

      if (formData.show_in != ShowInTypes.TSP) {
        formData.institute_id = '';
      }
      if (formData.show_in != ShowInTypes.INDUSTRY) {
        formData.organization_id = '';
      }
      if (formData.show_in != ShowInTypes.INDUSTRY_ASSOCIATION) {
        formData.industry_association_id = '';
      }
      if (formData.show_in != ShowInTypes.MINISTRY) {
        formData.ministry_id = '';
      }
      objectFilter(formData);

      let data = {...formData};

      let otherLanguagesFields: any = {};
      delete data.language_list;

      selectedLanguageList.map((language: any) => {
        const langObj = formData['language_' + language.code];

        otherLanguagesFields[language.code] = {
          question: langObj.question,
          answer: langObj.answer,
        };
      });
      delete data['language_en'];

      if (selectedLanguageList.length > 0)
        data.other_language_fields = otherLanguagesFields;

      //console.log('submitted data: ', data);

      if (itemId) {
        await updateFAQ(itemId, data);
        updateSuccessMessage('menu.faq');
        mutateFAQ();
      } else {
        await createFAQ(data);
        createSuccessMessage('menu.faq');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      title={
        <>
          <IconFAQ />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='menu.faq' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='menu.faq' />}}
            />
          )}
        </>
      }
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
                  isLoading={isLoadingInstitutes}
                  control={control}
                  options={institutes}
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
                  isLoading={isLoadingOrganizations}
                  control={control}
                  options={organizations}
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
                  isLoading={isLoadingIndustryAssociations}
                  control={control}
                  options={industryAssociations}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              )}
              {showInId == ShowInTypes.MINISTRY && (
                <Grid item xs={12} sm={6} md={6}>
                  <CustomFilterableFormSelect
                    required
                    id={'ministry_id'}
                    label={messages['common.ministry']}
                    isLoading={isLoadingMinistries}
                    control={control}
                    options={ministries}
                    optionValueProp={'id'}
                    optionTitleProp={['title']}
                    errorInstance={errors}
                  />
                </Grid>
              )}
            </Grid>
          </React.Fragment>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id={'question'}
            label={messages['faq.question']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id={'answer'}
            label={messages['faq.answer']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
            multiline={true}
            rows={3}
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
            {messages['faq.add_language']}
          </Button>
        </Grid>

        <Grid item xs={12}>
          {selectedLanguageList.map((language: any) => (
            <Box key={language.code} sx={{marginTop: '10px'}}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {language.native_name}
                </legend>
                <Grid container spacing={{xs: 1, sm: 3, md: 5}}>
                  <Grid item xs={10} sm={11} md={11}>
                    <CustomTextInput
                      required
                      id={'language_' + language.code + '[question]'}
                      label={messages['faq.question']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={2} sm={1} md={1}>
                    <IconButton
                      aria-label='delete'
                      color={'error'}
                      onClick={(event) => {
                        onDeleteLanguage(language);
                      }}>
                      <Delete color={'error'} />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextInput
                      required
                      id={'language_' + language.code + '[answer]'}
                      label={messages['faq.answer']}
                      control={control}
                      errorInstance={errors}
                      multiline={true}
                      rows={3}
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
export default FAQAddEditPopup;
