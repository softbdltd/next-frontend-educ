import ClickableStyledTile from '../../../@core/Tile/ClickableStyledTile';
import {Box, Grid} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import clsx from 'clsx';
import {styled} from '@mui/material/styles';
import {IDashboardStatistics} from '../../../shared/Interface/dashboard.interface';
import {useFetchDashboardStatistics} from '../../../services/global/hooks';
import {useIntl} from 'react-intl';
import {
  LINK_APPLICATION_MANAGEMENT,
  LINK_BATCHES,
  LINK_CERTIFICATE_ISSUED,
  LINK_COURSES,
  LINK_HUMAN_RESOURCE_DEMAND,
  LINK_TRAINERS,
} from '../../../@core/common/appLinks';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

const PREFIX = 'Dashboard';

const classes = {
  card: `${PREFIX}-card`,
  boxItem: `${PREFIX}-boxItem`,
  cardColors: `${PREFIX}-cardColors`,
  cardColor1: `${PREFIX}-cardColor1`,
  cardColor2: `${PREFIX}-cardColor2`,
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

  [`& .${classes.cardColor7}`]: {
    background: '#22BB33',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));
const StyledTileSection = () => {
  const {formatNumber} = useIntl();

  const [dashStatistics, setDashStatistics] = useState<IDashboardStatistics>();
  let {data: statistics} = useFetchDashboardStatistics();
  const {
    course,
    certificate_issued,
    batch,
    course_enrollment,
    trainer,
    institute_hr_demand,
  } = useContext<PermissionContextPropsType>(PermissionContext);

  useEffect(() => {
    setDashStatistics(statistics);
  }, [statistics]);

  return (
    <StyledBox>
      <Grid container className={classes.card} spacing={2}>
        <Grid item xs={4} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor1)}
            headerNumber={dashStatistics?.total_course}
            message={'dashboard.total_course'}
            link={course.canReadAll ? LINK_COURSES : undefined}
          />
        </Grid>
        <Grid item xs={4} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor2)}
            headerNumber={dashStatistics?.total_running_course}
            message={'dashboard.running_course'}
            link={
              course.canReadAll
                ? {
                    pathname: LINK_COURSES,
                    query: {availability: 1},
                  }
                : undefined
            }
          />
        </Grid>
        <Grid item xs={4} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor3)}
            headerNumber={dashStatistics?.total_running_batch}
            message={'common.running_batch'}
            link={
              batch.canReadAll
                ? {
                    pathname: LINK_BATCHES,
                    query: {availability: 1},
                  }
                : undefined
            }
          />
        </Grid>
        <Grid item xs={4} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor4)}
            headerNumber={dashStatistics?.total_enrollments}
            message={'dashboard.total_enrollments'}
            link={
              course_enrollment.canReadAll
                ? LINK_APPLICATION_MANAGEMENT
                : undefined
            }
          />
        </Grid>
        <Grid item xs={4} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor5)}
            headerNumber={dashStatistics?.total_issued_certificate}
            message={'dashboard.total_issued_certificate'}
            link={
              certificate_issued.canReadAll
                ? LINK_CERTIFICATE_ISSUED
                : undefined
            }
          />
        </Grid>
        <Grid item xs={4} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor6)}
            headerNumber={dashStatistics?.total_trainers}
            message={'dashboard.total_trainers'}
            link={trainer.canReadAll ? LINK_TRAINERS : undefined}
          />
        </Grid>
        <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor7)}
            headerNumber={dashStatistics?.total_demand_from_industry}
            message={'dashboard.total_skills_service_provider'}
            link={
              institute_hr_demand.canReadAll
                ? LINK_HUMAN_RESOURCE_DEMAND
                : undefined
            }
          />
        </Grid>
        <Grid item xs={6} md={3} sm={3} className={classes.boxItem}>
          <ClickableStyledTile
            className={clsx(classes.cardColors, classes.cardColor1)}
            headerNumber={`${formatNumber(
              dashStatistics?.total_learner_male_female?.male || (0 as number),
            )}/${formatNumber(
              dashStatistics?.total_learner_male_female?.female || (0 as number),
            )}`}
            message={'dashboard.total_male_female'}
            link={
              course_enrollment.canReadAll
                ? LINK_APPLICATION_MANAGEMENT
                : undefined
            }
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default StyledTileSection;
