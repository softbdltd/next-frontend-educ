import {Box, FormControl, FormHelperText, TextField} from '@mui/material';
import React from 'react';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {getErrorObject} from '../../../utilities/helpers';
import {Controller} from 'react-hook-form';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';

type Props = {
  id: string;
  label?: string | MessageFormatElement[];
  className?: string;
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  isLoading?: boolean;
  // register?: any;
  control?: any;
  errorInstance?: any;
  multiline?: boolean;
  disabled?: boolean;
  rows?: number;
  type?: string;
  defaultValue?: string;
  inputProps?: any;
  helperText?: any;
  [x: string]: any;
  onInput?: any;
  extraLabel?: string;
};

const PREFIX = 'CustomTextInput';

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

const CustomTextInput = ({
  id,
  label,
  className,
  variant,
  size,
  isLoading,
  // register,
  control,
  errorInstance,
  multiline,
  rows,
  type,
  defaultValue,
  inputProps,
  disabled,
  onInput: onChangeCallback,
  helperText,
  extraLabel = '',
  ...rest
}: Props) => {
  let errorObj = getErrorObject(id, errorInstance);
  const {messages} = useIntl();

  return isLoading ? (
    <TextInputSkeleton sx={{width: '100%'}} />
  ) : (
    <StyledBox>
      <FormControl fullWidth={true}>
        <Controller
          render={({field: {ref, onChange, value = defaultValue}}) => (
            <TextField
              fullWidth
              name={id}
              ref={ref}
              variant={variant ? variant : 'outlined'}
              size={size ? size : 'small'}
              className={className}
              label={
                <>
                  {label}
                  {extraLabel && (
                    <span className={classes.visuallyHidden}>
                      {' '}
                      {extraLabel}
                    </span>
                  )}
                  {rest?.required && (
                    <span className={classes.visuallyHidden}>
                      {messages['input.required_field']}
                    </span>
                  )}
                  {helperText && (
                    <span className={classes.visuallyHidden}>{helperText}</span>
                  )}
                </>
              }
              title={label as string}
              multiline={multiline}
              rows={rows}
              type={type}
              error={errorObj && Boolean(errorObj)}
              helperText={
                errorObj && errorObj.message ? (
                  errorObj.message.hasOwnProperty('key') ? (
                    <span tabIndex={0}>
                      <IntlMessages
                        id={errorObj.message.key}
                        values={errorObj.message?.values || {}}
                      />
                    </span>
                  ) : (
                    <span tabIndex={0}>{errorObj.message}</span>
                  )
                ) : (
                  ''
                )
              }
              onInput={(event: any) => {
                let value =
                  type == 'file' ? event.target.files : event.target.value;
                if (onChangeCallback) {
                  onChangeCallback(value);
                }
              }}
              onChange={(event: any) => {
                let value =
                  type == 'file' ? event.target.files : event.target.value;
                onChange(value);
              }}
              value={value ?? ''}
              disabled={disabled ? disabled : false}
              inputProps={{...inputProps, ...{required: false}}}
              {...rest}
            />
          )}
          name={id}
          control={control}
          defaultValue={defaultValue ?? ''}
        />
      </FormControl>

      {helperText && (
        <FormHelperText
          aria-label={helperText}
          role={'heading'}
          sx={{color: 'primary.main'}}>
          {helperText}
        </FormHelperText>
      )}
    </StyledBox>
  );
};

export default CustomTextInput;
