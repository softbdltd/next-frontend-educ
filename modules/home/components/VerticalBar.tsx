import {Box} from '@mui/material';
import React from 'react';
import {styled} from '@mui/material/styles';

const PREFIX = 'VerticalBar';

const classes = {
  titleTypography: `${PREFIX}-titleTypography`,
  vBar1: `${PREFIX}-vBar1`,
  vBar2: `${PREFIX}-vBar2`,
};

const StyledBox = styled(Box)(({theme}) => {
  return {
    [`& .${classes.vBar1}`]: {
      height: '17px',
      width: '2px',
      background: '#33C2A7',
      marginRight: '10px',
    },
    [`& .${classes.vBar2}`]: {
      height: '17px',
      width: '2px',
      background: '#F5A000',
      marginRight: '10px',
    },
  };
});

const VerticalBar = () => {
  return (
    <StyledBox sx={{display: 'block'}}>
      <Box className={classes.vBar1} />
      <Box className={classes.vBar2} />
    </StyledBox>
  );
};

export default VerticalBar;
