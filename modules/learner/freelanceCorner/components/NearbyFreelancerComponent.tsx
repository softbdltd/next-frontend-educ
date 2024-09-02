import React, {FC} from 'react';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {Box, Button} from '@mui/material';
import {S2} from '../../../../@core/elements/common';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';

const PREFIX = 'NearbyFreelancer';

const classes = {
  userImage: `${PREFIX}-userImage`,
  designation: `${PREFIX}-designation`,
  detailsButton: `${PREFIX}-detailsButton`,
};

const StyledStyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.userImage}`]: {
    height: 45,
    width: 45,
    border: '1px solid ' + theme.palette.grey['300'],
  },
  [`& .${classes.designation}`]: {
    color: theme.palette.grey['600'],
    marginBottom: 10,
  },
  [`& .${classes.detailsButton}`]: {
    boxShadow: 'none',
    marginLeft: 10,
  },
}));

interface NearbyFreelancerComponentProps {
  freelanceUser: any;
}

const NearbyFreelancerComponent: FC<NearbyFreelancerComponentProps> = ({
  freelanceUser,
}) => {
  const {messages} = useIntl();

  return (
    <StyledStyledBox display={'flex'}>
      <Box>
        <AvatarImageView
          alt='learner image'
          src={freelanceUser?.photo}
          className={classes.userImage}
        />
      </Box>
      <Box marginLeft={'10px'}>
        <Box fontWeight={'bold'}>
          {freelanceUser?.first_name + ' ' + freelanceUser?.last_name}
        </Box>
        <Box className={classes.designation}>
          <S2>{freelanceUser?.skills[0]?.title}</S2>
        </Box>
        <Box>
          <Button variant='contained' color='primary' size={'small'}>
            {messages['common.contact']}
          </Button>
          <Button
            className={classes.detailsButton}
            variant='outlined'
            color='primary'
            size={'small'}>
            {messages['common.profile']}
          </Button>
        </Box>
      </Box>
    </StyledStyledBox>
  );
};

export default NearbyFreelancerComponent;
