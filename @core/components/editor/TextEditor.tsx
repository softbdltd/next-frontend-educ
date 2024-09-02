import React, {ForwardedRef} from 'react';
import {Editor as TinymceEditor} from '@tinymce/tinymce-react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from '@mui/material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {debounce} from 'lodash';
import {FILE_SERVER_UPLOAD_ENDPOINT} from '../../common/apiRoutes';

interface EditorProps {
  height?: string;
  onEditorChange?: (a: string, editor: any) => void;
  id: string;
  errorInstance: any;
  label: string;
  required?: boolean;
  value: string;
  setValue: any;
  register: any;
  clearErrors: any;
  setError: any;
  additionalLabel?: any;

  [x: string]: any;
}

const IMAGE_MARGIN: number = 15;

/**
 //Basic uses of TextEditor
 const textEditorRef = useRef<any>(null);

 <TextEditor
 ref={textEditorRef}
 errorInstance={errors}
 label={messages['common.description']}
 />
 />
 */
const TextEditor = React.forwardRef(
  (
    {
      value,
      height,
      onEditorChange,
      id,
      errorInstance,
      required = false,
      label,
      register,
      setValue,
      clearErrors,
      setError,
      additionalLabel,
    }: EditorProps,
    ref: ForwardedRef<any>,
  ) => {
    let errorObj = errorInstance?.[id];
    const reg = new RegExp('(.*)\\[(.*?)]', '');
    const matches = id.match(reg);
    if (matches) {
      errorObj = errorInstance?.[matches[1]]?.[matches[2]];
    }

    let selectedNode: any = null;

    const onActivateUI = () => {
      // @ts-ignore
      const tinyMCE = window.tinyMCE;

      if (tinyMCE) {
        tinyMCE.activeEditor.windowManager.open = (
          (open: any) =>
          (...args: any) => {
            let op = open(...args);
            let dialog =
              document.getElementsByClassName('tox-tinymce-aux')?.[0];
            let target = document.getElementsByClassName(
              'MuiDialog-container',
            )?.[0];

            if (target && dialog) {
              target.appendChild(dialog);
            }
            return op;
          }
        )(tinyMCE.activeEditor.windowManager.open);
      }
    };

    const imageUploadHandler = (
      blobInfo: any,
      success: any,
      failure: any,
      progress: any,
    ) => {
      let xhr: XMLHttpRequest, formData: FormData;

      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', FILE_SERVER_UPLOAD_ENDPOINT);

      xhr.upload.onprogress = function (e) {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = function () {
        let json;

        if (xhr.status === 403) {
          failure('HTTP Error: ' + xhr.status, {remove: true});
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          failure('HTTP Error: ' + xhr.status);
          return;
        }

        json = JSON.parse(xhr.responseText);

        if (!json || typeof json.url != 'string') {
          failure('Invalid JSON: ' + xhr.responseText);
          return;
        }

        success(json.url);
      };

      xhr.onerror = function () {
        failure(
          'Image upload failed due to a XHR Transport error. Code: ' +
            xhr.status,
        );
      };

      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      xhr.send(formData);
    };

    let toolbar =
      'undo redo formatselect bold italic underline | alignleft aligncenter alignright alignjustify | image media template link code | forecolor backcolor removeformat';

    return (
      <>
        <InputLabel required={required}>
          {label} {additionalLabel ? additionalLabel : ''}
        </InputLabel>
        <FormControl fullWidth>
          <TinymceEditor
            apiKey={process.env.NEXT_PUBLIC_TEXT_EDITOR_APIKEY}
            onInit={onActivateUI}
            id={id}
            onEditorChange={debounce((content: string, editor: any) => {
              const key = matches ? matches[1] + '.' + matches[2] : id;
              setValue(key, content);

              if (content) clearErrors(key);
              else if (required) {
                setError(key, {
                  message: {
                    key: 'yup_validation_required_field',
                    values: {path: label},
                  },
                });
              }
            }, 500)}
            ref={ref}
            initialValue={value}
            init={{
              image_title: true,
              height: height ? height : 700,
              menubar: false,
              branding: false,
              convert_urls: false,
              image_caption: true,
              media_strict: false,
              content_style: `
              .mce-preview-object{display: inline;} 
              iframe{float: left;}
              span[style="float: left;"] > iframe{margin-right: ${IMAGE_MARGIN}px}
              span[style="float: right;"] > iframe{margin-left: ${IMAGE_MARGIN}px}
              img[data-mce-style="float: left;"]{margin-right: ${IMAGE_MARGIN}px;}
              img[data-mce-style="float: right;"]{margin-left: ${
                IMAGE_MARGIN - 5
              }px;}
              `,
              // content_css : 'body{background-color: red}',
              // images_upload_handler: tinyMceEditorImageUploader,
              images_upload_handler: imageUploadHandler,
              // media_url_resolver: function (data, resolve/*, reject*/) {
              //   console.log(' media_url_resolver :', data, resolve(d=> {
              //     console.log(d)
              //   }))
              // },
              fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor template linkchecker ',
                'searchreplace visualblocks code image fullscreen',
                'insertdatetime media table paste code help wordcount textcolor',
              ],
              toolbar,
              toolbar_mode: 'wrap',
              setup: function (editor: any) {
                // editor.ui.registry.addButton('alignright', {
                //   text: 'My Button',
                //   onAction: function (_) {
                //     console.log(' alignright : clicked!')
                //     // editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                //
                editor.on(
                  'ExecCommand',
                  (cmd: any, ui?: boolean, value?: any) => {
                    // if(command ==)
                    switch (cmd.command) {
                      case 'JustifyLeft':
                        selectedNode?.setAttribute('style', 'float: left;');
                        break;
                      case 'JustifyRight':
                        // console.log('right');
                        selectedNode?.setAttribute('style', 'float: right;');
                        break;
                      default:
                        break;
                    }
                  },
                ),
                  editor.on('objectselected', (node: any) => {
                    selectedNode = node.target;
                  }),
                  editor.on('focus', function () {});
                editor.on('blur', function () {});
              },
              templates: [
                {
                  title: 'Two column table',
                  description: 'Creates a new table',
                  content:
                    '<div class="editor-template-table">' +
                    '<table width="100%"  border="0">' +
                    '<tr><td colspan="6">Content</td><td colspan="6">Content</td></tr>' +
                    '</table>' +
                    '</div>',
                },
                {
                  title: 'Link Button',
                  description: 'Creates a new button',
                  content:
                    '<div >' +
                    '<a class="link-button MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root" style="border-radius: 5px; border: 1px solid #bfbfbf; padding: 5px 10px 8px; text-decoration: none; color: #1c1c1c;" href="#" title="">' +
                    'Button Text' +
                    '<span class="MuiButton-startIcon MuiButton-iconSizeMedium css-1d6wzja-MuiButton-startIcon"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="DashboardIcon"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></svg></span>' +
                    '</a>' +
                    '</div>',
                },
                {
                  title: 'Link Button 2',
                  description: 'Creates a button to view more',
                  content: `
                  <a class='link-button MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root' style='border-radius: 5px; border: 1px solid #bfbfbf; padding: 5px 10px 8px; text-decoration: none; color: #1c1c1c;' title='আরো দেখুন' href='https://educ.com/sc/about-us' target='_blank' rel='noopener'>আরো দেখুন</a>
                  `,
                },
              ],
              template_cdate_format:
                '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
              template_mdate_format:
                '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
            }}
          />
          <TextField
            id={id}
            type={'hidden'}
            {...register(id)}
            sx={{display: 'none'}}
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
      </>
    );
  },
);

export default TextEditor;
