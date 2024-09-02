import React, {FC} from 'react';
import {Box, Card, CardContent, Typography} from '@mui/material';
import TagChip from '../../../../@core/elements/display/TagChip';
import {useIntl} from 'react-intl';

import {styled} from '@mui/material/styles';
import CardMediaImageView from '../../../../@core/elements/display/ImageView/CardMediaImageView';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';

const PREFIX = 'CustomFilterableSelect';

export const classes = {
  providerLogo: `${PREFIX}-providerLogo`,
  tagBox: `${PREFIX}-tagBox`,
  addressTextStyle: `${PREFIX}-addressTextStyle`,
};

export const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.providerLogo}`]: {
    height: 55,
    width: 55,
    border: '1px solid ' + theme.palette.grey['300'],
    position: 'absolute',
    top: 110,
    left: 10,
  },

  [`& .${classes.tagBox}`]: {
    marginTop: 15,
  },

  [`& .${classes.addressTextStyle}`]: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10,
  },
}));

interface TrainingCenterCardComponentProps {
  trainingCenter: any;
}

const TrainingCenterCardComponent: FC<TrainingCenterCardComponentProps> = ({
  trainingCenter,
}) => {
  const {messages} = useIntl();

  return (
    <StyledCard>
      <CardMediaImageView
        image={trainingCenter?.image}
        title={trainingCenter?.name}
      />
      <CardContent>
        <AvatarImageView
          className={classes.providerLogo}
          alt={trainingCenter?.name}
          src={trainingCenter?.logo}
        />
        <Box fontWeight={'bold'} marginTop={'20px'}>
          {trainingCenter.name}
        </Box>
        <Box marginTop={'5px'}>
          <Typography variant={'caption'} className={classes.addressTextStyle}>
            {messages['address.label']}:
          </Typography>
          {trainingCenter.address}
        </Box>

        <Box className={classes.tagBox}>
          {(trainingCenter.tags || []).map((tag: any, index: any) => {
            return <TagChip label={tag} key={index} />;
          })}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TrainingCenterCardComponent;
