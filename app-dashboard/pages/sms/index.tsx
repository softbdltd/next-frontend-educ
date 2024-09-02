import asyncComponent from '../../../@core/utility/asyncComponent';
import PageMeta from '../../../@core/core/PageMeta';
import DashboardPage from '../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';

const SystemUserMessage = asyncComponent(
  () => import('../../../modules/dashboard/sms/SystemUserMessage'),
);
const IndustryAssocUserMessage = asyncComponent(
  () => import('../../../modules/dashboard/sms/IndustryAssocUserMessage'),
);
const InstituteUserMessage = asyncComponent(
  () => import('../../../modules/dashboard/sms/InstituteUserMessage'),
);

export default DashboardPage(() => {
  const {messages} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  return (
    <>
      <PageMeta title={messages['common.message'] as string} />
      {authUser?.isSystemUser ? (
        <SystemUserMessage />
      ) : authUser?.isInstituteUser ? (
        <InstituteUserMessage />
      ) : authUser?.isIndustryAssociationUser ? (
        <IndustryAssocUserMessage />
      ) : (
        <></>
      )}
    </>
  );
});
