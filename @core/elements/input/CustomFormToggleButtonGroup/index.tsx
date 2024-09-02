import React from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {Controller} from 'react-hook-form';
import {styled} from '@mui/material/styles';
import {Check} from '@mui/icons-material';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import IntlMessages from '../../../../@core/utility/IntlMessages';

const PREFIX = 'ToggleButtonGroup';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  spacing: `${PREFIX}-spacing`,
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  marginTop: '10px',
  '& .MuiToggleButtonGroup-grouped': {
    borderRadius: '4px !important',
    border: '1px solid #e9e9e9 !important',
    padding: '8px 10px 5px 10px',
  },
  [`&.${classes.spacing} .MuiToggleButtonGroup-grouped:not(:first-of-type)`]: {
    marginLeft: '15px !important',
  },
  '& .MuiToggleButtonGroup-grouped.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,

    [`& .${classes.buttonIcon}`]: {
      display: 'block',
    },
  },
  '& .MuiToggleButtonGroup-grouped.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '& .MuiToggleButtonGroup-grouped:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`& .${classes.buttonIcon}`]: {
    display: 'none',
  },
}));

interface Props {
  id: string;
  label?: string | MessageFormatElement[];
  buttons: Array<any>;
  isLoading?: boolean;
  required?: boolean;
  multiSelect?: boolean;
  control: any;
  defaultValue?: any;
  errorInstance?: any;
  onChange?: (e: any) => any;
  space?: boolean;
}

const CustomFormToggleButtonGroup = ({
  id,
  label,
  buttons,
  isLoading,
  errorInstance,
  required = false,
  multiSelect = false,
  control,
  defaultValue = '',
  onChange: onChangeCallback,
  space = true,
}: Props) => {
  let errorObj = errorInstance?.[id];
  const reg = new RegExp('(.*)\\[(.*?)]', '');
  const matches = id.match(reg);
  if (matches) {
    errorObj = errorInstance?.[matches[1]]?.[matches[2]];
  }

  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <FormControl component='fieldset'>
      {label && label != '' && (
        <FormLabel component='legend' required={required}>
          {label}
        </FormLabel>
      )}
      <Controller
        render={({field: {onChange, value = defaultValue}}) => (
          <StyledToggleButtonGroup
            value={value}
            exclusive={!multiSelect}
            onChange={(
              event: React.MouseEvent<HTMLElement>,
              newValues: any,
            ) => {
              onChange(newValues);
              if (onChangeCallback && typeof onChangeCallback === 'function') {
                onChangeCallback(newValues);
              }
            }}
            className={space ? classes.spacing : ''}>
            {buttons.map((button) => (
              <ToggleButton value={button.value} key={button.value}>
                <Check
                  className={classes.buttonIcon}
                  sx={{marginRight: '5px'}}
                />
                {button.label}
              </ToggleButton>
            ))}
          </StyledToggleButtonGroup>
        )}
        name={id}
        control={control}
        defaultValue={defaultValue}
      />
      <FormHelperText sx={{color: 'error.main'}}>
        {errorObj && errorObj.message ? (
          errorObj.message.hasOwnProperty('key') ? (
            <IntlMessages
              id={errorObj.message.key}
              values={errorObj.message?.values || {}}
            />
          ) : (
            errorObj.message
          )
        ) : (
          ''
        )}
      </FormHelperText>
    </FormControl>
  );
};

export default CustomFormToggleButtonGroup;
