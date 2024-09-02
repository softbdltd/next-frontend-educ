import React from 'react';
import {Box, Button, Chip, Grid, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {H6} from '../../../../../@core/elements/common';
import {useIntl} from 'react-intl';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CallIcon from '@mui/icons-material/Call';
import CardMediaImageView from '../../../../../@core/elements/display/ImageView/CardMediaImageView';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const PREFIX = 'CompleteJob';

const classes = {
  image: `${PREFIX}-image`,
};
const StyledGrid = styled(Grid)(() => {
  return {
    [`& .${classes.image}`]: {
      borderRadius: '100px',
      height: '120px',
      width: '120px',
    },
  };
});

const CompleteJobPost = ({jobId, onBack, onContinue, setLatestStep}: Props) => {
  const {messages} = useIntl();
  return (
    <StyledGrid container spacing={3}>
      <Grid item xs={12} mt={2} display={'flex'} justifyContent={'center'}>
        <CardMediaImageView
          className={classes.image}
          image={'/images/done.jpeg'}
          alt={'Completed'}
        />
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}>
        <H6>{messages['common.job_posting_successful']}</H6>
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}>
        <Typography align={'center'}>
          {messages['common.job_posting_test']}
        </Typography>
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}>
        <H6 sx={{marginRight: '10px'}}>{messages['common.job_status']}:</H6>
        <Chip
          icon={<ReportProblemIcon />}
          label={messages['common.pending']}
          color={'warning'}
          size={'medium'}
        />
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}>
        <Box>
          <Button
            startIcon={'৳'}
            variant={'contained'}
            sx={{marginRight: '5px'}}>
            {messages['common.pay_now']}
          </Button>
          <Button startIcon={<FindInPageIcon />} variant={'outlined'}>
            {messages['common.view_job']}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}>
        <Box
          sx={{backgroundColor: '#d9edf7', width: '75%', height: '35px'}}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}>
          <Typography align={'center'}>
            {messages['common.customer_support']}:
          </Typography>
          <CallIcon />
          <Typography>0961283833</Typography>
        </Box>
      </Grid>
    </StyledGrid>
  );
};

export default CompleteJobPost;
