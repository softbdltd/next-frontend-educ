import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import {WorkOutline} from '@mui/icons-material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {useFetchJobSector} from '../../../services/organaizationManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const JobSectorDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {data: itemData, isLoading} = useFetchJobSector(itemId);
  const {messages} = useIntl();
  const {job_sector: jobSectorPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  return (
    <>
      <CustomDetailsViewMuiModal
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        open={true}
        {...props}
        title={
          <>
            <WorkOutline />
            <IntlMessages id='job_sectors.label' />
          </>
        }
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {jobSectorPermission.canUpdate && (
              <EditButton
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['common.title']}
              value={itemData?.title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['common.title_en']}
              value={itemData?.title_en}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomChipRowStatus
              label={messages['common.status']}
              value={itemData?.row_status}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};
export default JobSectorDetailsPopup;
