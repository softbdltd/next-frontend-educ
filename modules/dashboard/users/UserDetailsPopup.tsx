import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IconRole from '../../../@core/icons/IconRole';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';
import {useFetchUser} from '../../../services/userManagement/hooks';
import UserTypes from '../../../@core/utilities/UserTypes';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import AddressDetailsView from '../../../@core/elements/display/AddressDetailsView';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const UserDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchUser(itemId);

  const {user: userPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const getUserTypeName = (userType: number) => {
    switch (String(userType)) {
      case UserTypes.SYSTEM_USER:
        return messages['user.type.system'];
      case UserTypes.ORGANIZATION_USER:
        return messages['user.type.organization'];
      case UserTypes.INSTITUTE_USER:
        return messages['user.type.institute'];
      case UserTypes.INDUSTRY_ASSOCIATION_USER:
        return messages['user.type.industry_association'];
      case UserTypes.MINISTRY_USER:
        return messages['user.type.ministry'];
      default:
        return '';
    }
  };

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconRole />
            <IntlMessages id='user.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {userPermission.canUpdate && itemData && (
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
              label={messages['common.name']}
              value={itemData?.name}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.name_en']}
              value={itemData?.name_en}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['user.username']}
              value={itemData?.username}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.email']}
              value={itemData?.email}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['user.user_type']}
              value={getUserTypeName(itemData?.user_type)}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['role.label']}
              value={itemData?.role_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['role.label_en']}
              value={itemData?.role_title_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={5}>
              <AddressDetailsView
                itemData={itemData}
                isLoading={isLoading}
                showAddress={false}
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
          {itemData && itemData.institute_id ? (
            itemData?.training_center_id ? (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['user.user_type']}
                  value={messages['user.training_center_user']}
                  isLoading={isLoading}
                />
              </Grid>
            ) : itemData?.branch_id ? (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['user.user_type']}
                  value={messages['user.branch_user']}
                  isLoading={isLoading}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['user.user_type']}
                  value={messages['user.institute_user']}
                  isLoading={isLoading}
                />
              </Grid>
            )
          ) : (
            <></>
          )}
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default UserDetailsPopup;
