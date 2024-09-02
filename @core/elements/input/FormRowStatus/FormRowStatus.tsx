import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import React from 'react';
import {useIntl} from 'react-intl';
import {Controller} from 'react-hook-form';
import {rowStatusArray} from '../../../utilities/RowStatus';

interface IProps {
  id: string;
  isLoading: boolean;
  control: any;
  defaultValue: string | number | undefined;
  onChange?: (e: any) => any;
}

const FormRowStatus = ({
  id,
  isLoading,
  control,
  defaultValue,
  onChange: onChangeCallback,
}: IProps) => {
  const {messages} = useIntl();

  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>{messages['common.status']}</FormLabel>
      <Controller
        render={({
          field: {
            onChange,
            value = defaultValue ? defaultValue.toString() : undefined,
          },
        }) => (
          <RadioGroup
            row
            aria-label={id}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (onChangeCallback && typeof onChangeCallback === 'function') {
                onChangeCallback(e);
              }
            }}>
            {rowStatusArray().map((status) => (
              <FormControlLabel
                key={status.key}
                value={status.key}
                title={status?.label}
                control={<Radio />}
                label={status?.label}
              />
            ))}
          </RadioGroup>
        )}
        name={id}
        control={control}
      />
    </FormControl>
  );
};

export default FormRowStatus;
