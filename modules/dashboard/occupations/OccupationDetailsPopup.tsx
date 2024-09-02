import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import IconOccupation from '../../../@core/icons/IconOccupation';
import {useFetchOccupation} from '../../../services/organaizationManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const OccupationDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchOccupation(itemId);
  const {occupation: occupationPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  return (
    <CustomDetailsViewMuiModal
      {...props}
      open={true}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      title={
        <>
          <IconOccupation />
          <IntlMessages id='occupations.label' />
        </>
      }
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          {occupationPermission.canUpdate && (
            <EditButton
              onClick={() => openEditModal(itemData.id)}
              isLoading={isLoading}
              variant={'contained'}
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
        <Grid item xs={12}>
          <DetailsInputView
            label={messages['job_sectors.label']}
            value={itemData?.job_sector_title_en}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <DetailsInputView
            label={messages['common.status']}
            value={<DecoratedRowStatus rowStatus={itemData?.row_status} />}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </CustomDetailsViewMuiModal>
  );
};

export default OccupationDetailsPopup;
