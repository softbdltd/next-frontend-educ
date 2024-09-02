import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconInstitute from '../../../@core/icons/IconInstitute';
import DecoratedRowStatus from '../../../@core/elements/display/DecoratedRowStatus/DecoratedRowStatus';
import {useFetchInstitute} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {InstituteTypes} from '../../../@core/utilities/InstituteTypes';
import {Link} from '../../../@core/elements/common';
import Typography from '@mui/material/Typography';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import AddressDetailsView from '../../../@core/elements/display/AddressDetailsView';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import BankInfoDetailsView from './BankInfoDetailsView';

type Props = {
  itemId: number;
  onClose: () => void;
  openEditModal: (id: number) => void;
};

const InstituteDetailsPopup = ({itemId, openEditModal, ...props}: Props) => {
  const {messages} = useIntl();
  const {data: itemData, isLoading} = useFetchInstitute(itemId);
  const authUser = useAuthUser<CommonAuthUser>();
  const {institute: institutePermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  return (
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        title={
          <>
            <IconInstitute />
            <IntlMessages id='institute.label' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {institutePermission.canUpdate && (
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
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.email']}
              value={itemData?.email}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.code']}
              value={itemData?.code}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.phone']}
              value={itemData?.primary_phone}
              isLoading={isLoading}
            />
          </Grid>
          {itemData?.phone_numbers &&
            Array.isArray(itemData.phone_numbers) &&
            itemData.phone_numbers.map((phone: any, index: any) => {
              return (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <DetailsInputView
                    label={messages['common.phone'] + ' #' + (index + 1)}
                    value={phone}
                    isLoading={isLoading}
                  />
                </Grid>
              );
            })}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.mobile']}
              value={itemData?.primary_mobile}
              isLoading={isLoading}
            />
          </Grid>
          {itemData?.mobile_numbers &&
            Array.isArray(itemData.mobile_numbers) &&
            itemData.mobile_numbers.map((mobile: any, index: any) => {
              return (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <DetailsInputView
                    label={messages['common.mobile_en'] + ' #' + (index + 1)}
                    value={mobile}
                    isLoading={isLoading}
                  />
                </Grid>
              );
            })}
          <Grid item xs={12}>
            <Grid container spacing={5}>
              <AddressDetailsView itemData={itemData} isLoading={isLoading} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['institute.type']}
              value={
                itemData?.institute_type_id == InstituteTypes.GOVERNMENT
                  ? messages['common.government']
                  : messages['common.non_government']
              }
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.google_map_src']}
              value={itemData?.google_map_src}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.has_Payment_enabled']}
              value={
                itemData?.is_payment_enabled === 1
                  ? messages['common.yes']
                  : messages['common.no']
              }
              isLoading={isLoading}
            />
          </Grid>

          {authUser?.userId === 1 && (
            <Grid item xs={12} sm={6} md={6}>
              <DetailsInputView
                label={messages['common.challan_code']}
                value={itemData?.challan_code ?? ''}
                isLoading={isLoading}
              />
            </Grid>
          )}
          {authUser?.userId === 1 && (
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <BankInfoDetailsView
                  itemData={itemData?.institute_payment_account_info}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.status']}
              value={<DecoratedRowStatus rowStatus={itemData?.row_status} />}
              isLoading={isLoading}
            />
          </Grid>
          {itemData?.user_manual_path && (
            <Grid item xs={12} sm={6} md={6}>
              <Link
                href={
                  FILE_SERVER_FILE_VIEW_ENDPOINT + itemData?.user_manual_path
                }
                passHref={true}
                target={'_blank'}
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                }}>
                <Typography sx={{marginTop: '30px'}}>
                  {messages['common.user_manual']}
                </Typography>
              </Link>
            </Grid>
          )}
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};
export default InstituteDetailsPopup;
