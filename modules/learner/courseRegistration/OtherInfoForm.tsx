import React, {FC, useCallback, useState} from 'react';
import {Box, Checkbox, FormControlLabel, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {FormKeyConfigType} from '../../../@core/utilities/CourseConfigKeys';
import {cloneDeep} from 'lodash';
import {styled} from '@mui/material/styles';

const PREFIX = 'OtherInfoForm';

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

interface OtherInfoFormProps {
  register: any;
  errors: any;
  control: any;
  changeFormConfig: (value: FormKeyConfigType) => void;
  formConfig: FormKeyConfigType;
  isOnlyVisibleField: boolean;
  stepKey: string;
}

const siblings = [
  {
    total: 0,
  },
  {
    total: 1,
  },
  {
    total: 2,
  },
  {
    total: 3,
  },
  {
    total: 4,
  },
  {
    total: 5,
  },
  {
    total: 6,
  },
  {
    total: 7,
  },
  {
    total: 8,
  },
  {
    total: 9,
  },
  {
    total: 10,
  },
];

const OtherInfoForm: FC<OtherInfoFormProps> = ({
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
        clonedData.miscellaneous_info.required = true;
      } else {
        clonedData.miscellaneous_info.required = false;
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
        {isOnlyVisibleField && !formConfig.miscellaneous_info.dataExist && (
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
          <FormRadioButtons
            required={formConfig.miscellaneous_info.required}
            id='miscellaneous_info[has_own_family_home]'
            label={'common.has_own_family_home'}
            radios={[
              {
                key: '1',
                label: messages['common.yes'],
              },
              {
                key: '0',
                label: messages['common.no'],
              },
            ]}
            control={control}
            defaultValue={'1'}
            isLoading={false}
            isDisabled={!formConfig.miscellaneous_info.required}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormRadioButtons
            required={formConfig.miscellaneous_info.required}
            id='miscellaneous_info[has_own_family_land]'
            label={'common.has_own_family_land'}
            radios={[
              {
                key: '1',
                label: messages['common.yes'],
              },
              {
                key: '0',
                label: messages['common.no'],
              },
            ]}
            control={control}
            defaultValue={'1'}
            isLoading={false}
            isDisabled={!formConfig.miscellaneous_info.required}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            id='miscellaneous_info[number_of_siblings]'
            label={messages['common.number_of_siblings']}
            isLoading={false}
            control={control}
            options={siblings}
            optionValueProp={'total'}
            optionTitleProp={['total']}
            errorInstance={errors}
            isDisabled={!formConfig.miscellaneous_info.required}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormRadioButtons
            required={formConfig.miscellaneous_info.required}
            id='miscellaneous_info[recommended_by_any_organization]'
            label={'common.recommended_by_any_organization'}
            radios={[
              {
                key: '1',
                label: messages['common.yes'],
              },
              {
                key: '0',
                label: messages['common.no'],
              },
            ]}
            control={control}
            defaultValue={'1'}
            isLoading={false}
            isDisabled={!formConfig.miscellaneous_info.required}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default OtherInfoForm;
