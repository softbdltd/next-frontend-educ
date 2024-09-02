import React, {FC, useCallback, useState} from 'react';
import Grid from '@mui/material/Grid';
import {Box, Checkbox, FormControlLabel, Typography} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {useIntl} from 'react-intl';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import {FormKeyConfigType} from '../../../@core/utilities/CourseConfigKeys';
import {cloneDeep} from 'lodash';
import {styled} from '@mui/material/styles';

const PREFIX = 'GuardiansInfoForm';

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

interface GuardiansInfoFormProps {
  register: any;
  control: any;
  errors: any;
  changeFormConfig: (value: FormKeyConfigType) => void;
  formConfig: FormKeyConfigType;
  isOnlyVisibleField: boolean;
  stepKey: string;
}

const GuardiansInfoForm: FC<GuardiansInfoFormProps> = ({
  register,
  errors,
  control,
  changeFormConfig,
  formConfig,
  isOnlyVisibleField,
  stepKey,
}) => {
  const {messages} = useIntl();
  const [checked, setChecked] = useState<boolean>(false);

  const onCheckboxValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(evt.target.checked ?? false);
      const clonedData = cloneDeep(formConfig);
      if (evt.target.checked) {
        clonedData.guardian_info.required = true;
      } else {
        clonedData.guardian_info.required = false;
        clonedData.guardian_info.localRequired = false;
      }
      changeFormConfig(clonedData);
    },
    [formConfig],
  );

  const [localGuardianChecked, setLocalGuardianChecked] =
    useState<boolean>(false);

  const onLocalGuardianCheckboxValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setLocalGuardianChecked(evt.target.checked ?? false);
      const clonedData = cloneDeep(formConfig);
      if (evt.target.checked) {
        clonedData.guardian_info.required = false;
        clonedData.guardian_info.localRequired = true;
      } else {
        clonedData.guardian_info.localRequired = false;
        clonedData.guardian_info.required = true;
      }
      changeFormConfig(clonedData);
    },
    [formConfig],
  );

  return (
    <StyledBox>
      <span id={stepKey} className={classes.visuallyHidden} tabIndex={0}>{`${
        messages['common.step']
      }${messages['common.' + stepKey]}`}</span>
      <Grid container spacing={2}>
        {isOnlyVisibleField && !formConfig.guardian_info.dataExist && (
          <Grid xs={12} sx={{paddingLeft: '10px'}}>
            <FormControlLabel
              sx={{
                marginLeft: '0',
              }}
              tabIndex={0}
              control={
                <Checkbox
                  color='primary'
                  checked={checked}
                  onChange={onCheckboxValueChange}
                  style={{padding: '2px', marginRight: 5}}
                />
              }
              label={
                messages['course_registration.eduction_label_text'] as string
              }
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['common.father_information']}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.guardian_info.required ||
              formConfig.guardian_info.dataExist
            }
            id='guardian_info[father_name]'
            label={messages['common.name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[father_name_en]'
            label={messages['common.name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[father_mobile]'
            label={messages['common.mobile_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomDatePicker
            id='guardian_info[father_date_of_birth]'
            label={messages['common.date_of_birth']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            isDisabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[father_nid]'
            label={messages['common.nid']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['common.mother_information']}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.guardian_info.required ||
              formConfig.guardian_info.dataExist
            }
            id='guardian_info[mother_name]'
            label={messages['common.name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[mother_name_en]'
            label={messages['common.name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[mother_mobile]'
            label={messages['common.mobile_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomDatePicker
            id='guardian_info[mother_date_of_birth]'
            label={messages['common.date_of_birth']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            isDisabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[mother_nid]'
            label={messages['common.nid']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.required ||
                formConfig.guardian_info.dataExist
              )
            }
          />
        </Grid>

        {(!isOnlyVisibleField || checked) && (
          <Grid xs={12} sx={{paddingLeft: '10px', marginTop: '25px'}}>
            <FormControlLabel
              sx={{
                marginLeft: '0',
              }}
              tabIndex={0}
              control={
                <Checkbox
                  color='primary'
                  checked={localGuardianChecked}
                  onChange={onLocalGuardianCheckboxValueChange}
                  style={{padding: '2px', marginRight: 5}}
                />
              }
              label={
                messages[
                  'course_registration.local_guardian_checkbox'
                ] as string
              }
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['common.local_guardian_information']}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[local_guardian_name]'
            label={messages['common.name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[local_guardian_name_en]'
            label={messages['common.name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[local_guardian_mobile]'
            label={messages['common.mobile_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomDatePicker
            id='guardian_info[local_guardian_date_of_birth]'
            label={messages['common.date_of_birth']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            isDisabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[local_guardian_nid]'
            label={messages['common.nid']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[local_guardian_relationship_title]'
            label={messages['guardian.relationship_title']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='guardian_info[local_guardian_relationship_title_en]'
            label={messages['guardian.relationship_title_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.guardian_info.localRequired ||
                formConfig.guardian_info.localDataExist
              )
            }
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default GuardiansInfoForm;
