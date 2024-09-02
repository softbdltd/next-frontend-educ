import React from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../shared/constants/AppEnums';
import MapIcon from './MapIcon';
import {useIntl} from 'react-intl';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';

const PREFIX = 'CardWithImageComponent';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  subHeading: `${PREFIX}-subHeading`,
  descriptionText: `${PREFIX}-descriptionText`,
  mapIconStyle: `${PREFIX}-mapIconStyle`,
};

const StyledBox = styled(Box)(({theme}) => ({
  border: '1.12313px solid #D7D7D7',
  borderRadius: '6px',
  padding: '10px',
  height: '100%',

  [`& .${classes.titleStyle}`]: {
    fontSize: '1rem',
    fontWeight: Fonts.MEDIUM,
    maxWidth: '80%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    WebkitLineClamp: '2',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
  },
  [`& .${classes.subHeading}`]: {
    color: theme.palette.primary.main,
    fontSize: '12px',
    fontWeight: Fonts.MEDIUM,
  },
  [`& .${classes.descriptionText}`]: {
    color: '#696969',
  },

  [`&:hover, &:focus`]: {
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
    [`& .${classes.titleStyle}`]: {
      color: theme.palette.common.white,
    },
    [`& .${classes.mapIconStyle}`]: {
      fill: theme.palette.common.white,
    },
    [`& .${classes.subHeading}`]: {
      color: theme.palette.common.white,
    },
    [`& .${classes.descriptionText}`]: {
      color: theme.palette.common.white,
    },
  },
  [`& .${classes.mapIconStyle}`]: {
    fill: '#696969',
  },
}));

interface CardWithImageComponentProps {
  imageUrl: string;
  title: string;
  date: string;
  location?: string;
  bottomText?: string;
  imageHeight?: string;
}

const CardWithImageComponent = ({
  imageUrl,
  title,
  date,
  location,
  bottomText,
  imageHeight = '90px',
}: CardWithImageComponentProps) => {
  const {formatDate} = useIntl();
  return (
    <StyledBox>
      <Stack spacing={1}>
        <Box>
          <CardMediaImageView
            image={imageUrl}
            sx={{borderRadius: '10px', height: imageHeight}}
            title={title}
            alt={title}
          />
        </Box>
        <Typography
          tabIndex={0}
          role='heading'
          aria-label={`${getIntlDateFromString(formatDate, date)}`}
          className={classes.subHeading}
          variant={'h6'}>
          {getIntlDateFromString(formatDate, date)}
        </Typography>
        <Typography
          tabIndex={0}
          className={classes.titleStyle}
          variant={'h6'}
          title={title}>
          {title}
        </Typography>
        {location && (
          <Stack direction={'row'} spacing={1}>
            <MapIcon className={classes.mapIconStyle} />
            <Typography
              tabIndex={0}
              className={classes.descriptionText}
              variant={'body1'}>
              {location}
            </Typography>
          </Stack>
        )}
        {bottomText && (
          <Typography
            tabIndex={0}
            className={classes.descriptionText}
            variant={'body1'}
            title={bottomText}>
            {bottomText}
          </Typography>
        )}
      </Stack>
    </StyledBox>
  );
};

export default CardWithImageComponent;
