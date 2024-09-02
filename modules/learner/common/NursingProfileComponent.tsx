import {Button, Card, CardContent, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {LINK_FRONTEND_INSTITUTE_CIRCULAR} from '../../../@core/common/appLinks';
import {dgnmDomain} from '../../../@core/common/constants';
import {H2} from '../../../@core/elements/common';
import {useCustomStyle} from '../../../@core/hooks/useCustomStyle';
import RowStatus from '../../../@core/utilities/RowStatus';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {Fonts, ThemeMode} from '../../../shared/constants/AppEnums';
import NursingVerifyPopUp from './NursingVerifyPopUp';
import RemarkModal from './RemarkModal';

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

const NursingProfileComponent = () => {
  const router = useRouter();
  const {messages} = useIntl();
  const result = useCustomStyle();
  const authUser = useAuthUser<YouthAuthUser>();
  const [isOpenVerificationModal, setIsOpenVerificationModal] = useState(false);
  const [isOpenRemark, setIsOpenRemark] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [isSentVerificationAPI, setIsSentVerificationAPI] = useState(false);

  useEffect(() => {
    if (authUser) {
      setVerificationStatus(authUser?.nurse_status);
    }
  }, [authUser]);

  if (isSentVerificationAPI) {
    setIsSentVerificationAPI(false);
  }

  const openVerificationModal = () => {
    setIsOpenVerificationModal(true);
  };

  const closeVerificationModal = () => {
    setIsOpenVerificationModal(false);
  };

  const openRemarkModal = () => {
    setIsOpenRemark(true);
  };

  const closeRemarkModal = () => {
    setIsOpenRemark(false);
  };

  const getStatusLabel = (status: number | null) => {
    switch (Number(status)) {
      case 1:
        return messages['common.verified'];
      case 2:
        return messages['common.pending'];
      case 3:
        return messages['common.retry'];
      default:
        return messages['common.verify'];
    }
  };

  return (
    <>
      <StyledCard sx={{position: 'relative'}}>
        <CardContent>
          <H2
            sx={{
              mt: '20px',
              ...result.h6,
            }}
            className={classes.textStyle}>
            {messages['common.nursing_profile']}
          </H2>
          {verificationStatus == RowStatus.REJECT && (
            <Button
              onClick={openRemarkModal}
              sx={{position: 'absolute', right: 0, top: 0}}
              size={'small'}
              variant={'contained'}
              color={'primary'}>
              {messages['common.rejected']}
            </Button>
          )}

          <Typography variant={'body2'}>
            {verificationStatus == RowStatus.ACTIVE
              ? messages['common.nurse_id'] +
                ': ' +
                authUser?.learner_nurse?.nurse_number
              : messages['learner_profile.nursing_profile_turing_on_hint']}
          </Typography>
          <Button
            onClick={openVerificationModal}
            sx={{mt: 2}}
            variant={'contained'}
            color={'primary'}
            fullWidth={true}
            disabled={
              verificationStatus == RowStatus.ACTIVE ||
              verificationStatus == RowStatus.PENDING
            }>
            {getStatusLabel(verificationStatus)}
          </Button>
          {verificationStatus == RowStatus.ACTIVE && (
            <Button
              onClick={() =>
                router.push(dgnmDomain() + LINK_FRONTEND_INSTITUTE_CIRCULAR)
              }
              sx={{mt: 2}}
              variant={'contained'}
              color={'primary'}
              fullWidth={true}>
              {messages['common.show_circular']}
            </Button>
          )}
        </CardContent>
      </StyledCard>

      {isOpenVerificationModal && (
        <NursingVerifyPopUp
          onClose={closeVerificationModal}
          setVerificationStatus={setVerificationStatus}
          setIsSentVerificationAPI={setIsSentVerificationAPI}
        />
      )}
      {isOpenRemark && (
        <RemarkModal
          onClose={closeRemarkModal}
          content={authUser?.learner_nurse?.remarks || ''}
        />
      )}
    </>
  );
};

export default NursingProfileComponent;
