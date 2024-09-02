import {Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import {styled} from '@mui/material/styles';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CourseConfigKeys from '../../../@core/utilities/CourseConfigKeys';
import FreedomFighterStatus from '../../../@core/utilities/FreedomFighterStatus';
import Genders from '../../../@core/utilities/Genders';
import MaritalStatus from '../../../@core/utilities/MaritalStatus';
import {nationalities} from '../../../@core/utilities/Nationalities';
import PhysicalDisabilities from '../../../@core/utilities/PhysicalDisabilities';
import PhysicalDisabilityStatus from '../../../@core/utilities/PhysicalDisabilityStatus';
import Religions from '../../../@core/utilities/Religions';
import {useFetchTrainingCentersWithBatchesV2} from '../../../services/instituteManagement/hooks';
import FileUploadComponent from '../../filepond/FileUploadComponent';

const PREFIX = 'PersonalInfoForm';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));

interface PersonalInfoFormProps {
  register: any;
  errors: any;
  control: any;
  getValues: any;
  setValue: any;
  courseOrApprenticeshipId: any;
  isApprenticeship: boolean;
  isTrainingCenterRequired: boolean;
  stepKey: string;
  visibleFieldKeys: Array<string>;
}

const PersonalInfoForm: FC<PersonalInfoFormProps> = ({
  register,
  errors,
  control,
  getValues,
  setValue,
  courseOrApprenticeshipId,
  isApprenticeship,
  isTrainingCenterRequired,
  visibleFieldKeys,
  stepKey,
}) => {
  const {messages} = useIntl();

  const [disabilityStatus, setDisabilityStatus] = useState<number>(
    PhysicalDisabilityStatus.NO,
  );
  const [isBelongToEthnicGroup, setIsBelongToEthnicGroup] =
    useState<boolean>(false);
  const [defaultPassportImagePath, setDefaultPassportImagePath] = useState<
    string | null
  >(null);
  const [defaultSignatureImagePath, setDefaultSignatureImagePath] = useState<
    string | null
  >(null);
  const [batches, setBatches] = useState<Array<any>>([]);
  const authUser = useAuthUser();

  const [trainingCenterFilters] = useState<any>({
    active: 'true',
    learner_id: authUser?.learnerId,
  });
  const {
    data: trainingCentersWithBatches,
    isLoading: isTrainingCentersWithBatchesLoading,
  } = useFetchTrainingCentersWithBatchesV2(
    !isApprenticeship ? courseOrApprenticeshipId : null,
    trainingCenterFilters,
  );

  useEffect(() => {
    if (getValues) {
      const doesBelongsToEthnicGroup: any = getValues(
        'does_belong_to_ethnic_group',
      );
      const physicalDisabilityStatus: any = getValues(
        'physical_disability_status',
      );

      setIsBelongToEthnicGroup(doesBelongsToEthnicGroup);

      setDisabilityStatus(physicalDisabilityStatus);

      const passportPath = getValues('passport_photo_path');
      if (passportPath) setDefaultPassportImagePath(passportPath);
      else setDefaultPassportImagePath(null);

      const signaturePath = getValues('signature_image_path');
      if (signaturePath) setDefaultSignatureImagePath(signaturePath);
      else setDefaultSignatureImagePath(null);
    }
  }, [getValues]);

  const physicalDisabilities = useMemo(
    () => [
      {
        id: PhysicalDisabilities.VISUAL,
        label: messages['physical_disability.visual'],
      },
      {
        id: PhysicalDisabilities.HEARING,
        label: messages['physical_disability.hearing'],
      },
      {
        id: PhysicalDisabilities.MENTAL_HEALTH,
        label: messages['physical_disability.mental_health'],
      },
      {
        id: PhysicalDisabilities.INTELLECTUAL,
        label: messages['physical_disability.intellectual'],
      },
      {
        id: PhysicalDisabilities.PHYSICAL,
        label: messages['physical_disability.physical_disability'],
      },
      {
        id: PhysicalDisabilities.SPEECH,
        label: messages['physical_disability.speech'],
      },
      {
        id: PhysicalDisabilities.DEAF_BLINDNESS,
        label: messages['physical_disability.deaf_blindness'],
      },
      {
        id: PhysicalDisabilities.CEREBAL_PALSY,
        label: messages['physical_disability.cerebral_palsy'],
      },
      {
        id: PhysicalDisabilities.DOWN_SYNDROME,
        label: messages['physical_disability.down_syndrome'],
      },
      {
        id: PhysicalDisabilities.AUTISM_OR_AUTISM_SPECTRUM,
        label:
          messages['physical_disability.autism_or_autism_spectrum_disorder'],
      },
      {
        id: PhysicalDisabilities.MULTIPLE,
        label: messages['physical_disability.multiple'],
      },
      {
        id: PhysicalDisabilities.OTHER,
        label: messages['physical_disability.other'],
      },
    ],
    [messages],
  );

  const maritalStatus = useMemo(
    () => [
      {
        id: MaritalStatus.SINGLE,
        label: messages['common.marital_status_single'],
      },
      {
        id: MaritalStatus.MARRIED,
        label: messages['common.marital_status_married'],
      },
      {
        id: MaritalStatus.WIDOWED,
        label: messages['common.marital_status_widowed'],
      },
      {
        id: MaritalStatus.DIVORCED,
        label: messages['common.marital_status_divorced'],
      },
    ],
    [messages],
  );

  const freedomFighterStatus = useMemo(
    () => [
      {
        id: FreedomFighterStatus.NO,
        label: messages['common.no'],
      },
      {
        id: FreedomFighterStatus.YES,
        label: messages['common.yes'],
      },
      {
        id: FreedomFighterStatus.CHILD,
        label: messages['freedom_fighter_status.child'],
      },
      {
        id: FreedomFighterStatus.GRAND_CHILD,
        label: messages['freedom_fighter_status.grand_child'],
      },
    ],
    [messages],
  );

  const religions = useMemo(
    () => [
      {
        id: Religions.ISLAM,
        label: messages['common.religion_islam'],
      },
      {
        id: Religions.HINDUISM,
        label: messages['common.religion_hinduism'],
      },
      {
        id: Religions.CHRISTIANITY,
        label: messages['common.religion_christianity'],
      },
      {
        id: Religions.BUDDHISM,
        label: messages['common.religion_buddhism'],
      },
      {
        id: Religions.JUDAISM,
        label: messages['common.religion_judaism'],
      },
      {
        id: Religions.SIKHISM,
        label: messages['common.religion_sikhism'],
      },
      {
        id: Religions.ETHNIC,
        label: messages['common.religion_ethnic'],
      },
      {
        id: Religions.ATHEIST,
        label: messages['common.religion_atheist'],
      },
    ],
    [messages],
  );

  const onTrainingCenterChange = useCallback(
    (trainingCenterId: number) => {
      if (trainingCenterId) {
        const trainingCenter = (trainingCentersWithBatches || [])?.filter(
          (item: any) => item.id == trainingCenterId,
        );
        setBatches(trainingCenter[0]?.batches);
      } else {
        setBatches([]);
      }
    },
    [trainingCentersWithBatches],
  );

  const onDisabilityStatusChange = useCallback((value: number) => {
    setDisabilityStatus(value);
  }, []);

  return (
    <StyledBox>
      <span id={stepKey} className={classes.visuallyHidden} tabIndex={0}>{`${
        messages['common.step']
      }${messages['common.' + stepKey]}`}</span>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='first_name'
            label={messages['common.first_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='first_name_en'
            label={messages['common.first_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='last_name'
            label={messages['common.last_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='last_name_en'
            label={messages['common.last_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='mobile'
            label={messages['common.mobile_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            inputProps={{
              disabled: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='email'
            label={messages['common.email']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            inputProps={{
              disabled: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomDatePicker
            required
            id='date_of_birth'
            label={messages['common.date_of_birth']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            required
            id='marital_status'
            label={messages['common.marital_status']}
            isLoading={false}
            control={control}
            options={maritalStatus}
            optionValueProp={'id'}
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            required
            id='religion'
            label={messages['common.religion']}
            isLoading={false}
            control={control}
            options={religions}
            optionValueProp={'id'}
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            required
            id='nationality'
            label={messages['common.nationality']}
            isLoading={false}
            control={control}
            options={nationalities}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>

        {!isApprenticeship &&
          (isTrainingCenterRequired ? (
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
                required={isTrainingCenterRequired}
                id='training_center_id'
                label={
                  messages[
                    isTrainingCenterRequired
                      ? 'common.training_center'
                      : 'common.preferred_training_center'
                  ]
                }
                isLoading={isTrainingCentersWithBatchesLoading}
                control={control}
                options={trainingCentersWithBatches}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={onTrainingCenterChange}
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
                required
                id='preferred_training_center_id'
                label={messages['common.preferred_training_center']}
                isLoading={isTrainingCentersWithBatchesLoading}
                control={control}
                options={trainingCentersWithBatches}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={onTrainingCenterChange}
              />
            </Grid>
          ))}

        {!isApprenticeship && (
          <Grid item xs={6}>
            <CustomFilterableFormSelect
              required
              id='preferred_batch_id'
              label={messages['common.preferred_batch']}
              isLoading={isTrainingCentersWithBatchesLoading}
              control={control}
              options={batches}
              optionTitleProp={['title']}
              optionValueProp={'id'}
              errorInstance={errors}
            />
          </Grid>
        )}

        {visibleFieldKeys &&
          visibleFieldKeys.includes(CourseConfigKeys.FREEDOM_FIGHTER_KEY) && (
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
                required
                id='freedom_fighter_status'
                label={messages['common.freedom_fighter_status']}
                isLoading={false}
                control={control}
                options={freedomFighterStatus}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>
          )}

        {visibleFieldKeys &&
          visibleFieldKeys.includes(CourseConfigKeys.DISABILITY_KEY) && (
            <React.Fragment>
              <Grid item xs={12} md={6}>
                <FormRadioButtons
                  id='physical_disability_status'
                  label={'common.physical_disabilities_status'}
                  radios={[
                    {
                      key: PhysicalDisabilityStatus.YES,
                      label: messages['common.yes'],
                    },
                    {
                      key: PhysicalDisabilityStatus.NO,
                      label: messages['common.no'],
                    },
                  ]}
                  control={control}
                  defaultValue={'0'}
                  isLoading={false}
                  onChange={onDisabilityStatusChange}
                />
              </Grid>

              {disabilityStatus == PhysicalDisabilityStatus.YES && (
                <Grid item xs={12} md={6}>
                  <CustomFormSelect
                    required
                    id='physical_disabilities'
                    label={messages['common.physical_disability']}
                    isLoading={false}
                    control={control}
                    options={physicalDisabilities}
                    optionValueProp={'id'}
                    optionTitleProp={['label']}
                    errorInstance={errors}
                    multiple={true}
                    defaultValue={[]}
                  />
                </Grid>
              )}
            </React.Fragment>
          )}

        <Grid item xs={12} md={6}>
          <FormRadioButtons
            id='gender'
            label={'common.gender'}
            radios={[
              {
                key: Genders.MALE,
                label: messages['common.male'],
              },
              {
                key: Genders.FEMALE,
                label: messages['common.female'],
              },
              {
                key: Genders.OTHERS,
                label: messages['common.others'],
              },
            ]}
            control={control}
            defaultValue={Genders.MALE}
            isLoading={false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FileUploadComponent
            id='passport_photo_path'
            defaultFileUrl={defaultPassportImagePath}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.passport_size_photo']}
            required={false}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FileUploadComponent
            id='signature_image_path'
            defaultFileUrl={defaultSignatureImagePath}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.signature']}
            required={false}
          />
        </Grid>

        {visibleFieldKeys &&
          visibleFieldKeys.includes(CourseConfigKeys.ETHNIC_GROUP_KEY) && (
            <Grid item xs={12}>
              <CustomCheckbox
                id='does_belong_to_ethnic_group'
                label={messages['learner_registration.ethnic_group']}
                register={register}
                errorInstance={errors}
                checked={isBelongToEthnicGroup}
                onChange={() => {
                  setIsBelongToEthnicGroup((prev) => !prev);
                }}
                isLoading={false}
              />
            </Grid>
          )}
      </Grid>
    </StyledBox>
  );
};

export default PersonalInfoForm;
