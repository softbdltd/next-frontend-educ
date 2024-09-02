import {Checkbox, FormHelperText, FormLabel, Grid} from '@mui/material';
import CustomTextInput from './CustomTextInput';
import React from 'react';
import {MessageFormatElement, useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';
import {getErrorObject} from '../../../utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';

interface Props {
  id: string;
  data: Array<any>;
  label: string | MessageFormatElement[];
  onChange?: (checked: boolean, value: string, index: number) => any;
  checkedDataArray: Array<any>;
  control: any;
  errors: any;
  isLoading: any;
  isTextFieldExist?: boolean;
  textFieldPlaceholder?: string | MessageFormatElement[];
  required?: boolean;
}

const PREFIX = 'CustomCheckboxTextInput';

const classes = {
  inlineBlock: `${PREFIX}-inlineBlock`,
  block: `${PREFIX}-block`,
};
const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.inlineBlock}`]: {
    display: 'inline-block',
  },
  [`& .${classes.block}`]: {
    display: 'block',
  },
}));

const CustomCheckboxTextInput = ({
  id,
  data,
  label,
  onChange: onChangeCallback,
  checkedDataArray,
  control,
  isLoading,
  errors,
  isTextFieldExist = true,
  textFieldPlaceholder,
  required = false,
}: Props) => {
  const {messages} = useIntl();
  const OTHER_FIELD_NAME = 'other_authority';

  let errorObj = getErrorObject(id, errors);
  let helperText =
    errorObj && errorObj.message ? (
      errorObj.message.hasOwnProperty('key') ? (
        <IntlMessages
          id={errorObj.message.key}
          key={errorObj.message.key}
          values={errorObj.message?.values || {}}
        />
      ) : (
        errorObj.message
      )
    ) : (
      ''
    );

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <FormLabel
            error={typeof errorObj != 'undefined' ?? false}
            required={required}>
            {label}
          </FormLabel>

          {errorObj && (
            <FormHelperText error={true} id={id}>
              {helperText}
            </FormHelperText>
          )}
        </Grid>
      </Grid>

      <StyledGrid container spacing={1}>
        {data.map((data: any, index: number) => {
          return (
            <React.Fragment key={data.id}>
              <Grid item xs={6}>
                <label className={isTextFieldExist ? classes.inlineBlock : ''}>
                  <Checkbox
                    onChange={(event) => {
                      if (
                        onChangeCallback &&
                        typeof onChangeCallback == 'function'
                      ) {
                        onChangeCallback(
                          event.target.checked,
                          String(data.id),
                          index,
                        );
                      }
                    }}
                    checked={checkedDataArray?.includes(String(data.id))}
                  />
                  {data.title}
                </label>
                <CustomTextInput
                  id={id + '[' + index + '][id]'}
                  control={control}
                  errorInstance={errors}
                  sx={{opacity: '0', display: 'none'}}
                  defaultValue={data.id}
                />
              </Grid>
              <Grid item xs={6}>
                {data.id != OTHER_FIELD_NAME && isTextFieldExist && (
                  <CustomTextInput
                    disabled={!checkedDataArray.includes(String(data.id))}
                    id={id + '[' + index + '][value]'}
                    control={control}
                    errorInstance={errors}
                    isLoading={isLoading}
                    placeholder={textFieldPlaceholder}
                  />
                )}
                {data.id == OTHER_FIELD_NAME && (
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <CustomTextInput
                        disabled={!checkedDataArray.includes(String(data.id))}
                        id={id + '[' + index + '][name]'}
                        control={control}
                        errorInstance={errors}
                        isLoading={isLoading}
                        placeholder={messages['common.name']}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomTextInput
                        disabled={!checkedDataArray.includes(String(data.id))}
                        id={id + '[' + index + '][value]'}
                        control={control}
                        errorInstance={errors}
                        isLoading={isLoading}
                        placeholder={textFieldPlaceholder}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </React.Fragment>
          );
        })}
      </StyledGrid>
    </>
  );
};

export default CustomCheckboxTextInput;
