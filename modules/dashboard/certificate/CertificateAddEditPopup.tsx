import {yupResolver} from '@hookform/resolvers/yup';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Grid from '@mui/material/Grid';
import {useRouter} from 'next/router';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import yup from '../../../@core/libs/yup';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  createCertificate,
  getCertificate,
  updateCertificate,
} from '../../../services/CertificateAuthorityManagement/CertificateService';
import {CERTIFICATE_LANGUAGE, CERTIFICATE_TYPE} from './Constants';
import useTemplateDispatcher from './editor/state/dispatchers/template';
import {toTemplateJSON} from './editor/utils/template';
import {ICertificateTemplates} from '../../../shared/Interface/certificates';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {useFetchLocalizedCoordinatorOrganizations} from '../../../services/organaizationManagement/hooks';
import {AccessorType} from '../../../shared/constants/AccessorType';

interface CertificateAddEditPopupProps {
  onClose: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
  certificate_type: '',
  language: 1,
};

interface Certificate {
  title: string;
  title_en: string;
  certificate_type: number;
  language: number;
  accessor_type?: string;
  accessor_id?: number | string | null;
}

const CertificateAddEditPopup: FC<CertificateAddEditPopupProps> = ({
  ...props
}) => {
  const router = useRouter();
  const query = router.query;
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser();

  const {setCurrentTemplateToSave} = useTemplateDispatcher();
  const itemId = query.certificateId ? query.certificateId : null;

  const [itemData, setItemData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {data: organizations, isLoading: isOrganizationLoading} =
    useFetchLocalizedCoordinatorOrganizations(
      authUser?.isCoordinatorUser ? authUser?.userId : null,
    );

  useEffect(() => {
    if (itemId) {
      try {
        (async () => {
          setIsLoading(true);
          let response = await getCertificate(itemId);
          if (isResponseSuccess(response)) {
            setItemData(response?.data);
          }
          setIsLoading(false);
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }, [query]);

  const certificateTypes = useMemo(
    () => [
      {
        id: CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT,
        label: messages['certificate.competent_or_not'],
      },
      {
        id: CERTIFICATE_TYPE.GRADING,
        label: messages['certificate.grading'],
      },
      {
        id: CERTIFICATE_TYPE.MARKS,
        label: messages['certificate.marks'],
      },
      {
        id: CERTIFICATE_TYPE.PARTICIPATION,
        label: messages['certificate.participation'],
      },
      {
        id: CERTIFICATE_TYPE.MEMBER_REGISTRATION,
        label: messages['common.member_registration'],
      },
    ],
    [messages],
  );
  const LanguageOptions = useMemo(
    () => [
      {
        id: CERTIFICATE_LANGUAGE.BANGLA,
        label: messages['common.bangla'],
      },
      {
        id: CERTIFICATE_LANGUAGE.ENGLISH,
        label: messages['common.english'],
      },
    ],
    [messages],
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title_en: yup
        .string()
        .title('en', false)
        .label(messages['common.title_en'] as string),
      title: yup
        .string()
        .title('bn', true)
        .label(messages['common.title'] as string),
      certificate_type: yup
        .number()
        .required()
        .label(messages['certificate.certificate_type'] as string),
      accessor_id: authUser?.isCoordinatorUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['common.industrial'] as string)
        : yup.string(),
      language: yup
        .number()
        .required()
        .label(messages['common.language'] as string),
    });
  }, [messages, authUser]);

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemId && itemData && !query.new && query.new !== 'true') {
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
        certificate_type: itemData?.certificate_type,
        language: itemData?.language,
        accessor_id: itemData?.accessor_id ?? '',
      });
    } else {
      reset(initialValues);
    }
  }, [itemData, query]);

  const onSubmit: SubmitHandler<any> = async (data: Certificate) => {
    const template = await setCurrentTemplateToSave();
    const templateJson = await toTemplateJSON(template);
    const dataToSave: Partial<ICertificateTemplates> = {
      title: data.title!,
      title_en: data.title_en!,
      certificate_type: data.certificate_type!,
      template: templateJson,
      language: data.language,
    };

    if (authUser?.isCoordinatorUser) {
      dataToSave.accessor_id = data.accessor_id;
      dataToSave.accessor_type = AccessorType.ORGANIZATION;
    } else {
      delete dataToSave.accessor_type;
      delete dataToSave.accessor_id;
    }

    try {
      if (itemId && !query.new) {
        await updateCertificate(Number(itemId), dataToSave);
        updateSuccessMessage('common.certificate');
        //mutateCertificates();
        router.back();
      } else {
        await createCertificate(dataToSave);
        createSuccessMessage('common.certificate');
        router.back();
      }
      props.onClose();
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
          <WorkspacePremiumIcon />
          {itemId ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='common.certificate' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='common.certificate' />}}
            />
          )}
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
        </>
      }>
      <Grid container spacing={5}>
        {authUser?.isCoordinatorUser && (
          <Grid item xs={12}>
            <CustomFormSelect
              required
              id='accessor_id'
              label={messages['common.industrial']}
              isLoading={isOrganizationLoading}
              control={control}
              options={organizations}
              optionValueProp='id'
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='title'
            label={messages['common.title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            id='title_en'
            label={messages['common.title_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomFormSelect
            required
            id='certificate_type'
            label={messages['certificate.certificate_type']}
            isLoading={isLoading}
            control={control}
            options={certificateTypes}
            multiple={false}
            optionValueProp='id'
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomFormSelect
            required
            id='language'
            label={messages['common.language']}
            isLoading={isLoading}
            control={control}
            options={LanguageOptions}
            multiple={false}
            optionValueProp='id'
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default CertificateAddEditPopup;
