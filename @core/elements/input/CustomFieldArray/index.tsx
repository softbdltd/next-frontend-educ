import React from 'react';
import TextInputSkeleton from '../../display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {Button, ButtonGroup, Grid, TextField} from '@mui/material';
import {useFieldArray} from 'react-hook-form';
import {useIntl} from 'react-intl';
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material';
import IntlMessages from '../../../../@core/utility/IntlMessages';

type Props = {
  id: string;
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  labelLanguageId?: string;
  isLoading?: boolean;
  register?: any;
  errors?: any;
  control?: any;
};

const CustomFieldArray = ({
  id,
  variant,
  size,
  labelLanguageId,
  isLoading,
  register,
  errors,
  control,
}: Props) => {
  const {messages} = useIntl();
  const {fields, append, remove} = useFieldArray({
    control,
    name: id,
  });
  return isLoading ? (
    <TextInputSkeleton />
  ) : (
    <>
      {fields.map((item: any, index: any) => {
        let itemId = `${id}.${index}.value`;
        return (
          <Grid item xs={12} style={{paddingBottom: 20}} key={index}>
            <TextField
              fullWidth
              variant={variant ? variant : 'outlined'}
              size={size ? size : 'small'}
              id={itemId}
              name={id}
              label={
                (labelLanguageId ? messages[labelLanguageId] : '') +
                ' #' +
                (index + 1)
              }
              error={errors[id]?.[index] && Boolean(errors[id]?.[index])}
              helperText={
                errors[id]?.[index] && errors[id]?.[index]?.value?.message ? (
                  errors[id]?.[index].value.message.hasOwnProperty('key') ? (
                    <IntlMessages
                      id={errors[id]?.[index].value.message.key}
                      values={errors[id]?.[index].value.message?.values || {}}
                    />
                  ) : (
                    errors[id]?.[index].value.message
                  )
                ) : (
                  ''
                )
              }
              {...register(itemId)}
            />
          </Grid>
        );
      })}
      <Grid container justifyContent='flex-end'>
        <ButtonGroup color='primary' aria-label='outlined primary button group'>
          <Button
            sx={{ alignSelf: "center"}}
            onClick={() => {
              append({});
            }}>
            <AddCircleOutline />
          </Button>
          <Button
            sx={{ alignSelf: "center"}}
            onClick={() => {
              if (fields.length > 1) remove(fields.length - 1);
            }}
            disabled={fields.length < 2}>
            <RemoveCircleOutline />
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
};

export default CustomFieldArray;
