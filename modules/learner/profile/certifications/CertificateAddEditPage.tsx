import {yupResolver} from '@hookform/resolvers/yup';
import {Box, Grid, Zoom} from '@mui/material';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomCheckbox from '../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomDatePicker from '../../../../@core/elements/input/CustomDatePicker';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';

import yup from '../../../../@core/libs/yup';
import {getAllKeysFromErrorObj, getMomentDateFormat,} from '../../../../@core/utilities/helpers';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import {createCertificate, updateCertificate,} from '../../../../services/learnerManagement/CertificateService';
import {useFetchYouthCertificate} from '../../../../services/learnerManagement/hooks';
import {YouthCertificate} from '../../../../services/learnerManagement/typing';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import CustomHookForm from '../component/CustomHookForm';
import EDUCCertificateForm from './EducCertificateForm';
import {DistrictOrCityCorporation} from '../../../../@core/components/AddressFormComponent/addressEnum';

interface CertificateAddEditPageProps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues = {
  certification_name: '',
  institute_name: '',
  location: '',
  start_date: '',
  end_date: '',
  certificate_file_path: '',
};

const CertificateAddEditPage: FC<CertificateAddEditPageProps> = ({
                                                                   itemId,
                                                                   onClose: onCertificationAddEditPageClose,
                                                                 }) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const [isEducInstitute, setIsEducInstitute] = useState<boolean>(true);
  const [isEnlistedCourse, setIsEnlistedCourse] = useState<boolean>(false);
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();

  const {
    data: itemData,
    mutate: certificateMutate,
    isLoading,
  } = useFetchYouthCertificate(itemId);

  /*const [isStartOrEndDateGiven, setIsStartOrEndDateGiven] =
    useState<boolean>(false);*/

  console.log('Enlisted Course-->', isEnlistedCourse);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      certification_name: (isEducInstitute && !isEnlistedCourse) ? yup
          .string()
          .nullable()
          .label(messages['certification.label'] as string)
        :
        yup
          .string()
          .required()
          .title('bn', true)
          .label(messages['certification.label'] as string),
      certification_name_en: yup
        .string()
        .title('en', false)
        .label(messages['certificate.name_en'] as string),
      certificate_number: isEducInstitute ? yup
          .string()
          .required()
          .label(messages['common.certificate_number'] as string) :
        yup
          .string()
          .nullable()
          .label(messages['common.certificate_number'] as string),
      institute_id: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['common.certificate_institute_department'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['institute.label'] as string),
      course_id: (isEducInstitute && isEnlistedCourse)
        ? yup
          .string()
          .required()
          .label(messages['common.certificate_course_name'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['common.certificate_course_name'] as string),
      loc_division_id: isEducInstitute
        ? yup
          .string()
          .label(messages['divisions.label'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['divisions.label'] as string),
      district_or_city_corporation: yup
        .string()
        .label(messages['label.district_or_city_corporation'] as string),
      loc_district_id: yup
        .mixed()
        .label(messages['districts.label'] as string)
        .when('district_or_city_corporation', {
          is: DistrictOrCityCorporation.DISTRICT,
          then: yup.number().nullable(),
        }),
      loc_city_corporation_id: yup
        .mixed()
        .label(messages['city_corporation.label'] as string)
        .when('district_or_city_corporation', {
          is: DistrictOrCityCorporation.CITY_CORPORATION,
          then: yup.number().nullable(),
        }),
      training_center_id: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['common.training_center'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['common.training_center'] as string),
      institute_name: isEducInstitute
        ? yup
          .string()
          .nullable()
          .title('bn', false)
          .label(messages['common.institute_name_bn'] as string)
        : yup
          .string()
          .required()
          .title('bn', true)
          .label(messages['common.certificate_institute_department_bn'] as string),
      name: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['common.name'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['common.name'] as string),
      identity_number: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['common.nid_only'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['common.nid_only'] as string),
      father_name: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['common.father_name'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['common.father_name'] as string),
      mother_name: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['common.mother_name'] as string)
        : yup
          .string()
          .nullable()
          .label(messages['common.mother_name'] as string),
      result: isEducInstitute
        ? yup
          .string()
          .required()
          .label(messages['ranks.grade'] as string)
        : yup.string().nullable(),
      institute_name_en: yup
        .string()
        .title('en', false)
        .label(messages['common.certificate_institute_department_en'] as string),

      location: isEducInstitute ? yup
          .string()
          .nullable()
          .label(messages['common.location_bn'] as string)
        : yup
          .string()
          .required()
          .label(messages['common.location_bn'] as string),
      start_date: yup
        .string()
        .required()
        .trim()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['common.certificate_batch_start_date'] as string),
      end_date: yup
        .string()
        .required()
        .trim()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['common.certificate_batch_end_date'] as string),
      certificate_file_path: yup
        .string()
        .required()
        .label(messages['certificate.upload'] as string),
      location_en: yup
        .string()
        .title('en', false)
        .label(messages['common.location_en'] as string),
    });
  }, [messages, isEducInstitute, isEnlistedCourse]);

  const {
    register,
    reset,
    handleSubmit,
    setError,
    setValue,
    //watch,
    control,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });
  //const watchStartDate: any = watch(['start_date', 'end_date']);

  //console.log('watchStartDate-->', watchStartDate[0] == null);
  //console.log('watchEndDate-->', watchStartDate[1] == null);

  useEffect(() => {
    if (itemData) {
      setIsEducInstitute(itemData?.is_educ_institute_certificate);
      setIsEnlistedCourse(Boolean(itemData?.is_other_course));
      reset({
        certification_name: itemData.certification_name,
        certification_name_en: itemData?.certification_name_en,
        certificate_number: itemData?.certificate_number,
        institute_id: itemData?.institute_id,
        course_id: itemData?.course_id,
        institute_name: itemData?.institute_name,
        loc_city_corporation_id: itemData?.loc_city_corporation_id,
        loc_upazila_municipality_id: itemData?.loc_upazila_municipality_id,
        loc_district_id: itemData?.loc_district_id,
        loc_division_id: itemData?.loc_division_id,
        name: itemData?.name,
        institute_name_en: itemData?.institute_name_en,
        location: itemData?.location,
        location_en: itemData?.location_en,
        start_date: itemData?.start_date
          ? getMomentDateFormat(itemData.start_date, 'YYYY-MM-DD')
          : '',
        end_date: itemData?.end_date
          ? getMomentDateFormat(itemData?.end_date, 'YYYY-MM-DD')
          : '',
        training_center_id: itemData?.training_center_id,
        identity_number: itemData?.identity_number,
        father_name: itemData?.father_name,
        mother_name: itemData?.mother_name,
        result: itemData?.result,
        certificate_file_path: itemData?.certificate_file_path,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  /*  useEffect(() => {
      if (watchStartDate[0] || watchStartDate[1]) {
        setIsStartOrEndDateGiven(true);
      } else {
        setIsStartOrEndDateGiven(false);
      }
    }, [watchStartDate]);*/

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  console.log('errors-->', errors);

  const OtherCertificateForm = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='certification_name'
            label={messages['common.certificate_course_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='certification_name_en'
            label={messages['common.certificate_course_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomDatePicker
            required
            id='start_date'
            label={messages['common.certificate_batch_start_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CustomDatePicker
            required
            id='end_date'
            label={messages['common.certificate_batch_end_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='institute_name'
            label={messages['common.certificate_institute_department_bn']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='institute_name_en'
            label={messages['common.certificate_institute_department_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required
            id='location'
            label={messages['common.location_bn']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='location_en'
            label={messages['common.location_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FileUploadComponent
            id='certificate_file_path'
            defaultFileUrl={itemData?.certificate_file_path}
            acceptedFileTypes={['image/*', 'application/pdf']}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.certificate']}
            required={true}
          />
        </Grid>
      </Grid>
    );
  };

  const onSubmit: SubmitHandler<YouthCertificate> = async (
    data: YouthCertificate,
  ) => {
    try {
      if (isEducInstitute) {
        data.is_educ_institute_certificate = 1;
        data.row_status = 2;
      } else {
        data.is_educ_institute_certificate = 0;
        data.row_status = 1;
      }
      if(isEnlistedCourse){
        data.is_other_course = 1;
      }else{
        data.is_other_course = 0;
      }

      if (itemId) {
        await updateCertificate(itemId, data);
        updateSuccessMessage('certificate.label');
      } else {
        await createCertificate(data);
        //console.log("create certificate data", data);
        createSuccessMessage('certificate.label');
      }
      certificateMutate();
      onCertificationAddEditPageClose();
    } catch (error: any) {
      console.log('error-->', error);
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };
  console.log('validation-error-->', errors);
  console.log('educ-institute-->', isEducInstitute);
  console.log('isEnlistedCourse-->', isEnlistedCourse);
  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['common.certificate']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton
                onClick={onCertificationAddEditPageClose}
                isLoading={isLoading}
              />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading}/>
            </React.Fragment>
          }
          onClose={onCertificationAddEditPageClose}>
          <Grid container>
            <Grid item xs={12} mb={2}>
              <CustomCheckbox
                id='is_educ_institute'
                label={messages['education.is_educ_institute']}
                register={register}
                errorInstance={errors}
                checked={!isEducInstitute}
                onChange={() => {
                  setIsEducInstitute((prev) => !prev);
                }}
                isLoading={false}
              />
            </Grid>
            {!isEducInstitute ? (
              <OtherCertificateForm/>
            ) : (
              <EDUCCertificateForm
                setValue={setValue}
                control={control}
                errors={errors}
                isLoading={isLoading}
                itemData={itemData}
                register={register}
                isEnlistedCourse={isEnlistedCourse}
                setIsEnlistedCourse={setIsEnlistedCourse}
              />
            )}
          </Grid>

          {isSubmitting && (
            <div
              role={'alert'}
              aria-live='assertive'
              style={{position: 'absolute', top: '-9999px'}}>
              {messages['common.submitting'] as string}
            </div>
          )}
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default CertificateAddEditPage;
