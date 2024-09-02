import {Button, ButtonGroup, Grid, Typography} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material';
import React, {Fragment, useEffect, useState} from 'react';
import {useFieldArray} from 'react-hook-form';
import UncontrolledTextInput from '../../../@core/elements/input/UncontrolledTextInput';

type IProps = {
  id: string;
  isLoading?: boolean;
  register: any;
  errors: any;
  control: any;
  setValue: any;
  getValues: any;
};

const CustomFieldArrayResultConfigGrading = ({
  id,
  isLoading,
  register,
  errors,
  control,
  setValue,
  getValues,
}: IProps) => {
  const [maxInputValue, setMaxInputValue] = useState<number>(1);

  const {fields, append, remove} = useFieldArray({
    control,
    name: id,
  });

  useEffect(() => {
    if (
      fields.length > 1 &&
      Number(getValues().gradings[fields.length - 2].max) <= 99
    ) {
      setValue(
        `${id}[${fields.length - 1}][min]`,
        Number(getValues().gradings[fields.length - 2].max) + 1,
      );
    }
  }, [fields, getValues]);

  const onMaxChange = (value: any, index: number) => {
    if (Number(value) == 100) {
      remove(fields.length);
      setMaxInputValue(1);
    }

    setMaxInputValue(Number(value));

    if (index < fields.length - 1 && Number(value) < 100)
      setValue(`${id}[${index + 1}][min]`, value ? Number(value) + 1 : value);
  };

  return (
    <>
      {fields.map((item: any, index: any) => {
        let labelId = `${id}.${index}.label`;
        let maxId = `${id}.${index}.max`;
        let minId = `${id}.${index}.min`;

        return (
          <Fragment key={item.id}>
            <Grid container spacing={2} style={{paddingBottom: 20}}>
              <Grid item xs={3}>
                <CustomTextInput
                  required
                  id={labelId}
                  label={''}
                  control={control}
                  isLoading={isLoading}
                  errorInstance={errors}
                />
              </Grid>
              <Grid item xs={3}>
                <UncontrolledTextInput
                  required
                  type={'number'}
                  id={minId}
                  label={''}
                  register={register}
                  isLoading={isLoading}
                  errorInstance={errors}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={3}>
                <UncontrolledTextInput
                  required
                  type={'number'}
                  id={maxId}
                  label={''}
                  register={register}
                  isLoading={isLoading}
                  errorInstance={errors}
                  onInput={(value: any) => {
                    onMaxChange(value, index);
                  }}
                />
              </Grid>
            </Grid>
          </Fragment>
        );
      })}

      <Grid container justifyContent='flex-end'>
        {errors?.['total_gradings'] && (
          <Grid item xs={12}>
            <Typography sx={{color: 'red'}}>
              {errors['total_gradings']?.message}
            </Typography>
          </Grid>
        )}
        <ButtonGroup color='primary' aria-label='outlined primary button group'>
          <Button
            onClick={() => {
              if (maxInputValue < 99) append({});

              if (fields.length <= 0) setValue(`${id}[0][min]`, '0');
            }}
            disabled={
              (getValues()?.gradings &&
                getValues()?.gradings[fields.length - 1]?.max &&
                Number(getValues()?.gradings[fields.length - 1]?.max) > 99) ||
              false
            }>
            <AddCircleOutline />
          </Button>
          <Button
            onClick={() => {
              if (fields.length > 1) {
                remove(fields.length - 1);
                setMaxInputValue(1);
              }
            }}
            disabled={fields.length < 2}>
            <RemoveCircleOutline />
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
};

export default CustomFieldArrayResultConfigGrading;
