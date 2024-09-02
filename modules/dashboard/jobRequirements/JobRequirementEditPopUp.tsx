import {Button, Grid} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import yup from '../../../@core/libs/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {
  useFetchHumanResourceDemand,
  useFetchIndustryMembers,
} from '../../../services/IndustryManagement/hooks';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {useFetchPublicInstitutes} from '../../../services/instituteManagement/hooks';
import {Box} from '@mui/system';
import IconHumanResourceDemand from '../../../@core/icons/HumanResourceDemand';
import {updateHumanResourceDemand} from '../../../services/IndustryManagement/HrDemandService';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import _ from 'lodash';
import {useFetchLocalizedSkills} from '../../../services/learnerManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';

interface JobRequirementEditPopupProps {
  itemId: number;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  organization_id: '',
  institute_ids: [],
  mandatory_skill_ids: [],
  optional_skill_ids: [],
};

const JobRequirementEditPopup: FC<JobRequirementEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const authUser = useAuthUser<CommonAuthUser>();
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const [hrDemandFields, setHrDemandFields] = useState<Array<number>>([1]);
  const isEdit = itemId != null;
  const {
    data: itemData,
    isLoading,
    mutate: mutateHumanResourceDemand,
  } = useFetchHumanResourceDemand(itemId);

  const [industryAssocMembersFilter, setIndustryAssocMembersFilter] =
    useState<any>(null);
  const {data: industryAssocMembers, isLoading: isLoadingIndustryAssocMembers} =
    useFetchIndustryMembers(industryAssocMembersFilter);

  const [industryAssociationFilter, setIndustryAssociationFilter] =
    useState<any>(null);
  const {data: industryAssociations, isLoading: isLoadingIndustryAssociation} =
    useFetchIndustryMembers(industryAssociationFilter);

  const [instituteFilter] = useState({});
  const {data: institutes, isLoading: isLoadingInstitute} =
    useFetchPublicInstitutes(instituteFilter);

  const [skillFilter] = useState({});
  const {data: skills, isLoading: isLoadingSkills} =
    useFetchLocalizedSkills(skillFilter);

  const onAddHrDemand = useCallback(() => {
    setHrDemandFields((prev: any) => {
      return [...prev, prev.length + 1];
    });
  }, []);

  const onRemoveHrDemand = useCallback(() => {
    let array = [...hrDemandFields];
    if (hrDemandFields.length > 1) {
      array.splice(hrDemandFields.length - 1, 1);
      setHrDemandFields(array);
    }
  }, []);

  const getFormattedArray = useCallback(
    (
      data: any,
      idFieldName: string = 'id',
      titleFieldName: string = 'title',
    ) => {
      if (!Array.isArray(data) || data.length <= 0) {
        return [];
      }

      let outputData: Array<any> = [];
      data.forEach((d: any) => {
        outputData.push({
          id: d[idFieldName],
          title: d[titleFieldName],
        });
      });

      return outputData;
    },
    [],
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      organization_id:
        authUser && authUser.isOrganizationUser
          ? yup.string().trim().nullable()
          : yup
              .string()
              .trim()
              .required()
              .label(messages['organization.label'] as string),
      industry_association_id:
        authUser &&
        (authUser.isIndustryAssociationUser || authUser.isOrganizationUser)
          ? yup.string().trim().nullable()
          : yup
              .string()
              .trim()
              .required(function () {
                return authUser && !authUser.isIndustryAssociationUser;
              })
              .label(messages['industry_association.label'] as string),

      institute_ids: yup
        .array()
        .of(yup.object())
        .nullable()
        .label(messages['common.institute'] as string),
      mandatory_skill_ids: yup
        .array()
        .of(yup.object())
        .min(1)
        .required()
        .label(messages['common.mandatory_skills'] as string),
      optional_skill_ids: yup
        .array()
        .of(yup.object())
        .nullable()
        .label(messages['common.optional_skills'] as string),
      vacancy: yup
        .string()
        .trim()
        .required()
        .label(messages['common.vacancy'] as string),
      requirement: yup
        .string()
        .trim()
        .required()
        .label(messages['common.requirements'] as string),
      end_date: yup
        .string()
        .nullable()
        .trim()
        .required()
        .label(messages['common.end_date'] as string),
      designation: yup
        .string()
        .required()
        .label(messages['common.designation'] as string),
    });
  }, [messages]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      let instituteIDs: Array<any> = getFormattedArray(
        itemData?.hr_demand_institutes,
        'institute_id',
        'institute_title',
      );

      const mandatorySkillIds: Array<any> = getFormattedArray(
        itemData?.mandatory_skills,
      );
      const optionalSkillIds: Array<any> = getFormattedArray(
        itemData?.optional_skills,
      );

      let data = {
        organization_id: itemData?.organization_id,
        industry_association_id: itemData?.industry_association_id,
        institute_ids: instituteIDs,
        mandatory_skill_ids: mandatorySkillIds,
        optional_skill_ids: optionalSkillIds,
        end_date: itemData?.end_date,
        vacancy: itemData?.vacancy,
        requirement: itemData?.requirement,
        requirement_en: itemData?.requirement_en,
        designation: itemData?.designation,
        designation_en: itemData?.designation_en,
      };

      if (itemData?.hr_demands) {
        let array = [];
        for (let i = 1; i < itemData?.hr_demands.length; i++) {
          array.push(i);
        }
        setHrDemandFields(array);
      }

      reset(data);
    } else {
      reset(initialValues);
    }
  }, [itemData, institutes]);

  useEffect(() => {
    if (authUser && !authUser?.isOrganizationUser) {
      setIndustryAssociationFilter({});
      setIndustryAssocMembersFilter({});
    }
  }, [authUser]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const formData = _.cloneDeep(data);

    formData.institute_ids =
      formData?.institute_ids?.length >= 1
        ? formData.institute_ids.map((skill: any) => skill.id)
        : null;

    formData.mandatory_skill_ids = formData.mandatory_skill_ids.map(
      (skill: any) => skill.id,
    );

    formData.optional_skill_ids =
      formData?.optional_skill_ids?.length >= 1
        ? formData.optional_skill_ids.map((skill: any) => skill.id)
        : null;

    try {
      if (itemId) {
        await updateHumanResourceDemand(itemId, formData);
        updateSuccessMessage('job_requirement.label');
        mutateHumanResourceDemand();
      }

      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({
        error,
        setError,
        validationSchema,
        errorStack,
      });
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconHumanResourceDemand />
          {isEdit && (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='job_requirement.label' />}}
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
          {authUser &&
            !authUser.isIndustryAssociationUser &&
            !authUser.isOrganizationUser && (
              <CustomFilterableFormSelect
                required
                id='industry_association_id'
                label={messages['common.industry_association']}
                isLoading={isLoadingIndustryAssociation}
                options={industryAssociations}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                control={control}
                errorInstance={errors}
              />
            )}
        </Grid>
        {authUser && !authUser.isOrganizationUser && (
          <Grid item xs={12}>
            <CustomFilterableFormSelect
              required
              id='organization_id'
              label={messages['organization.label']}
              isLoading={isLoadingIndustryAssocMembers}
              options={industryAssocMembers}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              control={control}
              errorInstance={errors}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <CustomSelectAutoComplete
            id={'institute_ids'}
            label={messages['common.institute']}
            isLoading={isLoadingInstitute}
            options={institutes}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomDatePicker
            required
            id={'end_date'}
            label={messages['common.end_date']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomSelectAutoComplete
            required
            id={'mandatory_skill_ids'}
            label={messages['common.mandatory_skills']}
            isLoading={isLoadingSkills}
            options={skills}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomSelectAutoComplete
            id={'optional_skill_ids'}
            label={messages['common.optional_skills']}
            isLoading={isLoadingSkills}
            options={skills}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id={'vacancy'}
            label={messages['common.vacancy']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id={'requirement'}
            label={messages['common.requirements']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id={'requirement_en'}
            label={messages['common.requirements_en']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id={'designation'}
            label={messages['common.designation']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id={'designation_en'}
            label={messages['common.designation_en']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        {!itemId && (
          <Grid item xs={12}>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <Button
                variant={'contained'}
                color={'primary'}
                sx={{marginRight: '10px'}}
                onClick={onAddHrDemand}>
                Add
              </Button>
              <Button
                variant={'contained'}
                color={'primary'}
                onClick={onRemoveHrDemand}>
                Remove
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default JobRequirementEditPopup;
