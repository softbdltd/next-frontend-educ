import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import Grid from '@mui/material/Grid';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {useIntl} from 'react-intl';
import IconDivision from '../../../@core/icons/IconDivision';
import yup from '../../../@core/libs/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {useFetchLocalizedInstitutes} from '../../../services/instituteManagement/hooks';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {useFetchLocalizedOrganizations} from '../../../services/organaizationManagement/hooks';
import {useFetchLocalizedIndustryAssociations} from '../../../services/IndustryAssociationManagement/hooks';
import {useFetchLocalizedMinistries} from '../../../services/ministryManagement/hooks';
import {Domain} from '../../../shared/Interface/domain.interface';
import {useFetchDomain} from '../../../services/domainManagement/hooks';
import {
  createDomain,
  updateDomain,
} from '../../../services/domainManagement/domainService';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import DomainType from './constants';

interface DomainAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  domain: '',
  domain_type: '',
  institute_id: '',
  organization_id: '',
  industry_association_id: '',
  ministry_id: '',
  title_prefix_en: '',
  title_prefix: '',
};

const DomiansAddEditPopup: FC<DomainAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const [domainType, setDomainType] = useState<any>(null);
  const [instituteFilters] = useState<any>({
    service_types: [0],
  });
  const [organizationFilters] = useState<any>({});
  const [industryAssociationFilters] = useState<any>({});
  const [ministriesFilters] = useState<any>({});
  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilters);
  const {data: organization, isLoading: isLoadingOrganization} =
    useFetchLocalizedOrganizations(organizationFilters);
  const {data: industry_association, isLoading: isLoadingIndustryAssociation} =
    useFetchLocalizedIndustryAssociations(industryAssociationFilters);
  const {data: ministries, isLoading: isLoadingMinistries} =
    useFetchLocalizedMinistries(ministriesFilters);

  const isEdit = itemId != null;
  const {
    data: itemData,
    isLoading,
    mutate: mutateDomain,
  } = useFetchDomain(itemId);

  const onChangeDomainType = useCallback(
    (key: number) => {
      setDomainType(key);
    },
    [domainType],
  );
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      domain: yup
        .string()
        .trim()
        .required()
        .label(messages['common.domain'] as string),
      title_prefix_en: yup
        .string()
        .title('en', true)
        .label(messages['common.title'] as string),
      title_prefix: yup.string().title('bn', true),
    });
  }, [messages, domainType]);

  const {
    reset,
    handleSubmit,
    setError,
    control,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemId && itemData) {
      let domainValue = itemData?.organization_id
        ? DomainType.ORGANIZATION
        : itemData?.industry_association_id
        ? DomainType.INDUSTRY_ASSOCIATION
        : itemData?.ministry_id
        ? DomainType.MINISTRY
        : itemData?.institute_id
        ? DomainType.INSTITUTE
        : null;
      setDomainType(domainValue);
      reset({
        domain: itemData?.domain,
        domain_type: domainValue,
        title_prefix: itemData?.title_prefix,
        title_prefix_en: itemData?.title_prefix_en,
        institute_id: itemData?.institute_id,
        organization_id: itemData?.organization_id,
        industry_association_id: itemData?.industry_association_id,
        ministry_id: itemData?.ministry_id,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);
  // console.log('errors:', errors);
  const onSubmit: SubmitHandler<Domain> = async (data: Domain) => {
    try {
      if (data.domain_type === DomainType.INSTITUTE) {
        data.industry_association_id = null;
        data.organization_id = null;
        data.ministry_id = null;
      } else if (data.domain_type === DomainType.INDUSTRY_ASSOCIATION) {
        data.organization_id = null;
        data.institute_id = null;
        data.ministry_id = null;
      } else if (data.domain_type === DomainType.ORGANIZATION) {
        data.industry_association_id = null;
        data.institute_id = null;
        data.ministry_id = null;
      } else if (data.domain_type === DomainType.MINISTRY) {
        data.industry_association_id = null;
        data.institute_id = null;
        data.organization_id = null;
      }
      delete data.domain_type;

      if (itemId) {
        await updateDomain(itemId, data);
        updateSuccessMessage('common.domain');
        mutateDomain();
      } else {
        await createDomain(data);
        createSuccessMessage('common.domain');
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
      title={
        <>
          <IconDivision />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='common.domain' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='common.domain' />}}
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
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='domain'
            label={messages['common.domain']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='title_prefix'
            label={messages['common.title_prefix']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='title_prefix_en'
            label={messages['common.title_prefix_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <FormRadioButtons
            required
            id={'domain_type'}
            defaultValue={domainType}
            label={'common.domain'}
            radios={[
              {
                key: DomainType.INSTITUTE,
                label: messages['institute.label'],
              },
              {
                key: DomainType.ORGANIZATION,
                label: messages['organization.label'],
              },
              {
                key: DomainType.INDUSTRY_ASSOCIATION,
                label: messages['industry_association.label'],
              },
              {
                key: DomainType.MINISTRY,
                label: messages['ministry.label'],
              },
            ]}
            control={control}
            onChange={onChangeDomainType}
            errorInstance={errors}
          />
        </Grid>
        {domainType == DomainType.INSTITUTE && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                id='institute_id'
                label={messages['institute.label']}
                isLoading={isLoadingInstitutes}
                control={control}
                options={institutes || []}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
          </>
        )}
        {domainType == DomainType.ORGANIZATION && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                id='organization_id'
                label={messages['organization.label']}
                isLoading={isLoadingOrganization}
                control={control}
                options={organization || []}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
          </>
        )}
        {domainType == DomainType.INDUSTRY_ASSOCIATION && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                id='industry_association_id'
                label={messages['industry_association.label']}
                isLoading={isLoadingIndustryAssociation}
                control={control}
                options={industry_association || []}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
          </>
        )}{' '}
        {domainType == DomainType.MINISTRY && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                id='ministry_id'
                label={messages['ministry.label']}
                isLoading={isLoadingMinistries}
                control={control}
                options={ministries || []}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
          </>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default DomiansAddEditPopup;
