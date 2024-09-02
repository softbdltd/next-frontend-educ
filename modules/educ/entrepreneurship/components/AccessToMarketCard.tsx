import {styled} from '@mui/material/styles';
import {Box, Card, Stack, Typography} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CardMediaImageView from '../../../../@core/elements/display/ImageView/CardMediaImageView';
import React from 'react';

const PREFIX = 'PartnerCard';

const classes = {
  boxStyle: `${PREFIX}-boxStyle`,
  iconStyle: `${PREFIX}-iconStyle`,
  cardContainerStyle: `${PREFIX}-cardContainerStyle`,
  styledImage: `${PREFIX}-styledImage`,
  titleStyle: `${PREFIX}-titleStyle`,
  titleBox: `${PREFIX}-titleBox`,
  imageBox: `${PREFIX}-imageBox`,
};

const StyledCard = styled(Card)(({theme}) => ({
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  [`& .${classes.boxStyle}`]: {
    position: 'absolute',
    top: 10,
    right: 0,
    cursor: 'pointer',
  },
  [`& .${classes.iconStyle}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`& .${classes.cardContainerStyle}`]: {
    alignItems: 'center',
    padding: '17px 10px 20px 10px',
    justifyContent: 'center',
  },
  [`& .${classes.styledImage}`]: {
    width: '150px',
    objectFit: 'contain',
  },
  [`& .${classes.titleBox}`]: {
    maxWidth: '220px',
  },
  [`& .MuiBox-root`]: {
    padding: '20px',
    marginTop: 0,
  },
  [`& .${classes.titleStyle}`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1.5rem',
  },
  [`& .${classes.imageBox}`]: {
    position: 'relative',
    boxShadow: '0px 0px 3px 1px #9e9e9e',
    [`&::after`]: {
      content: '""',
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      backgroundImage:
        'linear-gradient(to right, transparent 2%, #0000001f 3%, #00000059 4%, transparent 5%)',
    },
  },
}));

const AccessToMarketCard = ({item}: any) => {
  return (
    <StyledCard>
      <Stack
        className={classes.cardContainerStyle}
        sx={{maxHeight: 250}}
        spacing={2}>
        {item?.domain && (
          <Box className={classes.boxStyle}>
            <a target='_blank' href={item.domain} rel='noopener noreferrer'>
              <OpenInNewIcon className={classes.iconStyle} />
            </a>
          </Box>
        )}
        <Box>
          <CardMediaImageView
            width={'100%'}
            className={classes.styledImage}
            image={item?.logo}
            alt={item?.image_alt_title}
            title={item?.title}
          />
        </Box>
        <Box className={classes.titleBox}>
          <Typography
            title={item.title}
            variant='h4'
            className={classes.titleStyle}>
            {item.title}
          </Typography>
        </Box>
      </Stack>
    </StyledCard>
  );
};
export default AccessToMarketCard;
