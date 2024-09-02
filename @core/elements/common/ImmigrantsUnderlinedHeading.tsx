import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography, Container} from '@mui/material';
import {useIntl} from 'react-intl';

const PREFIX = 'ImmigrantsUnderlinedHeading';

const classes = {
  heading: `${PREFIX}-heading`,
  line: `${PREFIX}-line`,
  lineOne: `${PREFIX}-lineOne`,
  lineTwo: `${PREFIX}-lineTwo`,
  letterSize: `${PREFIX}-letterSize`,
  mainBox: `${PREFIX}-mainBox`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  marginTop: '-2rem',
  [theme.breakpoints.down('sm')]: {
    marginTop: '-1rem',
  },
  [`& .${classes.mainBox}`]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  [`& .${classes.lineOne}`]: {
    background: '#33c2a7',
    width: 70,
    height: 3,
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 1,
    },
  },

  [`& .${classes.lineTwo}`]: {
    background: '#f5a000',
    width: 60,
    height: 3,
    [theme.breakpoints.down('sm')]: {
      width: 25,
      height: 1,
    },
  },

  [`& .${classes.letterSize}`]: {
    fontSize: '1.875rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.875rem',
    },
  },
}));

const ImmigrantsUnderlinedHeading = () => {
  const {messages} = useIntl();
  return (
    <StyledContainer>
      <Typography
        className={classes.letterSize}
        variant='h5'
        sx={{
          color: 'primary.main',
          textAlign: 'center',
        }}
        gutterBottom={true}
        fontWeight='fontWeightBold'>
        {messages['migration_portal.immigrant']}
      </Typography>
      <Typography
        className={classes.letterSize}
        variant='h5'
        sx={{
          color: 'primary.main',
          textAlign: 'center',
        }}
        gutterBottom={true}
        fontWeight='fontWeightBold'>
        {messages['migration_portal.lifecycle']}
      </Typography>
      <Box className={classes.mainBox}>
        <Box className={classes.lineOne} />
        <Box className={classes.lineTwo} />
      </Box>
    </StyledContainer>
  );
};

export default ImmigrantsUnderlinedHeading;
