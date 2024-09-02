import React, {FC, useState, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {SubmitHandler, useForm} from 'react-hook-form';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import {ApproveBlogAndStories} from '../../../services/cmsManagement/BlogAndSuccessStoriesService';
import {Check} from '@mui/icons-material';

interface Props {
  itemId: any;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  is_approved: 0,
  archived_at: '',
};

const BlogAndSuccessStoriesApprovePopup: FC<Props> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const {updateSuccessMessage} = useSuccessMessage();

  const {
    register,
    reset,
    control,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>();

  useEffect(() => {
    if (itemId) {
      if (itemId.row_status === 1) {
        setIsApproved(true);
      }
      let data: any = {
        is_approved: itemId?.is_approved,
        archived_at: itemId?.archived_at,
      };
      reset(data);
    } else {
      reset(initialValues);
    }
  }, [itemId]);

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      let data = {...formData};
      if (data.is_approved === true) {
        data.is_approved = 1;
      } else {
        data.is_approved = 0;
        data.archived_at = null;
      }
      if (itemId) {
        await ApproveBlogAndStories(itemId.id, data);
        updateSuccessMessage('common.approve');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({
        error,
        setError,
        errorStack,
      });
    }
  };

  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <Check />
          {
            <IntlMessages
              id='common.approve_blog'
              values={{subject: <IntlMessages id='common.approve' />}}
            />
          }
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'md' : 'sm'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} />
          <SubmitButton isSubmitting={isSubmitting} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <CustomCheckbox
            id='is_approved'
            label={messages['common.approve']}
            register={register}
            errorInstance={errors}
            checked={isApproved}
            onChange={() => {
              setIsApproved((prev: boolean) => !prev);
            }}
            isLoading={false}
          />
        </Grid>
        {isApproved === true ? (
          <Grid item xs={12} md={8}>
            <CustomDatePicker
              id='archived_at'
              label={messages['common.archived_at']}
              control={control}
              errorInstance={errors}
            />
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default BlogAndSuccessStoriesApprovePopup;
