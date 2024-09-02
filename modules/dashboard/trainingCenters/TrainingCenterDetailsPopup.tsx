import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import IconTrainingCenter from '../../../@core/icons/IconTrainingCenter';
import {useFetchTrainingCenter} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import AddressDetailsView from '../../../@core/elements/display/AddressDetailsView';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import BankInfoDetailsView from './BankInfoDetailsView';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const TrainingCenterDetailsPopup = ({
  itemId,
  openEditModal,
  ...props
}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchTrainingCenter(itemId);
  const authUser = useAuthUser();

  const {training_center: training_center_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconTrainingCenter />
            <IntlMessages id='training_center.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {training_center_permission.canUpdate && itemData && (
              <EditButton
                variant='contained'
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.title_en']}
              value={itemData?.title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.title']}
              value={itemData?.title}
              isLoading={isLoading}
            />
          </Grid>
          {authUser?.isSystemUser && itemData && itemData?.institute_id && (
            <>
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
            </>
          )}
          {authUser?.isSystemUser &&
            itemData &&
            itemData?.industry_association_id && (
              <>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['industry_association.label']}
                    value={itemData?.industry_association_title}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <DetailsInputView
                    label={messages['industry_association.label_en']}
                    value={itemData?.industry_association_title_en}
                    isLoading={isLoading}
                  />
                </Grid>
              </>
            )}

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['branch.label']}
              value={itemData?.branch_title_en}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={5}>
              <AddressDetailsView itemData={itemData} isLoading={isLoading} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.google_map_src']}
              value={itemData?.google_map_src}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={5}>
              <BankInfoDetailsView
                itemData={itemData?.training_center_payment_account_info}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <CustomChipRowStatus
              label={messages['common.active_status']}
              value={itemData?.row_status}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default TrainingCenterDetailsPopup;
