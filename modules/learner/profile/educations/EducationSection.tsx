import {Add} from '@mui/icons-material';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import EducationAddEditPage from './EducationAddEditPage';
import {useFetchEducations} from '../../../../services/learnerManagement/hooks';
import {deleteEducation} from '../../../../services/learnerManagement/EducationService';
import Educations from './Educations';
import CustomParabolaButton from '../component/CustomParabolaButton';
import ContentLayout from '../component/ContentLayout';
import HorizontalLine from '../component/HorizontalLine';
import {Avatar, Box} from '@mui/material';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useDispatch} from 'react-redux';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {FormPopupNotifyEnum} from '../../../../shared/constants/AppEnums';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';
import {styled} from '@mui/material/styles';

const PREFIX = 'EducationSection';

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

const EducationSection = () => {
  const {messages} = useIntl();
  const {successStack} = useNotiStack();
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();
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
    data: educations,
    isLoading,
    mutate: mutateEducations,
  } = useFetchEducations();
  const [isOpenEducationAddEditForm, setIsOpenEducationAddEditForm] =
    useState<boolean>(false);
  const [educationItemId, setEducationItemId] = useState<number | null>(null);
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
  const openEducationAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setEducationItemId(itemId);
      setIsOpenEducationAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );

  const closeEducationAddEditForm = useCallback(() => {
    setEducationItemId(null);
    setIsOpenEducationAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
    updateProfile();
    mutateEducations();
  }, []);

  const deleteEducationItem = async (itemId: number) => {
    let response = await deleteEducation(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='education.label' />}}
        />,
      );
      updateProfile();
      mutateEducations();
    }
  };

  return (
    <StyledBox>
      <span
        id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
        className={classes.visuallyHidden}
        tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}>
        {messages[`common.${focusEl}`]}
      </span>
      {isOpenEducationAddEditForm ? (
        <EducationAddEditPage
          itemId={educationItemId}
          onClose={closeEducationAddEditForm}
        />
      ) : (
        <ContentLayout
          title={messages['education.label']}
          isLoading={isLoading}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['common.add_new_education'] as string}
              icon={<Add />}
              onClick={() => openEducationAddEditForm(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }>
          {!educations || educations?.length == 0 ? (
            <>
              <HorizontalLine />
              <Box sx={{display: 'flex'}}>
                <Avatar aria-hidden={true}>C</Avatar>
                <NoDataFoundComponent
                  messageTextType={'inherit'}
                  sx={{marginLeft: '15px', marginTop: '10px'}}
                />
              </Box>
            </>
          ) : (
            <Educations
              educations={educations || []}
              onEditClick={openEducationAddEditForm}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
              onDeleteClick={(educationId) => {
                (async () => {
                  await deleteEducationItem(educationId);
                })();
              }}
            />
          )}
        </ContentLayout>
      )}
    </StyledBox>
  );
};

export default EducationSection;
