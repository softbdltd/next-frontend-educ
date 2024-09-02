import {Card, Grid} from '@mui/material';
import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';

const StatisticConfigDetails: FC<any> = ({
  itemData,
  isLoading,
  isSubmitting,
  setIsEdit,
}: any) => {
  const {messages} = useIntl();

  return (
    <Card sx={{p: 3}}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            value={itemData?.dashboard_officer_involved}
            label={messages['dashboard.officer_sensitized']}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            value={itemData?.dashboard_job_opportunity}
            label={messages['dashboard.job_opportunities_created']}
            isLoading={isLoading}
          />
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            value={itemData?.dashboard_career_service_received}
            label={messages['dashboard.learner_carrier_service']}
            isLoading={isLoading}
          />
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={6}>
          <DetailsInputView
            value={itemData?.dashboard_4IR_skill_received}
            label={messages['dashboard.learner_4ir_skill_received']}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item sx={{gap: '20px', display: 'flex'}}>
          <SubmitButton
            isSubmitting={isSubmitting}
            isLoading={isLoading}
            label={messages['common.update']}
            onClick={() => setIsEdit(true)}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
export default StatisticConfigDetails;
