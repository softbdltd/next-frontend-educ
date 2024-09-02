import {AxiosError} from 'axios';

const ERRORS: any = {
  32000: 'yup_validation_integer',
  62000: 'yup_validation_exist',
  50000: 'yup_validation_required_field',
  46000: 'yup_validation_number',
  47000: 'yup_validation_password',
  49000: 'yup_validation_regex',
  22000: 'yup_validation_email',
  39003: 'yup_validation_text_length',
  42003: 'yup_validation_digit_length',
  3000: 'yup_validation_date',
  30000: 'yup_validation_invalid_row_status',
  100000: 'yup_validation_invalid_start_date',
  200000: 'yup_validation_invalid_end_date',
  9000: 'invalid_start_date',
  67000: 'yup_validation_invalid_subject_id',
  27001: 'yup_validation_experience',
};

interface TProcessServerSideErrors {
  error: AxiosError;
  validationSchema?: any; //Yup Validation Schema
  setError?: any; // React hook form setError method
  errorStack: any;
  messages?: any;
}

export const processServerSideErrors = ({
  error,
  validationSchema,
  setError,
  errorStack,
  messages,
}: TProcessServerSideErrors) => {
  if (error.response?.status === 422) {
    if (setError && validationSchema) {
      const {response: {data: {errors}} = {}} = error;

      const validationFields = validationSchema.hasOwnProperty('fields')
        ? Object.keys(validationSchema.fields)
        : [];
      const serversideErrorFields = (errors && Object.keys(errors)) || [];

      const shouldShowOnFields = serversideErrorFields.filter((v: any) =>
        validationFields.includes(v),
      );
      console.log('shouldShowOnFields', shouldShowOnFields);
      const shouldShowOnStack = serversideErrorFields.filter(
        (v: any) => !validationFields.includes(v),
      );
      console.log('shouldShowOnStack', shouldShowOnStack);

      shouldShowOnFields.forEach((key: string) => {
        errors[key].forEach((error: any) => {
          const match = error.match(/\[([0-9]+)]$/i);

          let label = validationSchema.fields[key].spec.label;
          console.log('error 1', match, error, errors);

          if (match && match[1] && ERRORS[match[1]]) {
            setError(key, {
              message: {
                key: ERRORS[match[1]],
                values: {path: label ? label : key},
              },
            });
          } else if (error !== '') {
            // temp solution
            setError(key, {type: 'custom', message: error});
          } else {
            // issue is here
            setError(key, {
              message: {key: 'yup_validation_unknown_error'},
            });
          }
        });
      });

      const notistackErrors = shouldShowOnStack.reduce(
        (previousValue: any, currentValue: any) => {
          if (currentValue in errors) {
            errors[currentValue]?.forEach((error: string) => {
              const match = error.match(/\[([0-9]+)]$/i);
              if (match && match[1]) {
                error = error.replace('[' + match[1] + ']', '');
              }

              previousValue.push(error);
            });
          }

          return previousValue;
        },
        [],
      );

      notistackErrors.forEach((value: string) => {
        errorStack(value);
      });

      if (
        !shouldShowOnFields.length &&
        !(shouldShowOnStack.length && notistackErrors.length)
      ) {
        errorStack(
          error.response?.data?._response_status?.message ||
            'Unknown Validation Error',
        );
      }
    } else {
      const {response: {data: {errors}} = {}} = error;

      if (errors && Object.keys(errors).length > 0) {
        const notistackErrors = Object.keys(errors).reduce(
          (previousValue: any, currentValue: any) => {
            if (currentValue in errors) {
              errors[currentValue]?.forEach((error: string) => {
                const match = error.match(/\[([0-9]+)]$/i);
                if (match && match[1]) {
                  error = error.replace('[' + match[1] + ']', '');
                }

                previousValue.push(error);
              });
            }

            return previousValue;
          },
          [],
        );

        notistackErrors.forEach((value: string) => {
          errorStack(value);
        });
      } else {
        errorStack(
          error.response?.data?._response_status?.message ||
            'Unknown Validation Error',
        );
      }
    }
  } else if (Number(error.response?.status || 0) >= 500) {
    errorStack(
      error.response?.data?._response_status?.message ||
        'Internal Server Error',
    );
  } else {
    if (error.response?.data?._response_status?.message) {
      if (
        error.response?.data?._response_status?.message ==
          'Idp user already exists' &&
        messages
      ) {
        errorStack(messages['error.idp_user_exist']);
      } else {
        errorStack(error.response?.data?._response_status?.message);
      }
    } else {
      errorStack('Unknown Error');
    }
  }
};
