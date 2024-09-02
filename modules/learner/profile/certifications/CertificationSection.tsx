import {Add} from '@mui/icons-material';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import CertificateAddEditPage from './CertificateAddEditPage';
import {deleteCertificate} from '../../../../services/learnerManagement/CertificateService';
import {useFetchYouthCertificates} from '../../../../services/learnerManagement/hooks';
import ContentLayout from '../component/ContentLayout';
import CustomParabolaButton from '../component/CustomParabolaButton';
import Certifications from './Certifications';
import HorizontalLine from '../component/HorizontalLine';
import {Avatar, Box} from '@mui/material';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {useDispatch} from 'react-redux';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {styled} from '@mui/material/styles';
import {FormPopupNotifyEnum} from '../../../../shared/constants/AppEnums';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'CertificationSection';

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
const CertificationSection = () => {
  const {messages} = useIntl();
  const {successStack} = useNotiStack();
  const dispatch = useDispatch();
  const authUser = useAuthUser<YouthAuthUser>();
  const [isOpenCertificateAddEditForm, setIsOpenCertificateAddEditForm] =
    useState<boolean>(false);
  const [certificateItemId, setCertificateItemId] = useState<number | null>(
    null,
  );
  const [focusEl, setFocusEl] = useState(FormPopupNotifyEnum.FOCUS_NONE);

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

  const {
    data: certificates,
    isLoading,
    mutate: mutateCertifications,
  } = useFetchYouthCertificates();

  const openCertificateAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setCertificateItemId(itemId);
      setIsOpenCertificateAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );

  const closeCertificateAddEditForm = useCallback(() => {
    setCertificateItemId(null);
    setIsOpenCertificateAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
    mutateCertifications();
    updateProfile();
  }, []);

  const updateProfile = () => {
    (async () => {
      const response = await getYouthProfile();
      /*      console.log('response-----', response);*/
      if (isResponseSuccess(response) && response.data) {
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: getYouthAuthUserObject({...authUser, ...response.data}),
        });
      }
    })();
  };

  const deleteCertificationItem = useCallback(async (itemId: number) => {
    let response = await deleteCertificate(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='certificate.label' />}}
        />,
      );
      updateProfile();
      mutateCertifications();
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
      {isOpenCertificateAddEditForm ? (
        <CertificateAddEditPage
          itemId={certificateItemId}
          onClose={closeCertificateAddEditForm}
        />
      ) : (
        <ContentLayout
          title={messages['common.certificate']}
          isLoading={isLoading}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['common.add_new_certificate'] as string}
              icon={<Add />}
              onClick={() => openCertificateAddEditForm(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }>
          {!certificates || certificates?.length == 0 ? (
            <>
              <HorizontalLine />
              <Box aria-hidden={true}  sx={{display: 'flex'}}>
                <Avatar aria-hidden={true}>C</Avatar>
                <NoDataFoundComponent
                  messageTextType={'inherit'}
                  sx={{marginLeft: '15px', marginTop: '10px'}}
                />
              </Box>
            </>
          ) : (
            <Certifications
              certificates={certificates}
              onEditClick={openCertificateAddEditForm}
              onDeleteClick={deleteCertificationItem}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          )}
        </ContentLayout>
      )}
    </StyledBox>
  );
};
export default CertificationSection;
