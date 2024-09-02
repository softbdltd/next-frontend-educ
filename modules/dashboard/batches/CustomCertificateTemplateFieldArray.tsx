import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material';
import {Button, ButtonGroup, Grid} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useFieldArray} from 'react-hook-form';
import {useIntl} from 'react-intl';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {useFetchCertificateTemplates} from '../../../services/instituteManagement/hooks';

type Props = {
  id: string;
  batchId?: string | number | null;
  errors: any;
  control: any;
  defaultCertificateTypeIdTrack: any;
  certificateTypes: any[];
};

const CustomCertificateTemplateFieldArray = ({
  id,
  batchId,
  errors,
  control,
  defaultCertificateTypeIdTrack,
  certificateTypes,
}: Props) => {
  const {messages} = useIntl();
  const [templatesParams, setTemplatesParams] = useState<any>(null);
  const {data: certificateTemplates, isLoading} =
    useFetchCertificateTemplates(templatesParams);

  useEffect(() => {
    if (batchId) {
      setTemplatesParams({batch_id: batchId});
    } else {
      setTemplatesParams({});
    }
  }, [batchId]);

  const [certificateTypeIdTrack, setCertificateTypeIdTrack] = useState<any>({});
  const {fields, append, remove} = useFieldArray({
    control,
    name: id,
  });

  const [selected, setSelected] = useState<any>([]);

  useEffect(() => {
    if (defaultCertificateTypeIdTrack) {
      setSelected(
        Object.values(defaultCertificateTypeIdTrack).filter(
          (item: any) => item && !isNaN(item),
        ),
      );
      setCertificateTypeIdTrack(defaultCertificateTypeIdTrack);
    }
  }, [defaultCertificateTypeIdTrack]);

  useEffect(() => {
    if (fields.length == 0) {
      append({});
    }
  }, [fields]);

  const getCertTemplates = (index: number) => {
    const typeId = certificateTypeIdTrack['type' + index];
    if (certificateTemplates && certificateTemplates.length > 0 && typeId) {
      return certificateTemplates.filter(
        (templates: any) => templates.certificate_type == typeId,
      );
    } else {
      return [];
    }
  };

  return (
    <>
      {fields?.map((item: any, index: any) => {
        let certificateTypesId = `${id}.${index}.certificate_type`;
        let certificateTemplateId = `${id}.${index}.certificate_template_id`;
        return (
          <React.Fragment key={item.id}>
            <Grid container spacing={5} style={{marginBottom: 20}}>
              <Grid item xs={12} sm={6} md={6}>
                <CustomFilterableFormSelect
                  required={true}
                  label={messages['certificate.type']}
                  id={certificateTypesId}
                  control={control}
                  optionValueProp={'id'}
                  optionTitleProp={['label']}
                  options={certificateTypes}
                  isLoading={isLoading}
                  errorInstance={errors}
                  getOptionDisabled={(option) => {
                    return selected.includes(option.id);
                  }}
                  onChange={(certificateType: number) => {
                    let certTracks: any = {...certificateTypeIdTrack};
                    certTracks['type' + index] = certificateType;
                    setCertificateTypeIdTrack(certTracks);
                    let selectedTypes = Object.values(certTracks).filter(
                      (item: any) => item && !isNaN(item),
                    );
                    setSelected(selectedTypes);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomFilterableFormSelect
                  required={true}
                  label={messages['common.certificate_template']}
                  id={certificateTemplateId}
                  control={control}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  options={getCertTemplates(index)}
                  isLoading={isLoading}
                  errorInstance={errors}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        );
      })}
      <Grid container justifyContent='flex-end'>
        <ButtonGroup color='primary' aria-label='outlined primary button group'>
          <Button
            onClick={() => {
              append({});
            }}>
            <AddCircleOutline />
          </Button>
          <Button
            onClick={() => {
              if (fields.length > 0) remove(fields.length - 1);
            }}
            disabled={fields.length < 2}>
            <RemoveCircleOutline />
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
};

export default CustomCertificateTemplateFieldArray;
