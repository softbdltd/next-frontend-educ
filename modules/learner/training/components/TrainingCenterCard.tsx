import {Card, CardContent, Grid, Typography} from '@mui/material';
import React from 'react';

interface TrainingCenterCardProps {
  trainingCenter: any;
}

const TrainingCenterCard = ({trainingCenter}: TrainingCenterCardProps) => {
  return (
    <Card sx={{height: '100%'}}>
      <CardContent>
        <Grid container sx={{alignItems: 'center', flexDirection: 'column'}}>
          <Grid item xs={12}>
            <Typography
              mt={3}
              mb={3}
              variant={'h5'}
              sx={{wordBreak: 'break-word'}}>
              {trainingCenter?.title}
              {trainingCenter?.district_title ? (
                <>, {trainingCenter?.district_title}</>
              ) : (
                <></>
              )}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrainingCenterCard;
