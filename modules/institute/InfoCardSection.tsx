import React from 'react';
import {styled} from '@mui/material/styles';
import {Card, Container, Grid} from '@mui/material';
import {Zoom} from 'react-awesome-reveal';
import {Assignment, HomeWork, People, PeopleAlt} from '@mui/icons-material';
import UnderlinedHeading from '../../@core/elements/common/UnderlinedHeading';
import {H4, H5} from '../../@core/elements/common';
import {useIntl} from 'react-intl';
import {useFetchPublicDashboardStatistics} from '../../services/global/hooks';

const PREFIX = 'InfoCardSection';

const classes = {
  root: `${PREFIX}-root`,
  subheading: `${PREFIX}-subheading`,
  boxItem: `${PREFIX}-boxItem`,
  icon: `${PREFIX}-icon`,
  desc: `${PREFIX}-desc`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`&.${classes.root}`]: {
    marginTop: '60px',
  },

  [`& .${classes.subheading}`]: {
    textAlign: 'center',
    marginBottom: 30,
  },

  [`& .${classes.boxItem}`]: {
    boxShadow: theme.shadows[4],
    background: theme.palette.background.paper,
    textAlign: 'center',
    padding: theme.spacing(3),
    height: 232,
    borderRadius: 4 * parseInt(theme.shape.borderRadius.toString()),
    // color: '#000',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1.25),
    },
  },

  [`& .${classes.icon}`]: {
    fontSize: '4.5rem',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('lg')]: {
      fontSize: '4rem',
    },
  },

  [`& .${classes.desc}`]: {
    color: '#014E84', // theme.palette.secondary.main,
    padding: '0px 6px',
    [theme.breakpoints.only('lg')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.4rem',
    },
  },
}));

const InfoCardSection = () => {
  const {messages, formatNumber} = useIntl();
  let {data: statistics} = useFetchPublicDashboardStatistics();

  return (
    <StyledGrid container xl={12} className={classes.root}>
      <Container maxWidth='lg'>
        <UnderlinedHeading>
          {messages['institute_home.at_a_glance']}
        </UnderlinedHeading>
        {/*<H5 gutterBottom={true} className={classes.subheading}>*/}
        {/*  {messages['institute_home.course_management_stat']}*/}
        {/*</H5>*/}
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom>
              <Card className={classes.boxItem}>
                <Assignment className={classes.icon} />
                <H4 gutterBottom={true} fontWeight='fontWeightBold'>
                  {formatNumber(statistics?.total_course || (0 as number))}{' '}
                  {messages['institute_home.ti']}
                </H4>
                <H5 gutterBottom={true} className={classes.desc}>
                  {messages['institute_home.total_course_subject']}
                </H5>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom>
              <Card className={classes.boxItem}>
                <PeopleAlt className={classes.icon} />
                <H4 gutterBottom={true} fontWeight='fontWeightBold'>
                  {formatNumber(statistics?.total_enrollments || (0 as number))}{' '}
                  {messages['institute_home.people']}
                </H4>
                <H5 gutterBottom={true} className={classes.desc}>
                  {messages['common.job_registered']}
                </H5>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom>
              <Card className={classes.boxItem}>
                <HomeWork className={classes.icon} />
                <H4 gutterBottom={true} fontWeight='fontWeightBold'>
                  {formatNumber(
                    statistics?.total_training_centers || (0 as number),
                  )}{' '}
                  {messages['institute_home.ti']}
                </H4>
                <H5 gutterBottom={true} className={classes.desc}>
                  {messages['institute_home.total_training_center']}
                </H5>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom>
              <Card className={classes.boxItem}>
                <People className={classes.icon} />
                <H4 gutterBottom={true} fontWeight='fontWeightBold'>
                  {formatNumber(statistics?.total_trainers || (0 as number))}{' '}
                  {messages['institute_home.people']}
                </H4>
                <H5 gutterBottom={true} className={classes.desc}>
                  {messages['institute_home.total_skilled_trainer']}
                </H5>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </StyledGrid>
  );
};
export default InfoCardSection;
