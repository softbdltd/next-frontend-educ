import React, {useCallback, useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useFetchPermission} from '../../../services/userManagement/hooks';
import IconPermission from '../../../@core/icons/IconPermission';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {PermissionMethodsKeyByLabel} from '../../../@core/utilities/Permission';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const PermissionDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchPermission(itemId);
  const {permission: permissionPagePermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const getPermissionMethodName = useCallback(
    (permissionMethodKey: number | string) => {
      if (permissionMethodKey == PermissionMethodsKeyByLabel.PUT) {
        return messages['permissions.method_put'];
      } else if (permissionMethodKey == PermissionMethodsKeyByLabel.GET) {
        return messages['permissions.method_get'];
      } else if (permissionMethodKey == PermissionMethodsKeyByLabel.POST) {
        return messages['permissions.method_post'];
      } else if (permissionMethodKey == PermissionMethodsKeyByLabel.PATCH) {
        return messages['permissions.method_patch'];
      } else if (permissionMethodKey == PermissionMethodsKeyByLabel.DELETE) {
        return messages['permissions.method_delete'];
      } else return messages['common.not_found'];
    },
    [],
  );

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconPermission />
            <IntlMessages id='permission.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {itemData && permissionPagePermission.canUpdate ? (
              <EditButton
                variant='contained'
                onClick={() => openEditModal(itemData.id)}
                isLoading={isLoading}
              />
            ) : (
              ''
            )}
          </>
        }>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['common.title_en']}
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
            <DetailsInputView
              label={messages['permission.key']}
              value={itemData?.key}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['permission.module']}
              value={itemData?.module}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['permission.uri']}
              value={itemData?.uri}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailsInputView
              label={messages['permission.method']}
              value={getPermissionMethodName(itemData?.method)}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default PermissionDetailsPopup;
