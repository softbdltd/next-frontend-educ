import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {SubmitHandler, useForm} from 'react-hook-form';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import Grid from '@mui/material/Grid';
import {useIntl} from 'react-intl';
import IconDivision from '../../../@core/icons/IconDivision';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {useFetchLocalizedInstitutes} from '../../../services/instituteManagement/hooks';
import {useFetchLocalizedOrganizations} from '../../../services/organaizationManagement/hooks';
import {useFetchLocalizedIndustryAssociations} from '../../../services/IndustryAssociationManagement/hooks';
import {useFetchLocalizedMinistries} from '../../../services/ministryManagement/hooks';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import TextEditor from '../../../@core/components/editor/TextEditor';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';
import {
  createLandingPagePopup,
  updateLandingPagePopup,
} from '../../../services/landingPageNoticeManagement/landingPageNoticeService';
import {AccessorType} from '../../../shared/constants/AccessorType';
import {LandingPageNoticePopup} from '../../../shared/Interface/landingPageNoticePopup.interface';
import {getArrayColumn} from '../../../@core/utilities/helpers';
import {useFetchLandingPageNoticePopup} from '../../../services/landingPageNoticeManagement/hooks';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {Box, DialogActions, Typography} from '@mui/material';
import CustomMuiModal, {
  DialogTitle,
} from '../../../@core/modals/CustomMuiModal/CustomMuiModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';

interface LandingPageNoticeAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  accessor_type: '',
  institute: [],
  organization: [],
  industry_association: [],
  ministry: [],
  content: '',
};

const LandingPageNoticeAddEditPopup: FC<LandingPageNoticeAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages, locale} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const [accessorType, setAccessorType] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<any>(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [instituteFilters] = useState<any>({
    service_type: [],
  });
  const [organizationFilters] = useState<any>({});
  const [idustryAssociationFilters] = useState<any>({});
  const [ministriesFilters] = useState<any>({});
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [withBackground, setWithBackground] = useState<boolean>(false);
  const {data: instituteOptions, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilters);
  const {data: organizationOptions, isLoading: isLoadingOrganization} =
    useFetchLocalizedOrganizations(organizationFilters);
  const {
    data: industryAssociationOptions,
    isLoading: isLoadingIndustryAssociation,
  } = useFetchLocalizedIndustryAssociations(idustryAssociationFilters);
  const {data: ministryOptions, isLoading: isLoadingMinistries} =
    useFetchLocalizedMinistries(ministriesFilters);

  const isEdit = itemId != null;
  const {
    data: itemData,
    isLoading,
    mutate: mutateLandingPageNoticePopup,
  } = useFetchLandingPageNoticePopup(itemId);

  const onChangeAccessorType = useCallback(
    (key: number) => {
      setAccessorType(key);
    },
    [setAccessorType],
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      content: yup
        .string()
        .required()
        .label(messages['common.content'] as string),
    });
  }, [messages]);

  const {
    reset,
    handleSubmit,
    setError,
    control,
    register,
    setValue,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemId && itemData) {
      setAccessorType(itemData?.accessor_type);
      setIsEnabled(itemData?.is_enabled);
      setWithBackground(itemData?.with_background);

      reset({
        institute:
          itemData?.accessor_type === AccessorType.INSTITUTE
            ? itemData?.accessor_id
            : [],
        organization:
          itemData?.accessor_type === AccessorType.ORGANIZATION
            ? itemData?.accessor_id
            : [],
        industry_association:
          itemData?.accessor_type === AccessorType.INDUSTRY_ASSOCIATION
            ? itemData?.accessor_id
            : [],
        ministry:
          itemData?.accessor_type === AccessorType.MINISTRY
            ? itemData?.accessor_id
            : [],
        content: itemData?.content,
        accessor_type: itemData?.accessor_type,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData, reset, itemId]);

  const previewCancelHandler = () => {
    setIsPreviewMode(false);
  };

  const onSubmit: SubmitHandler<LandingPageNoticePopup> = async (
    data: LandingPageNoticePopup,
  ) => {
    try {
      let formData: any;
      if (!isEdit) {
        // Nan is for educ
        let accessorIds: Array<number> = [NaN];

        if (data.organization && data.organization.length > 0) {
          accessorIds = getArrayColumn(data?.organization, 'id');
        } else if (
          data.industry_association &&
          data.industry_association.length > 0
        ) {
          accessorIds = getArrayColumn(data?.industry_association, 'id');
        } else if (data.institute && data.institute.length > 0) {
          accessorIds = getArrayColumn(data?.institute, 'id');
        } else if (data.ministry && data.ministry?.length > 0) {
          accessorIds = getArrayColumn(data?.ministry, 'id');
        }

        formData = {
          content: data?.content,
          with_background: data?.with_background ? 1 : 0,
          is_enabled: data?.is_enabled ? 1 : 0,
          accessor_ids: accessorIds,
          accessor_type: data?.accessor_type,
        };
      } else {
        formData = {
          content: data?.content,
          is_enabled: data?.is_enabled ? 1 : 0,
          with_background: data?.with_background ? 1 : 0,
          accessor_id: itemData?.accessor_id,
          accessor_type: itemData?.accessor_type,
        };
      }

      if (!isPreviewMode) {
        setIsPreviewMode(true);
        setPreviewData(formData);
      } else {
        if (itemId) {
          await updateLandingPagePopup(itemId, formData);
          updateSuccessMessage('common.landing_page_notice');
          mutateLandingPageNoticePopup();
        } else {
          await createLandingPagePopup(formData);
          createSuccessMessage('common.landing_page_notice');
        }
        props.onClose();
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, setError, errorStack});
    }
  };

  return (
    <>
      <HookFormMuiModal
        {...props}
        open={!isPreviewMode}
        title={
          <>
            <IconDivision />
            {isEdit ? (
              <IntlMessages
                id='common.edit'
                values={{
                  subject: <IntlMessages id='common.landing_page_notice' />,
                }}
              />
            ) : (
              <IntlMessages
                id='common.add_new'
                values={{
                  subject: <IntlMessages id='common.landing_page_notice' />,
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
            <SubmitButton
              isSubmitting={isSubmitting}
              isLoading={isLoading}
              label={messages['common.preview'] as string}
              startIcon={<VisibilityIcon />}
            />
          </>
        }>
        <Grid container spacing={5}>
          {!isEdit && (
            <Grid item xs={12}>
              <FormRadioButtons
                id={'accessor_type'}
                defaultValue={accessorType}
                label={'common.type'}
                radios={[
                  {
                    key: AccessorType.INSTITUTE,
                    label: messages['institute.label'],
                  },
                  {
                    key: AccessorType.ORGANIZATION,
                    label: messages['organization.label'],
                  },
                  {
                    key: AccessorType.INDUSTRY_ASSOCIATION,
                    label: messages['industry_association.label'],
                  },
                  {
                    key: AccessorType.MINISTRY,
                    label: messages['ministry.label'],
                  },
                  {
                    key: 'EDUC',
                    label: messages['common.educ'],
                  },
                ]}
                control={control}
                onChange={onChangeAccessorType}
                errorInstance={errors}
              />
            </Grid>
          )}
          {isEdit && (
            <Grid item xs={12} md={6} sm={6}>
              <Typography variant={'h6'}>
                {locale == LocaleLanguage.EN
                  ? itemData?.title_en
                  : itemData?.title}
              </Typography>
            </Grid>
          )}
          {accessorType == AccessorType.INSTITUTE && !isEdit && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomSelectAutoComplete
                  id='institute'
                  label={messages['institute.label']}
                  control={control}
                  options={instituteOptions || []}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  isLoading={isLoadingInstitutes}
                />
              </Grid>
            </>
          )}
          {accessorType == AccessorType.ORGANIZATION && !isEdit && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomSelectAutoComplete
                  id='organization'
                  label={messages['organization.label_bn']}
                  control={control}
                  options={organizationOptions || []}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  isLoading={isLoadingOrganization}
                />
              </Grid>
            </>
          )}
          {accessorType == AccessorType.INDUSTRY_ASSOCIATION && !isEdit && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomSelectAutoComplete
                  id='industry_association'
                  label={messages['industry_association.label']}
                  control={control}
                  options={industryAssociationOptions || []}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  isLoading={isLoadingIndustryAssociation}
                />
              </Grid>
            </>
          )}{' '}
          {accessorType == AccessorType.MINISTRY && !isEdit && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomSelectAutoComplete
                  id='ministry'
                  label={messages['ministry.label']}
                  control={control}
                  options={ministryOptions || []}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  isLoading={isLoadingMinistries}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextEditor
              id={'content'}
              label={messages['common.content']}
              errorInstance={errors}
              value={
                previewData?.content
                  ? previewData?.content
                  : itemData?.content || initialValues.content
              }
              height={'300px'}
              key={1}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              setError={setError}
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCheckbox
              id='with_background'
              label={messages['common.with_background']}
              register={register}
              errorInstance={errors}
              checked={withBackground}
              onChange={(event: any) => {
                setWithBackground((prev) => !prev);
              }}
              isLoading={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCheckbox
              id='is_enabled'
              label={messages['common.enabled']}
              register={register}
              errorInstance={errors}
              checked={isEnabled}
              onChange={(event: any) => {
                setIsEnabled((prev) => !prev);
              }}
              isLoading={false}
            />
          </Grid>
        </Grid>
      </HookFormMuiModal>
      <CustomMuiModal
        open={isPreviewMode}
        onClose={props.onClose}
        maxWidth={isBreakPointUp('md') ? 'md' : 'sm'}>
        <DialogTitle onClose={props.onClose}>{}</DialogTitle>
        <Box
          sx={{
            marginTop: '10px',
            padding: '15px',
            height: 'calc(100% - 42px)',
            width: '100%',
          }}>
          <div
            dangerouslySetInnerHTML={{
              __html: previewData?.content,
            }}
          />
        </Box>
        <DialogActions>
          <>
            <EditButton
              onClick={previewCancelHandler}
              variant={'outlined'}
              isLoading={isLoading}
            />
            <SubmitButton
              isSubmitting={isSubmitting}
              isLoading={isLoading}
              label={messages['common.confirm'] as string}
              onClick={handleSubmit(onSubmit)}
            />
          </>
        </DialogActions>
      </CustomMuiModal>
    </>
  );
};

export default LandingPageNoticeAddEditPopup;
