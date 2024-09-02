import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useDispatch} from 'react-redux';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import ContentLayout from '../component/ContentLayout';
import CustomParabolaButton from '../component/CustomParabolaButton';
import {Edit} from '@mui/icons-material';
import {Box, Grid} from '@mui/material';
import DetailsInputView from '../../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {JobLevel} from '../../../dashboard/jobLists/jobPost/enums/JobPostEnums';
import CareerInfoUpdateForm from './CareerInfoUpdateForm';
import {Body2} from '../../../../@core/elements/common';
import {styled} from '@mui/material/styles';
import {FormPopupNotifyEnum} from '../../../../shared/constants/AppEnums';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'CareerInfoSection';

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
const CareerInfoSection = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const dispatch = useDispatch();
  const authUser = useAuthUser<YouthAuthUser>();
  const [isOpenCareerInfoForm, setIsOpenCareerInfoForm] =
    useState<boolean>(false);
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

  const openCareerInfoForm = useCallback(() => {
    setIsOpenCareerInfoForm(true);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
  }, []);

  const closeCareerInfoForm = useCallback(() => {
    setIsOpenCareerInfoForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
    updateProfile();
  }, []);

  const updateProfile = () => {
    (async () => {
      try {
        const response = await getYouthProfile();
        if (isResponseSuccess(response) && response.data) {
          dispatch({
            type: UPDATE_AUTH_USER,
            payload: getYouthAuthUserObject({...authUser, ...response.data}),
          });
        }
      } catch (error: any) {
        errorStack('Failed to update profile');
      }
    })();
  };

  const getJobLevelText = () => {
    switch (authUser?.job_level) {
      case JobLevel.ENTRY:
        return messages['label.job_level_entry'];
      case JobLevel.MID:
        return messages['label.job_level_mid'];
      case JobLevel.TOP:
        return messages['label.job_level_top'];
      default:
        return '';
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
      {isOpenCareerInfoForm ? (
        <CareerInfoUpdateForm onUpdateFormClose={closeCareerInfoForm} />
      ) : (
        <ContentLayout
          title={messages['learner.career_and_application_info']}
          isLoading={false}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['common.edit_btn'] as string}
              aria-label={`${messages['common.edit_btn']} form popup open`}
              icon={<Edit />}
              onClick={() => openCareerInfoForm()}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }>
          <Box>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Body2 sx={{color: 'green', fontStyle: 'italic'}}>
                  {messages['learner.career_and_application_info_sub_title']}
                </Body2>
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailsInputView
                  label={messages['common.expected_salary']}
                  value={authUser?.expected_salary}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailsInputView
                  label={messages['learner.job_level']}
                  value={getJobLevelText()}
                  isLoading={false}
                />
              </Grid>
            </Grid>
          </Box>
        </ContentLayout>
      )}
    </StyledBox>
  );
};

export default CareerInfoSection;
