import {Grid} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useRef} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import {useIntl} from 'react-intl';
import DownloadIcon from '@mui/icons-material/Download';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  createQuestionImport,
  getQuestionFileFormat,
} from '../../../services/instituteManagement/QuestionsBankService';
import UncontrolledTextInput from '../../../@core/elements/input/UncontrolledTextInput';

interface ImportPopupProps {
  onClose: () => void;
  refreshDataTable: () => void;
}

const ImportQuestionPopup: FC<ImportPopupProps> = ({
  refreshDataTable,
  ...props
}) => {
  const {successStack, errorStack} = useNotiStack();
  const {messages} = useIntl();
  const linkRef = useRef<any>();

  const {
    register,
    handleSubmit,
    // errors,
    setError,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<any>();

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      if (data?.file.length == 0) {
        errorStack(messages['common.file_upload_first']);
        return;
      } else if (
        data?.file[0]?.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        errorStack(messages['common.only_xlsx_file']);
        return;
      }

      let formData = new FormData();
      formData.append('file', data?.file[0]);

      await createQuestionImport(formData);
      successStack(messages['common.file_upload_successful']);
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, errorStack});
    }
  };

  const fileUploadHandler = (files: any) => {
    if (
      files.length > 0 &&
      files[0].type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      errorStack(messages['common.only_xlsx_file']);
      setValue('file', '');
    }
  };
  //return a promise that resolves with a File instance
  const urlToFile = (url: any, filename: any, mimeType: any) => {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, {type: mimeType});
      });
  };

  const fileDownloadHandler = async () => {
    try {
      let response = await getQuestionFileFormat();
      const fileName = 'Exam_question';
      urlToFile(
        response.data,
        fileName,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ).then(function (file) {
        linkRef.current.href = URL.createObjectURL(file);
        linkRef.current.click();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <DownloadIcon />
          <IntlMessages
            id='common.add_new'
            values={{
              subject: <IntlMessages id='common.import' />,
            }}
          />
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
      <a style={{opacity: '0'}} ref={linkRef} download>
        Download link
      </a>
      <Grid container spacing={3} sx={{overflow: 'hidden'}}>
        <Grid item xs={6}>
          <CommonButton
            key={1}
            onClick={() => fileDownloadHandler()}
            btnText={'common.download_excel_file'}
            variant={'outlined'}
            color={'primary'}
          />
        </Grid>

        <Grid item xs={6}>
          <UncontrolledTextInput
            required
            id='file'
            name='file'
            label={messages['common.file_upload']}
            register={register}
            type={'file'}
            InputLabelProps={{
              shrink: true,
            }}
            onInput={fileUploadHandler}
            errorInstance={errors}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};
export default ImportQuestionPopup;
