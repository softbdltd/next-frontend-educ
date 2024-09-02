import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {Hx} from '../../@core/elements/common';
import VerticalBar from './components/VerticalBar';

const PREFIX = 'SectionTitle';

const classes = {
  title: `${PREFIX}-title`,
};

const StyledH3 = styled(Hx)(({theme}) => ({
  [`& .${classes.title}`]: {
    color: '#682988',
    display: 'flex',
    alignItems: 'center',
  },
}));

type Props = {
  title: string;
  center?: boolean;
  level?: string;
};

const SectionTitle = ({title, center, level}: Props) => {
  return (
    <StyledH3
      lavel={level}
      style={{fontSize: '2.063rem', fontWeight: 'bold', marginBottom: '30px'}}>
      <Box
        className={classes.title}
        justifyContent={center ? 'center' : 'flex-start'}>
        <VerticalBar />
        <Box fontWeight='fontWeightBold'>{title}</Box>
      </Box>
    </StyledH3>
  );
};

export default SectionTitle;
