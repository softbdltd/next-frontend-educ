import {useIntl} from 'react-intl';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useDispatch} from 'react-redux';
import {useFetchYouthAddresses} from '../../../../services/learnerManagement/hooks';
import React, {useCallback, useEffect, useState} from 'react';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {deleteAddressItem} from '../../../../services/learnerManagement/AddressService';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import AddressAddEditPage from './addressAddEditPage';
import ContentLayout from '../component/ContentLayout';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {Add} from '@mui/icons-material';
import HorizontalLine from '../component/HorizontalLine';
import {Avatar, Box, Typography} from '@mui/material';
import AddressViewPage from './addressViewPage';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {styled} from '@mui/material/styles';
import {FormPopupNotifyEnum} from '../../../../shared/constants/AppEnums';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'AddressSection';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));
const AddressSection = () => {
  const {messages} = useIntl();
  const {successStack} = useNotiStack();
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();
  const [focusEl, setFocusEl] = useState(FormPopupNotifyEnum.FOCUS_NONE);

  const [addressFilter] = useState({});
  const [isOpenAddressAddEditForm, setIsOpenAddressAddEditForm] =
    useState<boolean>(false);
  const [addressId, setAddressId] = useState<number | null>(null);

  const {
    data: addresses,
    isLoading,
    mutate: mutateAddresses,
  } = useFetchYouthAddresses(addressFilter);

  useEffect(() => {
    if (focusEl !== FormPopupNotifyEnum.FOCUS_NONE) {
      let activeStepEl = document.getElementById(
        PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID,
      );
      if (activeStepEl) {
        activeStepEl.focus();
      }
    }
  }, [focusEl]);

  const openAddressAddEditFrom = useCallback((itemId: number | null = null) => {
    setAddressId(itemId);
    setIsOpenAddressAddEditForm(true);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
  }, []);

  const closeAddressAddEditFrom = useCallback(() => {
    updateProfile();
    mutateAddresses();
    setIsOpenAddressAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
  }, []);

  const updateProfile = () => {
    (async () => {
      const response = await getYouthProfile();
      if (isResponseSuccess(response) && response.data) {
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: getYouthAuthUserObject({...authUser, ...response.data}),
        });
      }
    })();
  };

  const deleteAddress = useCallback(async (itemId: number) => {
    let response = await deleteAddressItem(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='address.label' />}}
        />,
      );
      updateProfile();
      mutateAddresses();
    }
  }, []);

  return (
    <StyledBox>
      <span
        id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
        className={classes.visuallyHidden}
        tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}>
        {messages[`common.${focusEl}`]}
      </span>
      {isOpenAddressAddEditForm ? (
        <AddressAddEditPage
          itemId={addressId}
          onClose={closeAddressAddEditFrom}
        />
      ) : (
        <ContentLayout
          title={messages['common.address_section']}
          isLoading={isLoading}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['label.new_address'] as string}
              aria-label={`${messages['label.new_address']} form popup open`}
              icon={<Add />}
              onClick={() => openAddressAddEditFrom(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }>
          {!addresses || addresses?.length == 0 ? (
            <>
              <HorizontalLine />
              <Box sx={{display: 'flex'}}>
                <Avatar aria-hidden={true}>T</Avatar>
                <Typography style={{marginLeft: '15px'}}>
                  <NoDataFoundComponent
                    messageType={messages['address.label']}
                    messageTextType={'inherit'}
                  />
                </Typography>
              </Box>
            </>
          ) : (
            <AddressViewPage
              addresses={authUser?.addresses || []}
              onOpenAddEditForm={openAddressAddEditFrom}
              onDeleteAddress={deleteAddress}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          )}
        </ContentLayout>
      )}
    </StyledBox>
  );
};

export default AddressSection;
