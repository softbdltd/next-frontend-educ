import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Card, Container, Grid, Skeleton} from '@mui/material';
import {Fade} from 'react-awesome-reveal';
import InfoCard from './infoCard';
import {H3, Text} from '../../@core/elements/common';
import clsx from 'clsx';
import {useIntl} from 'react-intl';
import {useFetchEducStatics} from '../../services/cmsManagement/hooks';

const PREFIX = 'StatisticsCardSection';

const classes = {
  cardColors: `${PREFIX}-cardColors`,
  cardColor1: `${PREFIX}-cardColor1`,
  cardColor2: `${PREFIX}-cardColor2`,
  cardColor3: `${PREFIX}-cardColor3`,
  cardColor4: `${PREFIX}-cardColor4`,
  cardColor5: `${PREFIX}-cardColor5`,
  cardColor6: `${PREFIX}-cardColor6`,
  cardColor7: `${PREFIX}-cardColor7`,
  triangleDown: `${PREFIX}-triangleDown`,
  infoCardWrapper: `${PREFIX}-infoCardWrapper`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.cardColors}`]: {
    position: 'relative',
    height: '100%',
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

  [`& .${classes.triangleDown}`]: {
    width: '0',
    height: '0',
    borderLeft: '12px solid transparent',
    borderRight: '12px solid transparent',
    borderTop: '18px solid',
    position: 'relative',
    zIndex: 1,
  },

  [`& .${classes.infoCardWrapper}`]: {
    [theme.breakpoints.down('xl')]: {
      marginBottom: '20px',
    },
  },
}));

const StatisticsCardSection = () => {
  const {messages, formatNumber} = useIntl();

  const {data: educStatics, isLoading} = useFetchEducStatics();

  return (
    <StyledBox style={{background: '#f9fdfe'}}>
      <Container maxWidth='lg' style={{background: '#f9fdfe'}}>
        <Fade direction='down'>
          <Grid container spacing={2} style={{marginTop: '60px'}}>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor1)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_ministry ? (
                      educStatics?.total_ministry
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.ministry']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor2)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_department ? (
                      educStatics?.total_department
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.departments']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor4)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_industrial_skills_council ? (
                      educStatics?.total_industrial_skills_council
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.industry_skills_council']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor4)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_deputy_commissioner_office ? (
                      educStatics?.total_deputy_commissioner_office
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.dc_offices']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor3)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_learner ? (
                      educStatics?.total_learner
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.learner_2']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor5)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_4_ir_project ? (
                      educStatics?.total_4_ir_project
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.4IR_projects']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor6)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_rto ? (
                      educStatics?.total_rto
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.rto']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.cardColors, classes.cardColor6)}>
                <H3 style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
                  {formatNumber(
                    isLoading ? (
                      <Skeleton
                        animation='wave'
                        variant='circular'
                        width={40}
                        height={40}
                      />
                    ) : educStatics?.total_industry ? (
                      educStatics?.total_industry
                    ) : (
                      0
                    ),
                  )}
                </H3>
                <Text style={{fontSize: '1.563rem'}}>
                  {messages['common.industries']}
                </Text>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} className={classes.infoCardWrapper}>
              <Card className={classes.cardColor1} style={{padding: '20px'}}>
                {messages['common.job_provider']}
              </Card>
              <Box
                mx={'auto'}
                className={classes.triangleDown}
                sx={{color: '#661687'}}
              />
              <InfoCard
                color={'#661687'}
                infos={(educStatics?.total_job_provider || []).map(
                  (data: any, index: number) => {
                    return {
                      id: index,
                      name: data.industry_associations_title,
                      count: formatNumber(data.total_job_provided),
                    };
                  },
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} className={classes.infoCardWrapper}>
              <Card className={classes.cardColor2} style={{padding: '20px'}}>
                {messages['common.educ_landing_training_center']}
              </Card>
              <Box
                mx={'auto'}
                className={classes.triangleDown}
                sx={{color: '#0069BC'}}
              />
              <InfoCard
                label={messages['common.trained'] as string}
                color={'#0069BC'}
                infos={(educStatics?.total_skill_development_center || []).map(
                  (data: any, index: number) => {
                    return {
                      id: index,
                      name: data.training_center_title,
                      count: formatNumber(data.total_trained),
                    };
                  },
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} className={classes.infoCardWrapper}>
              <Card className={classes.cardColor3} style={{padding: '20px'}}>
                {messages['common.popular_courses']}
              </Card>
              <Box
                mx={'auto'}
                className={classes.triangleDown}
                sx={{color: '#305DF7'}}
              />
              <InfoCard
                label={messages['common.enrolled'] as string}
                color={'#305DF7'}
                infos={(educStatics?.total_popular_courses || []).map(
                  (data: any, index: number) => {
                    return {
                      id: index,
                      name: data.course_title,
                      count: formatNumber(data.total_enrollments),
                    };
                  },
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} className={classes.infoCardWrapper}>
              <Card className={classes.cardColor7} style={{padding: '20px'}}>
                {messages['common.popular_job']}
              </Card>
              <Box
                mx={'auto'}
                className={classes.triangleDown}
                sx={{color: '#22BB33'}}
              />
              <InfoCard
                color={'#22BB33'}
                infos={(educStatics?.total_popular_job || []).map(
                  (data: any, index: number) => {
                    return {
                      id: index,
                      name: data.job_title,
                      count: '',
                    };
                  },
                )}
              />
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </StyledBox>
  );
};
export default StatisticsCardSection;
