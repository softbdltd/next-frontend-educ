import React, {FC} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Card, Grid} from '@mui/material';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {Star} from '@mui/icons-material';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';

const PREFIX = 'FeaturedFreelancerComponent';

const classes = {
  featureFreelancerRoot: `${PREFIX}-featureFreelancerRoot`,
  freelanceUserImage: `${PREFIX}-freelanceUserImage`,
  tagStyle: `${PREFIX}-tagStyle`,
  freelancerNameStyle: `${PREFIX}-freelancerNameStyle`,
  designationStyle: `${PREFIX}-designationStyle`,
  starStyle: `${PREFIX}-starStyle`,
};

const StyledCard = styled(Card)(({theme}) => ({
  background: '#fff',
  borderRadius: 4,
  position: 'relative',
  padding: '10px 5px',

  [`& .${classes.freelanceUserImage}`]: {
    // marginLeft: 10,
    border: '1px solid ' + theme.palette.grey['300'],
  },

  [`& .${classes.tagStyle}`]: {
    color: theme.palette.warning.main,
    position: 'absolute',
    top: 14,
    right: 9,
    borderRadius: '50%',
    height: 21,
    width: 21,
    background: '#FEF0EA',
    '& .MuiChip-label': {
      padding: '0px 5px',
    },
  },

  [`& .${classes.freelancerNameStyle}`]: {
    color: theme.palette.primary.main,
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.designationStyle}`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.main,
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.starStyle}`]: {
    height: '13px',
    width: '13px',
    position: 'absolute',
    top: 4,
    left: 4,
  },
}));

interface FeaturedFreelancerComponentProps {
  freelanceUser: {
    image: string;
    name: string;
    designation: string;
  };
}

const FeaturedFreelancerComponent: FC<FeaturedFreelancerComponentProps> = ({
  freelanceUser,
}) => {
  return (
    <StyledCard>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={2}>
          <AvatarImageView
            className={classes.freelanceUserImage}
            alt='user image'
            src={freelanceUser?.image}
          />
        </Grid>
        <Grid item xs={8}>
          <Box className={classes.freelancerNameStyle}>
            {freelanceUser.name}
          </Box>
          <Box>{freelanceUser.designation}</Box>
        </Grid>
        {/*<Chip
          variant='outlined'
          label={messages['common.featured']}
          className={classes.tagStyle}
        />*/}
        <Grid item>
          <div className={classes.tagStyle}>
            <Star className={classes.starStyle} />
          </div>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default FeaturedFreelancerComponent;
