import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import clsx from 'clsx';
import React from 'react';
import {useIntl} from 'react-intl';
import ClickableStyledTile from '../../../@core/Tile/ClickableStyledTile';
import {useFetchAppAdminDashboardStatics} from '../../../services/instituteManagement/hooks';

const PREFIX = 'Dashboard';

const classes = {
  card: `${PREFIX}-card`,
  boxItem: `${PREFIX}-boxItem`,
  cardColors: `${PREFIX}-cardColors`,
  cardColor1: `${PREFIX}-cardColor1`,
  cardColor2: `${PREFIX}-cardColor2`,
  cardColor22: `${PREFIX}-cardColor22`,
  cardColor23: `${PREFIX}-cardColor23`,
  cardColor24: `${PREFIX}-cardColor24`,
  cardColor3: `${PREFIX}-cardColor3`,
  cardColor4: `${PREFIX}-cardColor4`,
  cardColor5: `${PREFIX}-cardColor5`,
  cardColor6: `${PREFIX}-cardColor6`,
  cardColor7: `${PREFIX}-cardColor7`,
};
const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.cardColors}`]: {
    height: '100%',
    position: 'relative',
    '&::before, &::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      background: '#fff2',
      borderRadius: 50,
      width: 90,
      height: 90,
      left: -20,
      bottom: -30,
    },
    '&::after': {
      left: -20,
      bottom: -60,
    },
  },

  [`& .${classes.cardColor1}`]: {
    background: '#661687',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor2}`]: {
    background: '#0069BC',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
  [`& .${classes.cardColor22}`]: {
    background: '#00bcb3',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
  [`& .${classes.cardColor23}`]: {
    background: '#6c5d06',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
  [`& .${classes.cardColor24}`]: {
    background: '#d93ade',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor3}`]: {
    background: '#305DF7',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor4}`]: {
    background: '#FD8A4B',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor5}`]: {
    background: '#14017F',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },

  [`& .${classes.cardColor6}`]: {
    background: '#D169E4',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));

// @ts-ignore
const dashStatistics1 = {
  totalRegisteredYouth: 659552,
  skillsServiceProviders: 410,
  officerSensitized: 22245,
  occupation: 238,
  totalSkilledYouth: 297351,
  totalJobOpportunitiesCreated: 234176,
};

const TemporaryStyledTileSection = () => {
  const {formatNumber} = useIntl();
  const {data: dashStatistics} = useFetchAppAdminDashboardStatics();
  return (
    <StyledBox>
      <Grid container className={classes.card} spacing={{xs: 1, md: 2}}>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor1)}
            headerNumber={
              Number(dashStatistics?.total_learner_male_female?.male ?? '0') +
              Number(dashStatistics?.total_learner_male_female?.female ?? '0')
            }
            message={'dashboard.registered_learner'}
            intlMsgValue={formatNumber(
              dashStatistics?.total_learner_male_female?.female ?? '0',
            )}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor2)}
            headerNumber={dashStatistics?.total_skill_service_provider}
            message={'dashboard.skills_service_providers'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor4)}
            headerNumber={dashStatistics?.total_courses}
            message={'common.courses'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor4)}
            headerNumber={dashStatistics?.total_batches}
            message={'menu.batch'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor22)}
            headerNumber={dashStatistics?.total_enrollments}
            message={'dashboard.skilled_learner'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor5)}
            headerNumber={Number(dashStatistics?.learner_career_service_received)}
            message={'dashboard.learner_carrier_service'}
            link={undefined}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor23)}
            headerNumber={Number(dashStatistics?.learner_4IR_skill_received)}
            message={'dashboard.learner_4ir_skill_received2'}
            link={undefined}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor24)}
            headerNumber={Number(dashStatistics?.total_officer_involved)}
            message={'dashboard.officer_sensitized'}
            link={undefined}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={4} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor6)}
            headerNumber={Number(dashStatistics?.total_job_opportunity)}
            message={'dashboard.job_opportunities_created'}
            link={undefined}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default TemporaryStyledTileSection;
