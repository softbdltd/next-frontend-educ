import React from 'react';
import {styled} from '@mui/material/styles';
import {Card, Container, Grid} from '@mui/material';
import {Fade} from 'react-awesome-reveal';
import {H3} from '../../@core/elements/common';
import {useIntl} from 'react-intl';
import SectionTitle from './SectionTitle';

const PREFIX = 'InfoCardSection';

const classes = {
  learnerBoxItem: `${PREFIX}-learnerBoxItem`,
  skillBoxItem: `${PREFIX}-skillBoxItem`,
  industryBoxItem: `${PREFIX}-industryBoxItem`,
};

const StyledFade = styled(Fade)(({theme}) => ({
  [`& .${classes.learnerBoxItem}`]: {
    background: '#1B69BC',
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: '16px',
    color: '#fff',
    '& h3': {
      marginTop: '30px !important',
      marginBottom: '10px !important',
      fontSize: '1.75rem !important',
      fontWeight: '600 !important',
    },
    '& p': {
      fontSize: '1rem !important',
      lineHeight: '22px',
    },
  },

  [`& .${classes.skillBoxItem}`]: {
    background: '#682988',
    textAlign: 'center',
    padding: theme.spacing(3),
    color: '#fff',
    borderRadius: '16px',
    '& h3': {
      marginTop: '30px !important',
      marginBottom: '10px !important',
      fontSize: '1.75rem !important',
      fontWeight: '600 !important',
    },
    '& p': {
      fontSize: '1rem !important',
      lineHeight: '22px',
    },
  },

  [`& .${classes.industryBoxItem}`]: {
    background: '#E77F38',
    textAlign: 'center',
    padding: theme.spacing(3),
    color: '#fff',
    borderRadius: '16px',
    '& h3': {
      marginTop: '30px !important',
      marginBottom: '10px !important',
      fontSize: '1.75rem !important',
      fontWeight: '600 !important',
    },
    '& p': {
      fontSize: '1rem !important',
      lineHeight: '22px',
    },
  },
}));

const InfoCardSection = () => {
  const {messages} = useIntl();

  return (
    <StyledFade direction='up'>
      <Container maxWidth='lg' sx={{marginTop: '60px'}}>
        <SectionTitle
          title={messages['beneficiaries_of_EDUC.label'] as string}
          center={true}
        />

        <Grid container spacing={4} mb={{xs: 2, md: 5}}>
          <Grid item xs={12} md={4}>
            <Card className={classes.learnerBoxItem}>
              <img src={'/images/home-page/man-n-woman.png'} />
              <H3>{messages['institute_home.people2']}</H3>
              {/*<Text>{messages['educ.card_learner']}</Text>*/}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className={classes.skillBoxItem}>
              <img src={'/images/home-page/training.png'} />
              <H3>{messages['common.skill_develop']}</H3>
              {/*<Text> {messages['educ.card_learner']}</Text>*/}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className={classes.industryBoxItem}>
              <img src={'/images/home-page/industry.png'} />
              <H3>{messages['common.industrial']}</H3>
              {/*<Text>{messages['educ.card_learner']}</Text>*/}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </StyledFade>
  );
};
export default InfoCardSection;
