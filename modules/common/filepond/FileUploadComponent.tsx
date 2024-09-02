import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {FilePond, registerPlugin} from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import IntlMessages from '../../@core/utility/IntlMessages';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import FilepondCSS from './FilepondCSS';
import {
  FILE_SERVER_FILE_VIEW_ENDPOINT,
  FILE_SERVER_UPLOAD_ENDPOINT,
} from '../../@core/common/apiRoutes';
import {useIntl} from 'react-intl';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageValidateSize,
);

interface FilepondComponentProps {
  id: string;
  errorInstance: any;
  setValue: any;
  register: any;
  required?: boolean;
  label: string | React.ReactNode;
  defaultFileUrl?: string | null;
  acceptedFileTypes?: any;
  allowMultiple?: boolean;
  uploadedUrls?: any;
  sizeLimitText?: string;
  height?: any;
  width?: any;
  disabled?: any;
  onFileChange?: any;
  removeFile?: boolean;
  onFileUpload?: (value: string | null) => void;
}

/** Accepted files type */
/*acceptedFileTypes = [
  'image/!*',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]*/

const StyledWrapper = styled('div')(() => ({...FilepondCSS}));

const FileUploadComponent: FC<FilepondComponentProps> = ({
  id,
  errorInstance,
  setValue,
  register,
  required,
  label,
  defaultFileUrl,
  allowMultiple,
  acceptedFileTypes = ['image/*'],
  sizeLimitText = '2MB',
  uploadedUrls,
  height,
  width,
  disabled = false,
  onFileChange,
  removeFile,
  onFileUpload,
}) => {
  const {messages} = useIntl();
  let errorObj = errorInstance?.[id];
  const reg = new RegExp('(.*)\\[(.*?)]', '');
  const matches = id.match(reg);
  if (matches) {
    errorObj = errorInstance?.[matches[1]]?.[matches[2]];
  }
  const [files, setFiles] = useState<any>([]);

  useEffect(() => {
    if (defaultFileUrl && defaultFileUrl.length) {
      if (Array.isArray(defaultFileUrl)) {
        let initFile = defaultFileUrl.map((url) => ({
          source: url.replace(FILE_SERVER_FILE_VIEW_ENDPOINT, ''),
          options: {
            type: 'local',
          },
        }));
        setFiles(initFile);
      } else {
        let source = defaultFileUrl.replace(FILE_SERVER_FILE_VIEW_ENDPOINT, '');
        let initFile = [
          {
            source: source,
            options: {
              type: 'local',
            },
          },
        ];
        setFiles(initFile);
      }
    }
  }, [defaultFileUrl]);

  const handleRemoveFile = useCallback((errorResponse, file) => {
    if (!allowMultiple) {
      setValue(id, '');
      if (onFileUpload) {
        onFileUpload('');
      }
    }
  }, []);
  const filePondRef = useRef<any>(null);

  useEffect(() => {
    filePondRef.current?.removeFile();
  }, [removeFile]);

  return (
    <StyledWrapper>
      <InputLabel
        error={errorObj && typeof errorObj != undefined}
        required={required}>
        {label}
      </InputLabel>
      <FormControl fullWidth>
        <FilePond
          disabled={disabled}
          className={allowMultiple ? 'multi-upload' : ''}
          files={files}
          onupdatefiles={(newFiles) => {
            // if (files.length > newFiles.length) { // removed
            //   setValue(id, [...(nf => )(newFiles)]);
            // }
            setFiles(newFiles);
          }}
          ref={filePondRef}
          allowImageValidateSize={true}
          imageValidateSizeMinWidth={width ? width : 1}
          imageValidateSizeMaxWidth={width ? width : 65535}
          imageValidateSizeMinHeight={height ? height : 1}
          imageValidateSizeMaxHeight={height ? height : 65535}
          allowMultiple={allowMultiple}
          onremovefile={handleRemoveFile}
          acceptedFileTypes={acceptedFileTypes}
          labelFileTypeNotAllowed={messages['filePond.file_type'] as string}
          allowFileSizeValidation={true}
          labelMaxFileSize={
            (messages['filePond.max_file_size'] as string) + sizeLimitText
          }
          labelMaxFileSizeExceeded={
            (messages['filePond.max_file_size'] as string) + sizeLimitText
          }
          labelMaxTotalFileSizeExceeded={
            messages['filePond.total_max_file_size'] as string
          }
          onprocessfilestart={(item: any) => {
            if (onFileChange) onFileChange(item.filename);
            return true;
          }}
          maxFileSize={sizeLimitText}
          maxTotalFileSize={'50MB'}
          maxParallelUploads={1}
          maxFiles={50}
          // allowRemove={false} // prop does not exist
          server={{
            process: {
              url: FILE_SERVER_UPLOAD_ENDPOINT,
              onload: (response: any) => {
                let res = JSON.parse(response);
                let fileUrl = res?.url?.replace(
                  FILE_SERVER_FILE_VIEW_ENDPOINT,
                  '',
                );
                if (!allowMultiple) {
                  setValue(id, fileUrl);
                  if (onFileUpload) {
                    onFileUpload(fileUrl);
                  }
                } else {
                  setValue(id, [...uploadedUrls, fileUrl]);
                }
                return 1;
              },
            },
            load: {
              url: FILE_SERVER_FILE_VIEW_ENDPOINT,
            },
          }}
          styleProgressIndicatorPosition={'center'}
          name='files'
          // labelIdle='Drag & Drop your files or <span class="filepond--label-action">Upload</span>'
          labelIdle={messages['file.drag_and_drop_or_upload'] as string}
        />
        <TextField
          id={id}
          type={'hidden'}
          {...register(id)}
          sx={{display: 'none'}}
        />
        <FormHelperText
          sx={{color: 'error.main', marginLeft: '15px', marginTop: '-10px'}}>
          {' '}
          {errorObj && errorObj.message ? (
            errorObj.message.hasOwnProperty('key') ? (
              <span tabIndex={0}>
              <IntlMessages
                id={errorObj.message.key}
                values={errorObj.message?.values || {}}
              /></span>

            ) : (
              <span tabIndex={0}>errorObj.message</span>
            )
          ) : (
            ''
          )}
        </FormHelperText>
      </FormControl>
      {
        <Box sx={{fontStyle: 'italic', fontWeight: 'bold', marginTop: '6px'}}>
          {(messages['file_size.maximum_size_warning_text'] as string).replace(
            '1MB',
            sizeLimitText,
          )}
          {height &&
            width &&
            ` ${messages['file_pond.size_validation']} ${width} px * ${height} px`}
        </Box>
      }
    </StyledWrapper>
  );
};

export default FileUploadComponent;
