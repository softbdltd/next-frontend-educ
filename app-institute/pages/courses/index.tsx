import React, {useContext} from 'react';
import InstituteDefaultFrontPage from '../../../@core/layouts/hoc/InstituteDefaultFrontPage';
import PageMeta from '../../../@core/core/PageMeta';
import asyncComponent from '../../../@core/utility/asyncComponent';
import {Grid, Paper} from '@mui/material';
import {H2} from '../../../@core/elements/common';
import {useIntl} from 'react-intl';
import {DomainDetailsContext} from '../../../@core/contexts/domain';

const YouthTrainingPage = asyncComponent(
  () => import('../../../modules/learner/training'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['common.training_courses']}
      />
      <Grid container sx={{maxWidth: '100%'}}>
        <Grid item xs={12} textAlign={'center'}>
          <Paper>
            <H2 py={5}>{messages['apply_liked_course.institute']}</H2>
          </Paper>
        </Grid>
      </Grid>
      <YouthTrainingPage />
    </>
  );
});
