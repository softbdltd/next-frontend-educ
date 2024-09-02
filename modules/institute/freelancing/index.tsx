import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import {H6} from '../../../@core/elements/common';
import Box from '@mui/material/Box';
import {Fonts} from '../../../shared/constants/AppEnums';
import {useRouter} from 'next/router';
import {initialUrl} from '../../../shared/constants/AppConst';
import Button from '@mui/material/Button';
import IntlMessages from '../../../@core/utility/IntlMessages';

const PREFIX = 'InstituteFreelancing';

const classes = {
  button: `${PREFIX}-button`,
  accordion: `${PREFIX}-accordion`,
  heading: `${PREFIX}-heading`,
  iconStyle: `${PREFIX}-iconStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => {
  return {
    [`& .${classes.accordion}`]: {
      marginBottom: '10px',
    },
    [`& .${classes.heading}`]: {
      boxShadow: '0px 2px 2px #8888',
    },
    [`& .${classes.iconStyle}`]: {
      color: theme.palette.grey[800],
      fontSize: '1.875rem',
    },
    [`& .${classes.button}`]: {
      fontWeight: Fonts.BOLD,
      marginTop: 8,
      fontSize: 16,
      textTransform: 'capitalize',
    },
  };
});

const InstituteFreelancing = () => {
  const {messages} = useIntl();
  const router = useRouter();

  const onGoBackToHome = () => {
    router.push(initialUrl);
  };

  return (
    <StyledGrid sx={{maxWidth: '100%'}} container>
      <Grid xs={12} mt={4} textAlign={'center'} className={classes.heading}>
        <Box
          mb={{xs: 2, xl: 8}}
          width='100%'
          sx={{
            pt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img src={'/images/under_construction.png'} alt='404' width='350px' />
        </Box>
        <H6 py={3} fontWeight={'bold'} style={{fontSize: '1.5rem'}}>
          {messages['common.construction']}
        </H6>
        <H6 mt={-3} style={{fontSize: '1.0rem'}}>
          {messages['common.working']}
        </H6>
        <Button
          variant='outlined'
          color='primary'
          className={classes.button}
          onClick={onGoBackToHome}>
          <IntlMessages id='common.back_to_home' />
        </Button>
      </Grid>
    </StyledGrid>
  );
};

export default InstituteFreelancing;
