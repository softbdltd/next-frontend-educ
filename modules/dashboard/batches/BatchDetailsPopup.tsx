import React, {useCallback, useContext} from 'react';
import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import IconBatch from '../../../@core/icons/IconBatch';
import {getMomentDateFormat} from '../../../@core/utilities/helpers';
import {useFetchBatch} from '../../../services/instituteManagement/hooks';
import {ITrainer} from '../../../shared/Interface/institute.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const BatchDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchBatch(itemId);
  const {batch: batch_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const getTrainersName = useCallback((trainers: any = []) => {
    let namesArray = trainers.map(
      (item: ITrainer) =>
        item?.trainer_first_name + ' ' + item?.trainer_last_name,
    );
    return namesArray.join(', ');
  }, []);

  return (
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        title={
          <>
            <IconBatch />
            <IntlMessages id='batches.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {batch_permission.canUpdate && (
              <EditButton
                variant={'contained'}
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.title']}
              value={itemData?.title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.title_en']}
              value={itemData?.title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['institute.label']}
              value={itemData?.institute_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['institute.label_en']}
              value={itemData?.institute_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['branch.label']}
              value={itemData?.branch_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['branch.label_en']}
              value={itemData?.branch_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['training_center.label']}
              value={itemData?.training_center_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['training_center.label_en']}
              value={itemData?.training_center_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['course.label']}
              value={itemData?.course_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['course.label_en']}
              value={itemData?.course_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <DetailsInputView
              label={messages['batches.total_seat']}
              value={itemData?.number_of_seats}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <DetailsInputView
              label={messages['batches.available_seat']}
              value={itemData?.available_seats}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['batches.registration_start_date']}
              value={getMomentDateFormat(
                itemData?.registration_start_date,
                'DD MMM YYYY',
              )}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['batches.registration_end_date']}
              value={getMomentDateFormat(
                itemData?.registration_end_date,
                'DD MMM YYYY',
              )}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['batches.start_date']}
              value={getMomentDateFormat(
                itemData?.batch_start_date,
                'DD MMM YYYY',
              )}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['batches.end_date']}
              value={getMomentDateFormat(
                itemData?.batch_end_date,
                'DD MMM YYYY',
              )}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['trainers.label']}
              value={getTrainersName(itemData?.trainers)}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.status']}
              value={<DecoratedRowStatus rowStatus={itemData?.row_status} />}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default BatchDetailsPopup;
