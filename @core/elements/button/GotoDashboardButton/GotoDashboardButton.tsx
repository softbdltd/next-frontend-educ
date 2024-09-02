import React, {useCallback} from 'react';
import {ButtonProps} from '@mui/material/Button/Button';
import ButtonSkeleton from '../../display/skeleton/ButtonSkeleton/ButtonSkeleton';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import Router from 'next/router';
import {Dashboard, Person} from '@mui/icons-material';
import {adminDomain, educDomain, learnerDomain} from '../../../common/constants';
import {LINK_FRONTEND_LEARNER_FEED} from '../../../common/appLinks';
import GotoProfileMenu from '../GotoProfileMenu/GotoProfileMenu';
import {useIntl} from 'react-intl';

interface Props extends ButtonProps {}

const GotoDashboardButton = ({className, ...extra}: Props) => {
  const authUser: any = useAuthUser();
  const {messages} = useIntl();

  const onClickButton = useCallback(() => {
    if (authUser && authUser.isYouthUser) {
      Router.push(learnerDomain() + LINK_FRONTEND_LEARNER_FEED);
    } else if (
      authUser?.isSystemUser ||
      authUser?.isInstituteUser ||
      authUser?.isOrganizationUser ||
      authUser?.isIndustryAssociationUser
    ) {
      Router.push(adminDomain());
    } else {
      Router.push(educDomain());
    }
  }, [authUser]);

  return !authUser ? (
    <ButtonSkeleton />
  ) : authUser?.isYouthUser ? (
    <GotoProfileMenu
      onClick={onClickButton}
      buttonText={messages['menu.my_life'] as string}
      icon={<Person />}
      cdapLogout={
        authUser?.learner_auth_source && Number(authUser.learner_auth_source) == 1
      }
    />
  ) : (
    <GotoProfileMenu
      onClick={onClickButton}
      buttonText={messages['menu.dashboard'] as string}
      icon={<Dashboard />}
    />
  );
};

export default React.memo(GotoDashboardButton);
