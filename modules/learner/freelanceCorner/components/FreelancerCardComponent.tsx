import React, {FC} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import TagChip from '../../../../@core/elements/display/TagChip';
import {Share} from '@mui/icons-material';
import {ISkill} from '../../../../shared/Interface/organization.interface';
import AvatarImageView from '../../../../@core/elements/display/ImageView/AvatarImageView';

const PREFIX = 'FreelancerCardComponent';

const classes = {
  titleStyle: `${PREFIX}-titleStyle`,
  skillsStyle: `${PREFIX}-skillsStyle`,
  share: `${PREFIX}-share`,
  shareTitle: `${PREFIX}-shareTitle`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.titleStyle}`]: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },

  [`& .${classes.skillsStyle}`]: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  [`& .${classes.share}`]: {
    backgroundColor: '#95979A !important',
    borderRadius: '4px 0px 0px 4px !important',
  },
  [`& .${classes.shareTitle}`]: {
    backgroundColor: '#C2C3C6 !important',
    borderRadius: '0px 4px 4px 0px !important',
    color: theme.palette.common.white,
    marginLeft: '-1.5rem !important',
  },
}));

interface FreelancerCardComponentProps {
  freelancer: any;
}

const FreelancerCardComponent: FC<FreelancerCardComponentProps> = ({
  freelancer,
}) => {
  const {messages} = useIntl();
  const skills = freelancer?.skills.slice(0, 2);

  return (
    <StyledCard>
      {freelancer && (
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7} md={7}>
              <Box sx={{display: 'flex'}}>
                <AvatarImageView
                  src={freelancer?.photo}
                  sx={{width: '60px', height: '60px'}}
                />
                <Box sx={{marginLeft: 2}}>
                  <Typography className={classes.titleStyle}>
                    {freelancer?.first_name + ' ' + freelancer?.last_name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={5} md={5}>
              <Button
                variant={'outlined'}
                color={'primary'}
                sx={{marginRight: '5px'}}>
                {messages['common.profile']}
              </Button>
              <Button variant={'contained'} color={'primary'}>
                {messages['common.contact']}
              </Button>
            </Grid>
          </Grid>
          <Box sx={{margin: '15px 0px'}}>
            {freelancer?.bio || 'No bio added'}
          </Box>
          <Box className={classes.skillsStyle}>
            <Box>
              {freelancer?.skills &&
                skills?.length > 0 &&
                (skills || []).map((skill: ISkill) => {
                  return <TagChip label={skill.title} key={skill.id} />;
                })}
            </Box>
            <Box display={'flex'}>
              <TagChip
                icon={<Share sx={{color: 'white !important'}} />}
                className={classes.share}
              />
              <TagChip
                label={messages['common.share']}
                className={classes.shareTitle}
              />
            </Box>
          </Box>
        </CardContent>
      )}
    </StyledCard>
  );
};

export default FreelancerCardComponent;
