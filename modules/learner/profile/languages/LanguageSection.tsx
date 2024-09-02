import {Avatar, Box, Typography} from '@mui/material';
import {Add} from '@mui/icons-material';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import LanguageAddEditPage from './LanguageAddEditPage';
import LanguageProficiencyViewPage from './LanguageProficiencyViewPage';
import CustomParabolaButton from '../component/CustomParabolaButton';
import ContentLayout from '../component/ContentLayout';
import HorizontalLine from '../component/HorizontalLine';
import {useFetchLanguageProficiencies} from '../../../../services/learnerManagement/hooks';
import {YouthLanguageProficiency} from '../../../../services/learnerManagement/typing';
import VerticalLine from '../component/VerticalLine';
import {styled} from '@mui/material/styles';
import {
  Fonts,
  FormPopupNotifyEnum,
  ThemeMode,
} from '../../../../shared/constants/AppEnums';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useDispatch} from 'react-redux';
import {S1} from '../../../../@core/elements/common';
import {useCustomStyle} from '../../../../@core/hooks/useCustomStyle';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'LanguageSection';
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

const LanguageSection = () => {
  const {messages} = useIntl();
  const result = useCustomStyle();
  const [focusEl, setFocusEl] = useState(FormPopupNotifyEnum.FOCUS_NONE);

  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();
  const {
    data: languageProficiencies,
    isLoading,
    mutate: mutateLanguageProficiencies,
  } = useFetchLanguageProficiencies();

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

  const [isOpenLanguageAddEditForm, setIsOpenLanguageAddEditForm] =
    useState<boolean>(false);
  const [isOpenLanguageProficiencyView, setIsOpenLanguageProficiencyView] =
    useState<boolean>(false);
  const [languageId, setLanguageId] = useState<number | null>(null);
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
  const openLanguageAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setLanguageId(itemId);
      setIsOpenLanguageAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );
  const closeLanguageAddEditForm = useCallback(() => {
    setLanguageId(null);
    setIsOpenLanguageAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
    updateProfile();
    mutateLanguageProficiencies();
  }, []);

  const openLanguageProficiencyView = useCallback(() => {
    setIsOpenLanguageProficiencyView(true);
    setFocusEl(FormPopupNotifyEnum.FOCUS_DETAILS_POPUP_OPEN_EL);
  }, []);

  const closeLanguageProficiencyView = useCallback(() => {
    setIsOpenLanguageAddEditForm(false);
    setIsOpenLanguageProficiencyView(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_DETAILS_POPUP_CLOSE_EL);
  }, []);

  return (
    <StyledBox>
      <span
        id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
        className={classes.visuallyHidden}
        tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}>
        {messages[`common.${focusEl}`]}
      </span>
      {isOpenLanguageProficiencyView && (
        <LanguageProficiencyViewPage
          onEdit={openLanguageAddEditForm}
          onClose={closeLanguageProficiencyView}
          languageProficiencies={languageProficiencies}
          mutateLanguageProficiencies={mutateLanguageProficiencies}
        />
      )}
      {isOpenLanguageAddEditForm && (
        <LanguageAddEditPage
          itemId={languageId}
          onClose={closeLanguageAddEditForm}
        />
      )}
      {!isOpenLanguageProficiencyView && !isOpenLanguageAddEditForm && (
        <ContentLayout
          title={messages['language_proficiency.title']}
          isLoading={isLoading}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['language_proficiency.add'] as string}
              icon={<Add />}
              onClick={() => openLanguageAddEditForm(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }>
          <HorizontalLine />
          <Box sx={{display: 'flex'}}>
            <Avatar>L</Avatar>
            <Box sx={{marginLeft: '15px'}}>
              {(!languageProficiencies ||
                languageProficiencies?.length == 0) && (
                <NoDataFoundComponent
                  messageTextType={'inherit'}
                  sx={{marginTop: '10px'}}
                />
              )}
              {languageProficiencies && (
                <React.Fragment>
                  <Box sx={{display: 'flex'}}>
                    {languageProficiencies.map(
                      (language: YouthLanguageProficiency, index: number) => (
                        <React.Fragment key={language.id}>
                          {index != 0 && <VerticalLine />}
                          {/*<TextPrimary text={language.language_title} />*/}
                          <S1
                            sx={{...result.body1}}
                            className={classes.textStyle}>
                            {language.language_title}
                          </S1>
                        </React.Fragment>
                      ),
                    )}
                  </Box>
                  {!Boolean(authUser?.nid_brn_verified_at) ? (
                    <Typography
                      tabIndex={0}
                      variant={'caption'}
                      color={'text.disabled'}>
                      {messages['language_proficiency.view']}
                    </Typography>
                  ) : (
                    <Typography
                      tabIndex={0}
                      variant={'caption'}
                      onClick={() => {
                        openLanguageProficiencyView();
                      }}
                      sx={{cursor: 'pointer'}}>
                      {messages['language_proficiency.view']}
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

export default LanguageSection;
