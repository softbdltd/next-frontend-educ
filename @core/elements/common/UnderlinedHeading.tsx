import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';

const PREFIX = 'UnderlinedHeading';

const classes = {
  heading: `${PREFIX}-heading`,
  line: `${PREFIX}-line`,
  lineOne: `${PREFIX}-lineOne`,
  lineTwo: `${PREFIX}-lineTwo`,
};

const StyledBoxLine = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '30px',

  [`& .${classes.lineOne}`]: {
    background: '#33c2a7',
    width: 120,
    height: 3,
  },

  [`& .${classes.lineTwo}`]: {
    background: '#f5a000',
    width: 100,
    height: 3,
  },
}));

type Props = {
  children?: ReactNode;
};

const UnderlinedHeading = ({children}: Props) => {
  return (
    <>
      <Typography
        variant='h2'
        sx={{
          fontSize: '1.875rem',
          color: 'primary.main',
          textAlign: 'center',
          marginBottom: '15px',
        }}
        gutterBottom={true}
        fontWeight='fontWeightBold'>
        {children}
      </Typography>
      <StyledBoxLine>
        <Box className={classes.lineOne} />
        <Box className={classes.lineTwo} />
      </StyledBoxLine>
    </>
  );
};

export default UnderlinedHeading;
