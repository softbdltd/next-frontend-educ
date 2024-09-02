import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import IconBranch from '../../../@core/icons/IconBranch';
import {useFetchBranch} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import AddressDetailsView from '../../../@core/elements/display/AddressDetailsView';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const BranchDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchBranch(itemId);
  const {branch: branchPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconBranch />
            <IntlMessages id='branch.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {itemData && branchPermission.canUpdate && (
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
              value={itemData?.institute_title_en}
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

export default BranchDetailsPopup;
