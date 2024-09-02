import React from 'react';
import {Box, Container, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import NearbyTrainingCenterSection from './NearbyTrainingCenterSection';

const PREFIX = 'AllNearbyTrainingCenter';

export const classes = {
  mainContent: `${PREFIX}-mainContent`,
};

export const StyledTrainingCenterSection = styled(Box)(({theme}) => ({
  margin: '0px auto 20px',

  [`& .${classes.mainContent}`]: {
    marginTop: 20,
  },
}));

const AllNearbyTrainingCenterPage = () => {
  return (
    <StyledTrainingCenterSection>
      <Container maxWidth={'lg'} className={classes.mainContent}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <NearbyTrainingCenterSection showAllNearbyTrainingCenter={true} />
          </Grid>
        </Grid>
      </Container>
    </StyledTrainingCenterSection>
  );
};

export default AllNearbyTrainingCenterPage;
