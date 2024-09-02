import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import IconDivision from '../../../@core/icons/IconDivision';
import {useFetchDivision} from '../../../services/locationManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const DivisionDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {data: itemData, isLoading} = useFetchDivision(itemId);
  const {messages} = useIntl();
  const {division: divisionPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  return (
    <>
      <CustomDetailsViewMuiModal
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        open={true}
        {...props}
        title={
          <>
            <IconDivision />
            <IntlMessages id='divisions.label' />
          </>
        }
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {divisionPermission.canUpdate && (
              <EditButton
                onClick={() => openEditModal(itemData?.id)}
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
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['common.bbs_code']}
              value={itemData?.bbs_code}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default DivisionDetailsPopup;
