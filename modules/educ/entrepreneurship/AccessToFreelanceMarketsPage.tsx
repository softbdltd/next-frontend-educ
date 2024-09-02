import {styled} from '@mui/material/styles';
import {Box, Container, Grid} from '@mui/material';
import React from 'react';
import MarketSection from './components/FreelanceMarketSectionV2';

const PREFIX = 'accessToSkillPage';

export const classes = {
  mainContent: `${PREFIX}-mainContent`,
};

export const StyledSection = styled(Box)(({theme}) => ({
  margin: '0px auto 20px',

  [`& .${classes.mainContent}`]: {
    marginTop: 20,
  },
}));
const AccessToFreelanceMarketsPage = () => {
  return (
    <StyledSection>
      <Container maxWidth={'lg'} className={classes.mainContent}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <MarketSection />
          </Grid>
        </Grid>
      </Container>
    </StyledSection>
  );
};
export default AccessToFreelanceMarketsPage;
