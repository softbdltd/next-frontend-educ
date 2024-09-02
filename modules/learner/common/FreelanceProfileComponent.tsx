import {
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import * as _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {H2} from '../../../@core/elements/common';
import {useCustomStyle} from '../../../@core/hooks/useCustomStyle';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import FreelanceProfileStatus from '../../../@core/utilities/FreelanceProfileStatus';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {updateYouthFreelanceProfileStatus} from '../../../services/learnerManagement/YouthService';
import {Fonts, ThemeMode} from '../../../shared/constants/AppEnums';

const PREFIX = 'FreelanceProfileComponent';

const classes = {
  textStyle: `${PREFIX}-textStyle`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.textStyle}`]: {
    color:
      theme.palette.mode === ThemeMode.DARK
        ? theme.palette.common.white
        : theme.palette.common.black,
    fontWeight: Fonts.BOLD,
  },
}));

const FreelanceProfileComponent = () => {
  const {messages} = useIntl();
  const result = useCustomStyle();
  const {successStack} = useNotiStack();
  const authUser = useAuthUser<YouthAuthUser>();

  const [isSentVerificationAPI, setIsSentVerificationAPI] = useState(false);

  if (isSentVerificationAPI) {
    setIsSentVerificationAPI(false);
  }

  const [freelanceProfileStatus, setFreelanceProfileStatus] =
    useState<number>(0);

  useEffect(() => {
    if (authUser) {
      setFreelanceProfileStatus(authUser.is_freelance_profile);
    }
  }, [authUser]);

  const debounceFn = useCallback(_.debounce(handleDebounce, 500), []);

  async function handleDebounce(data: any) {
    try {
      const response = await updateYouthFreelanceProfileStatus(data);
      if (isResponseSuccess(response)) {
        setFreelanceProfileStatus(data.is_freelance_profile);
        successStack(
          <IntlMessages
            id='common.subject_updated_successfully'
            values={{subject: <IntlMessages id='common.freelance_profile' />}}
          />,
        );
      }
    } catch (error) {}
  }

  const handleFreelanceProfileStatusChange = (event: any) => {
    const status = event.target.checked
      ? FreelanceProfileStatus.YES
      : FreelanceProfileStatus.NO;
    const data: any = {};
    data.is_freelance_profile = status;
    debounceFn(data);
  };

  return (
    <StyledCard>
      <CardContent>
        <H2
          sx={{
            ...result.h6,
          }}
          className={classes.textStyle}>
          {messages['common.freelance_profile']}
        </H2>
        <Typography variant={'body2'}>
          {messages['learner_profile.freelance_profile_turing_on_hint']}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              color={'primary'}
              aria-label={messages['common.freelance_profile'] as string}
              onChange={handleFreelanceProfileStatusChange}
              checked={freelanceProfileStatus == FreelanceProfileStatus.YES}
            />
          }
          label=''
        />
      </CardContent>
    </StyledCard>
  );
};

export default FreelanceProfileComponent;
