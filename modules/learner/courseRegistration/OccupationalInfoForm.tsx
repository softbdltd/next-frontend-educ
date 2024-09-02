import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Checkbox, FormControlLabel, Grid} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {useIntl} from 'react-intl';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {FormKeyConfigType} from '../../../@core/utilities/CourseConfigKeys';
import {cloneDeep} from 'lodash';
import {styled} from '@mui/material/styles';

const PREFIX = 'OccupationalInfo';

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

interface OccupationalInfoFormProps {
  register: any;
  control: any;
  errors: any;
  getValues: any;
  changeFormConfig: (value: FormKeyConfigType) => void;
  formConfig: FormKeyConfigType;
  isOnlyVisibleField: boolean;
  stepKey: string;
}

const OccupationalInfoForm: FC<OccupationalInfoFormProps> = ({
  register,
  control,
  errors,
  getValues,
  changeFormConfig,
  formConfig,
  isOnlyVisibleField,
  stepKey,
}) => {
  const {messages} = useIntl();
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] =
    useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (getValues) {
      const professionalInfo: any = getValues('professional_info');
      const isCurrentlyEmployed: any = professionalInfo.is_currently_employed;

      setIsCurrentlyEmployed(isCurrentlyEmployed);
    }
  }, [getValues]);

  const onCheckboxValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(evt.target.checked ?? false);
      const clonedData = cloneDeep(formConfig);
      if (evt.target.checked) {
        clonedData.occupation_info.required = true;
      } else {
        clonedData.occupation_info.required = false;
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
        {isOnlyVisibleField && !formConfig.occupation_info.dataExist && (
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
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.occupation_info.required ||
              formConfig.occupation_info.dataExist
            }
            id='professional_info[main_profession]'
            label={messages['common.main_occupation']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.occupation_info.required ||
                formConfig.occupation_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='professional_info[others_occupation]'
            label={messages['common.others_occupation']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.occupation_info.required ||
                formConfig.occupation_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.occupation_info.required ||
              formConfig.occupation_info.dataExist
            }
            id='professional_info[monthly_income]'
            type={'number'}
            label={messages['common.monthly_income']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.occupation_info.required ||
                formConfig.occupation_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.occupation_info.required ||
              formConfig.occupation_info.dataExist
            }
            id='professional_info[years_of_experiences]'
            type={'number'}
            label={messages['common.year_of_experience']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.occupation_info.required ||
                formConfig.occupation_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <CustomCheckbox
            id='professional_info[is_currently_employed]'
            label={messages['common.currently_working']}
            register={register}
            errorInstance={errors}
            checked={isCurrentlyEmployed}
            onChange={() => {
              setIsCurrentlyEmployed((prev) => !prev);
            }}
            isLoading={false}
            isDisabled={
              !(
                formConfig.occupation_info.required ||
                formConfig.occupation_info.dataExist
              )
            }
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default OccupationalInfoForm;
