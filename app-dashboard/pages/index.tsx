import PageMeta from '../../@core/core/PageMeta';
import DashboardPage from '../../@core/layouts/hoc/DashboardPage';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import asyncComponent from '../../@core/utility/asyncComponent';
import {useAuthUser} from '../../@core/utility/AppHooks';
import IndustryAssociationMemberDashboard from '../../modules/dashboard/IndustryAssociationMemberDashboard';
import {CommonAuthUser} from '../../redux/types/models/CommonAuthUser';
import CertificateAuthorityDashboard from '../../modules/dashboard/certificateAuthorityDashboard';
import {InstituteServiceTypes} from '../../@core/utilities/InstituteServiceTypes';
import RtoAuthorityDashboard from '../../modules/dashboard/rtoAuthorityDashboard';
import SMEFDashboard from '../../modules/dashboard/smefDashboard';
import OrganizationDashboard from '../../modules/dashboard/OrganizationDashboard';
import {getSmefId} from '../../@core/utilities/helpers';
import {Box} from '@mui/material';
import PermissionContextPropsType from '../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../@core/contexts/PermissionContext';



const SystemAdminDashboard = asyncComponent(
    () => import('../../modules/dashboard/SystemAdminDashboard'),
);

const DashboardHomePage = asyncComponent(
    () => import('../../modules/dashboard'),
);

export default DashboardPage(() => {
  const {messages} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();

  return (
    <>
      <PageMeta title={messages['menu.dashboard'] as string} />
      { authUser?.isSystemUser ?
          <SystemAdminDashboard />
         :   (
        <DashboardHomePage />
      )}
    </>
  );
});
