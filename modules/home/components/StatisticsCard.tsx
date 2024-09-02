import React from 'react';
import {Card, Grid, Skeleton, Stack, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {styled} from '@mui/material/styles';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import {useIntl} from 'react-intl';

const PREFIX = 'StatisticsCard';

const classes = {
  numberStyle: `${PREFIX}-numberStyle`,
  title: `${PREFIX}-title`,
  logoBackground: `${PREFIX}-logoBackground`,
};

const StyledCard = styled(Card)(({theme}) => ({
  boxShadow: '0px 0px 8px 0px #c3c3c3',
  borderRadius: '10px',
  padding: '15px 7px',
  height: '100%',
  [`& .${classes.numberStyle}`]: {
    fontSize: '2.25rem',
    fontWeight: '600',
    color: '#2C2C2C',
    lineHeight: '42.19px',
  },
  [`& .${classes.title}`]: {
    fontSize: '1.125rem',
    textTransform: 'uppercase',
    color: '#8C8C8C',
    textAlign: 'center',
  },
  [`& .${classes.logoBackground}`]: {
    background: '#F2FFF8',
    height: '60px',
    width: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
  },
}));

interface StatisticsCardProps {
  title: string | MessageFormatElement[];
  value: number;
  iconUrl: string;
  isLoading: boolean;
}

const StatisticsCard = ({
  title,
  value,
  iconUrl,
  isLoading,
}: StatisticsCardProps) => {
  const {formatNumber} = useIntl();
  return (
    <Grid item xs={6} md={2.4}>
      <StyledCard tabIndex={0}>
        <Stack alignItems={'center'} justifyContent={'center'} spacing={1}>
          <Box className={classes.logoBackground}>
            <img src={iconUrl} alt={''} />
          </Box>
          {isLoading ? (
            <Skeleton
              variant={'rectangular'}
              sx={{height: '2.5rem', width: '65%'}}
            />
          ) : (
            <Typography
              variant={'h2'}
              className={classes.numberStyle}
              tabIndex={0}
              role='heading'
              aria-label={`${formatNumber(value ?? 0)}+`}>
              {formatNumber(value ?? 0)}+
            </Typography>
          )}
          <Typography variant={'body1'} className={classes.title}>
            {title}
          </Typography>
        </Stack>
      </StyledCard>
    </Grid>
  );
};

export default StatisticsCard;
