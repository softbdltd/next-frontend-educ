import {Card, CardContent} from '@mui/material';
import React from 'react';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import BasicInfoItemBox from '../feed/components/BasicInfoItemBox';

const ProfileCompleteSignatureMenu = () => {
  const authUser = useAuthUser<YouthAuthUser>();

  return (
    <Card>
      <CardContent>
        <BasicInfoItemBox learnerProfile={authUser} />
      </CardContent>
    </Card>
  );
};

export default ProfileCompleteSignatureMenu;
