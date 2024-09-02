import React, {useCallback, useEffect, useState} from 'react';
import {Container} from '@mui/material';
import VerifyCodeComponent from './VerifyCodeComponent';
import VerificationMethodComponent from './VerificationMethodComponent';
import {useRouter} from 'next/router';
import {SECONDARY_APP_HEADER_HEIGHT} from '../../@core/common/constants';

const RegistrationVerification = () => {
  const router = useRouter();
  const params = router.query;
  const [isShowVerifyCodeBox, setIsShowVerifyCodeBox] = useState<boolean>(true);
  const [userEmailAndMobile, setUserEmailAndMobile] = useState<any>({});

  const onSendCodeSuccess = useCallback((data: any) => {
    setUserEmailAndMobile(data);
    setIsShowVerifyCodeBox(true);
  }, []);

  useEffect(() => {
    if (params.mobile) {
      setUserEmailAndMobile({mobile: params.mobile});
    } else if (params.email) {
      setUserEmailAndMobile({email: params.email});
    }
  }, [params]);

  return (
    <Container
      sx={{
        display: 'flex',
        height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
      }}>
      {isShowVerifyCodeBox ? (
        <VerifyCodeComponent userEmailAndMobile={userEmailAndMobile} />
      ) : (
        <VerificationMethodComponent onSendSuccess={onSendCodeSuccess} />
      )}
    </Container>
  );
};
export default RegistrationVerification;
