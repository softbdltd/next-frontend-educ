import {yupResolver} from '@hookform/resolvers/yup';
import {Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import IconBatch from '../../../@core/icons/IconBatch';
import yup from '../../../@core/libs/yup';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {assignCertificateTemplatesInBatch} from '../../../services/instituteManagement/BatchService';
import {CERTIFICATE_TYPE} from '../certificate/Constants';
import CustomCertificateTemplateFieldArray from './CustomCertificateTemplateFieldArray';
import {ResultTypes} from '../../../@core/utilities/ResultTypes';
import {useFetchResultConfigs} from '../../../services/instituteManagement/hooks';

interface CertificateTemplatePopupProps {
  batch: any;
  onClose: () => void;
  refreshDataTable: () => void;
}

const CertificateTemplatePopup: FC<CertificateTemplatePopupProps> = ({
  batch,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {selectSuccessMessage} = useSuccessMessage();
  const {errorStack} = useNotiStack();
  const [defaultCertificateTypeIdTrack, setDefaultCertificateTypeIdTrack] =
    useState<any>({});
  const [certificateTypes, setCertificateTypes] = useState<Array<any>>([
    {
      id: CERTIFICATE_TYPE.PARTICIPATION,
      label: messages['certificate.participation'],
    },
  ]);

  const [resultConfigParams] = useState<any>({course_id: batch.course_id});
  const {data: courseResultConfig, isLoading: isResultConfigLoading} =
    useFetchResultConfigs(resultConfigParams);
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      templates: yup.array().of(
        yup.object().shape({
          certificate_type: yup
            .string()
            .trim()
            .required()
            .label(messages['certificate.certificate_type'] as string),
          certificate_template_id: yup
            .string()
            .trim()
            .required()
            .label(messages['common.certificate_template'] as string),
        }),
      ),
    });
  }, [messages]);

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const getExamSystemByResultType = (type: number) => {
    if (type === 1) {
      return messages['certificate.grading'];
    } else {
      return messages['certificate.marks'];
    }
  };

  useEffect(() => {
    let resultType = courseResultConfig?.result_type;
    if (resultType) {
      let types = [...certificateTypes];
      if (resultType == ResultTypes.GRADING) {
        types = types.concat([
          {
            id: CERTIFICATE_TYPE.GRADING,
            label: messages['certificate.grading'],
          },
        ]);
      } else if (resultType == ResultTypes.MARKING) {
        types = types.concat([
          {
            id: CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT,
            label: messages['certificate.competent_or_not'],
          },
          {
            id: CERTIFICATE_TYPE.MARKS,
            label: messages['certificate.marks'],
          },
        ]);
      }
      setCertificateTypes(types);
    }
  }, [courseResultConfig]);

  useEffect(() => {
    if (batch?.certificate_templates) {
      let certificateTypeIds: any = {};
      let templates: any = [];
      batch.certificate_templates.map((template: any, index: number) => {
        certificateTypeIds['type' + index] = template.certificate_type;
        templates.push({
          certificate_type: template.certificate_type,
          certificate_template_id: template.id,
        });
      });
      setDefaultCertificateTypeIdTrack(certificateTypeIds);
      reset({
        templates: templates,
      });
    }
  }, [batch]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    let ids = [];
    if (data?.templates && data?.templates.length > 0) {
      ids = data?.templates.map((e: any) =>
        parseInt(e.certificate_template_id),
      );
    }

    try {
      if (batch.id) {
        await assignCertificateTemplatesInBatch(batch.id, {
          certificate_template_ids: ids,
        });
      }
      selectSuccessMessage('common.certificate_template');
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconBatch />
          <IntlMessages id='common.certificate_template_setting_for_batch' />
        </>
      }
      handleSubmit={handleSubmit(onSubmit)}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12} md={12}>
          <Typography variant={'body2'}>
            {messages['course.label']} : {batch?.course_title}
          </Typography>
          {!isResultConfigLoading && (
            <Typography variant={'body2'}>
              {messages['course.result_type']} :{' '}
              {courseResultConfig
                ? getExamSystemByResultType(courseResultConfig.result_type)
                : messages['batch.result_failed_no_config']}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomCertificateTemplateFieldArray
            id='templates'
            control={control}
            errors={errors}
            certificateTypes={certificateTypes}
            defaultCertificateTypeIdTrack={defaultCertificateTypeIdTrack}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default CertificateTemplatePopup;
