import {Avatar, Box, Typography} from '@mui/material';
import {Add} from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from "react";
import {useIntl} from 'react-intl';
import GuardianAddEditPage from './GuardianAddEditPage';
import GuardianViewPage from './GuardianViewPage';
import CustomParabolaButton from '../component/CustomParabolaButton';
import ContentLayout from '../component/ContentLayout';
import HorizontalLine from '../component/HorizontalLine';
import {Guardian} from '../../../../services/learnerManagement/typing';
import VerticalLine from '../component/VerticalLine';
import {styled} from '@mui/material/styles';
import { Fonts, FormPopupNotifyEnum, ThemeMode } from "../../../../shared/constants/AppEnums";
import {S1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {useDispatch} from 'react-redux';
import { FORM_POPUP_CLOSE_OPEN_EL_ID } from "../../../../shared/constants/AppConst";

const PREFIX = 'GuardianSection';
const classes = {
  textStyle: `${PREFIX}-textStyle`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.textStyle}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
    fontWeight: Fonts.BOLD,
  },
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

const GuardianSection = () => {
  const {messages} = useIntl();
  const result = useCustomStyle();
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();

  const [isOpenGuardianAddEditForm, setIsOpenGuardianAddEditForm] =
    useState<boolean>(false);
  const [isOpenGuardianView, setIsOpenGuardianView] = useState<boolean>(false);
  const [guardianId, setGuardianId] = useState<number | null>(null);
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

  const openGuardianAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setGuardianId(itemId);
      setIsOpenGuardianAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );
  const closeGuardianAddEditForm = useCallback(() => {
    updateProfile();
    setGuardianId(null);
    setIsOpenGuardianAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
  }, []);

  const openGuardianView = useCallback(() => {
    setIsOpenGuardianView(true);
    setFocusEl(FormPopupNotifyEnum.FOCUS_DETAILS_POPUP_OPEN_EL);
  }, []);

  const closeGuardianView = useCallback(() => {
    setIsOpenGuardianAddEditForm(false);
    setIsOpenGuardianView(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_DETAILS_POPUP_CLOSE_EL);
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

  return (
    <StyledBox>
      <span
        id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
        className={classes.visuallyHidden}
        tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}
      >
        {messages[`common.${focusEl}`]}
      </span>
      {isOpenGuardianView && (
        <GuardianViewPage
          onEdit={openGuardianAddEditForm}
          onClose={closeGuardianView}
          guardians={authUser?.guardians}
          updateProfile={updateProfile}
        />
      )}
      {isOpenGuardianAddEditForm && (
        <GuardianAddEditPage
          itemId={guardianId}
          onClose={closeGuardianAddEditForm}
        />
      )}
      {!isOpenGuardianView && !isOpenGuardianAddEditForm && (
        <ContentLayout
          title={messages['guardian.title']}
          isLoading={!authUser}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['guardian.add'] as string}
              aria-label={`${messages['guardian.add']} form popup open`}
              icon={<Add />}
              onClick={() => openGuardianAddEditForm(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }>
          <HorizontalLine />
          <Box sx={{display: 'flex'}}>
            <Avatar>G</Avatar>
            <Box sx={{marginLeft: '15px'}}>
              {!authUser?.guardians || authUser?.guardians?.length == 0 ? (
                <NoDataFoundComponent
                  messageTextType={'inherit'}
                  sx={{marginTop: '10px'}}
                />
              ) : (
                <React.Fragment>
                  <Box sx={{display: 'flex'}}>
                    {authUser?.guardians.map((guardian: Guardian, index: number) => (
                      <React.Fragment key={guardian.id}>
                        {index != 0 && <VerticalLine />}
                        <S1
                          sx={{...result.body1}}
                          className={classes.textStyle}>
                          {guardian.name}
                        </S1>
                      </React.Fragment>
                    ))}
                  </Box>
                  {!Boolean(authUser?.nid_brn_verified_at) ? (
                    <Typography
                      tabIndex={0}
                      variant={'caption'}
                      color={'text.disabled'}>
                      {messages['guardian.view']}
                    </Typography>
                  ) : (
                    <Typography
                      tabIndex={0}
                      variant={'caption'}
                      onClick={() => {
                        openGuardianView();
                      }}
                      sx={{cursor: 'pointer'}}>
                      {messages['guardian.view']}
                    </Typography>
                  )}
                </React.Fragment>
              )}
            </Box>
          </Box>
        </ContentLayout>
      )}
    </StyledBox>
  );
};

export default GuardianSection;
