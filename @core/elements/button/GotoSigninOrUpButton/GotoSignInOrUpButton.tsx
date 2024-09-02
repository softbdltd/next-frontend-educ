import React from 'react';
import {ButtonProps} from '@mui/material/Button/Button';
import {Person} from '@mui/icons-material';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import GotoSignInOrUpMenu from '../GotoSignInOrUpMenu/GotoSignInOrUpMenu';
import {LINK_SIGNUP} from '../../../common/appLinks';
import {gotoLoginSignUpPage} from '../../../common/constants';

interface Props extends ButtonProps {}

const GotoSignInOrUpButton = ({className, ...extra}: Props) => {
  const {messages} = useIntl();
  const router = useRouter();

  const onClickButton = () => {
    router.push(gotoLoginSignUpPage(LINK_SIGNUP));
  };

  return (
    <GotoSignInOrUpMenu
      onClick={onClickButton}
      buttonText={messages['common.registration'] as string}
      icon={<Person />}
    />
  );
};

export default React.memo(GotoSignInOrUpButton);
