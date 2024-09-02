import React from 'react';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {styled} from '@mui/material/styles';
import {Button, Grid, Box, Typography} from '@mui/material';
import {ArrowBack} from '@mui/icons-material';
import {useFetchSmartCareerFair} from '../../../services/instituteManagement/hooks';
import PageBlock from '../../../@core/utilities/PageBlock';
import IconExam from '../../../@core/icons/IconExam';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';

const PREFIX = 'SmartCareerFairDetails';
const classes = {
  BlueBoxTypo: `${PREFIX}-BlueBoxTypo`,
  BlueBoxNum: `${PREFIX}-BlueBoxNum`,
};
const StyledBox = styled(Box)(({theme}) => ({
  backgroundColor: '#0080ff',
  padding: 6,
  marginBottom: 6,

  [`& .${classes.BlueBoxTypo}`]: {
    // paddingLeft: '10px',
    fontSize: '1.125rem',
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
  },

  [`& .${classes.BlueBoxNum}`]: {
    backgroundColor: 'white',
    borderRadius: '20px',
  },
}));

const SmartJobFairDetailsPage = () => {
  const {formatNumber, formatDate, messages} = useIntl();
  const router = useRouter();
  const fairId = Number(router.query.id);

  const {data: fairData, isLoading: isLoadingFair} =
    useFetchSmartCareerFair(fairId);

  let totalInstitutionWiseJobs = 0;
  for (let i = 0; i < fairData?.job_provider_information.length; i++) {
    totalInstitutionWiseJobs +=
      fairData?.job_provider_information[i].institution_wise_total_job;
  }

  return (
    <>
      <PageBlock
        title={
          <>
            <IconExam />
            {messages['common.smart_job_fair']}
          </>
        }
        extra={[
          <Button
            key={1}
            variant={'contained'}
            color={'primary'}
            size={'small'}
            onClick={() => router.back()}>
            <ArrowBack />
            {messages['common.back']}
          </Button>,
        ]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['menu.division']}
              value={fairData?.division_title}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['menu.district']}
              value={fairData?.district_title}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.parliament_area']}
              value={fairData?.constituency_name}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.date']}
              value={getIntlDateFromString(formatDate, fairData?.fair_date)}
              isLoading={isLoadingFair}
            />
          </Grid>
        </Grid>
        <StyledBox mt={2}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <Typography className={classes.BlueBoxTypo}>
                {messages['common.total_participated_institutions']} :
              </Typography>
            </Grid>
            <Grid item>
              <Box component='span' p={1} className={classes.BlueBoxNum}>
                {formatNumber(fairData?.total_participating_institutions)}
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.govt_institutions']}
              value={formatNumber(fairData?.governmental_institutions)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.entrepreneur_institutions']}
              value={formatNumber(fairData?.entrepreneurship_institutions)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.e_learning_institutions']}
              value={formatNumber(fairData?.e_learning_institutions)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.e_commerce_institutions']}
              value={formatNumber(fairData?.e_commerce_institutions)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.job_providing_institutions']}
              value={formatNumber(fairData?.job_providing_institutions)}
              isLoading={isLoadingFair}
            />
          </Grid>
        </Grid>
        <StyledBox mt={2}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <Typography className={classes.BlueBoxTypo}>
                {messages['common.job_demand']} :
              </Typography>
            </Grid>
            <Grid item>
              <Box component='span' p={1} className={classes.BlueBoxNum}>
                {formatNumber(fairData?.total_jobs_demand)}
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.on_spot_demand']}
              value={formatNumber(fairData?.on_spot_jobs_demand)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.online_job_platform']}
              value={formatNumber(fairData?.online_jobs_demand)}
              isLoading={isLoadingFair}
            />
          </Grid>
        </Grid>
        <StyledBox mt={2}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <Typography className={classes.BlueBoxTypo}>
                {messages['common.learner_registration_for_fair']} :
              </Typography>
            </Grid>
            <Grid item>
              <Box component='span' p={1} className={classes.BlueBoxNum}>
                {formatNumber(fairData?.total_fair_registered_learners)}
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <DetailsInputView
              label={messages['common.online_registered_male']}
              value={formatNumber(fairData?.online_registered_males)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DetailsInputView
              label={messages['common.online_registered_female']}
              value={formatNumber(fairData?.online_registered_females)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DetailsInputView
              label={messages['common.offline_registered_male']}
              value={formatNumber(fairData?.offline_registered_males)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DetailsInputView
              label={messages['common.offline_registered_female']}
              value={formatNumber(fairData?.offline_registered_females)}
              isLoading={isLoadingFair}
            />
          </Grid>
        </Grid>
        <StyledBox mt={2}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <Typography className={classes.BlueBoxTypo}>
                {messages['common.job_providing_info']} :
              </Typography>
            </Grid>
            <Grid item>
              <Box component='span' p={1} className={classes.BlueBoxNum}>
                {formatNumber(fairData?.total_jobs_provided)}
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.cv_submit']}
              value={formatNumber(fairData?.cv_submitted_jobs)}
              isLoading={isLoadingFair}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DetailsInputView
              label={messages['common.on_spot_job_providing_info']}
              value={formatNumber(fairData?.on_spot_jobs)}
              isLoading={isLoadingFair}
            />
          </Grid>
        </Grid>
        <StyledBox mt={2}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <Typography className={classes.BlueBoxTypo}>
                {messages['common.org_job_image']} :
              </Typography>
            </Grid>
            <Grid item>
              <Box component='span' p={1} className={classes.BlueBoxNum}>
                {formatNumber(totalInstitutionWiseJobs)}
              </Box>
            </Grid>
          </Grid>
        </StyledBox>
        {fairData?.job_provider_information.map((item: any, index: number) => (
          <fieldset style={{marginTop: '10px'}} key={index}>
            <Grid container mb={3} spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.institution_name']}
                  value={item?.job_providing_institution_name}
                  isLoading={isLoadingFair}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}></Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailsInputView
                  label={messages['common.job_demand_registered_male']}
                  value={formatNumber(item?.institution_wise_jobs_demand_males)}
                  isLoading={isLoadingFair}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailsInputView
                  label={messages['common.job_demand_registered_female']}
                  value={formatNumber(
                    item?.institution_wise_jobs_demand_females,
                  )}
                  isLoading={isLoadingFair}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailsInputView
                  label={messages['common.cv_submit_registered_male']}
                  value={formatNumber(item?.institution_wise_cv_submitted_male)}
                  isLoading={isLoadingFair}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailsInputView
                  label={messages['common.cv_submit_registered_female']}
                  value={formatNumber(
                    item?.institution_wise_cv_submitted_female,
                  )}
                  isLoading={isLoadingFair}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.on_spot_job_providing_info']}
                  value={formatNumber(
                    item?.institution_wise_on_spot_job_provider,
                  )}
                  isLoading={isLoadingFair}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DetailsInputView
                  label={messages['common.post_name']}
                  value={item?.institution_wise_on_spot_job_post}
                  isLoading={isLoadingFair}
                />
              </Grid>
            </Grid>
          </fieldset>
        ))}
      </PageBlock>
    </>
  );
};

export default SmartJobFairDetailsPage;
