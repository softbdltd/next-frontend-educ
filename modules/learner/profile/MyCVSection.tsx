import {Button, Card, CardContent, Grid} from '@mui/material';
import Image from 'next/image';
import learnerCV from '../../../public/images/learner/classic_cv_image.png';
import React from 'react';
import {useIntl} from 'react-intl';
import {H2, Link} from '../../../@core/elements/common';
import {LINK_FRONTEND_LEARNER_MY_CV} from '../../../@core/common/appLinks';
import {useCustomStyle} from '../../../@core/hooks/useCustomStyle';

const MyCVSection = () => {
  const {messages} = useIntl();
  const result = useCustomStyle();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <H2 sx={{...result.h6}}>{messages['learner_profile.my_cv']}</H2>
          </Grid>
          <Grid item xs={12}>
            <Image src={learnerCV} />
          </Grid>
          <Grid item xs={12} sx={{textAlign: 'center'}}>
            <Link href={LINK_FRONTEND_LEARNER_MY_CV}>
              <Button variant={'contained'} color={'primary'} fullWidth={true}>
                {messages['common.view']}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MyCVSection;
