import CustomParabolaButton from '../component/CustomParabolaButton';
import {Add} from '@mui/icons-material';
import React, {useCallback, useEffect, useState} from 'react';
import JobExperiences from './JobExperiences';
import {useIntl} from 'react-intl';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useFetchYouthJobExperiences} from '../../../../services/learnerManagement/hooks';
import ContentLayout from '../component/ContentLayout';
import HorizontalLine from '../component/HorizontalLine';
import {Avatar, Box} from '@mui/material';
import {deleteJobExperience} from '../../../../services/learnerManagement/JobExperienceService';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useDispatch} from 'react-redux';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {FormPopupNotifyEnum} from '../../../../shared/constants/AppEnums';
import {styled} from '@mui/material/styles';
import JobExperienceAddEditPage from './JobExperienceAddEditPage';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'JobExperienceSection';

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

const JobExperienceSection = () => {
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
    data: jobExperiences,
    isLoading,
    mutate: mutateJobExperiences,
  } = useFetchYouthJobExperiences();
  const [isOpenJobExperienceAddEditForm, setIsOpenJobExperienceAddEditForm] =
    useState<boolean>(false);
  const [jobExperienceId, setJobExperienceId] = useState<number | null>(null);

  const openJobExperienceAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setJobExperienceId(itemId);
      setIsOpenJobExperienceAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );
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
  const closeJobExperienceAddEditForm = useCallback(() => {
    updateProfile();
    mutateJobExperiences();
    setIsOpenJobExperienceAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
  }, []);

  const deleteJobExperienceItem = useCallback(async (itemId: number) => {
    let response = await deleteJobExperience(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='job_experience.label' />}}
        />,
      );
      updateProfile();
      mutateJobExperiences();
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
      {isOpenJobExperienceAddEditForm ? (
        <JobExperienceAddEditPage
          itemId={jobExperienceId}
          onClose={closeJobExperienceAddEditForm}
        />
      ) : (
        <ContentLayout
          title={messages['common.job_experience']}
          isLoading={isLoading}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['learner_profile.add_new_experience'] as string}
              icon={<Add />}
              onClick={() => openJobExperienceAddEditForm(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
              aria-label={`${messages['learner_profile.add_new_experience']} form popup open`}
            />
          }>
          {!jobExperiences || jobExperiences?.length == 0 ? (
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
            <JobExperiences
              jobExperiences={jobExperiences || []}
              onOpenAddEditForm={openJobExperienceAddEditForm}
              onDeleteJobExperience={deleteJobExperienceItem}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          )}
        </ContentLayout>
      )}
    </StyledBox>
  );
};

export default JobExperienceSection;
