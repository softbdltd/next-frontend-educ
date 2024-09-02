import React, {FC} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import {H2, Link} from '../../../@core/elements/common';
import {useCustomStyle} from '../../../@core/hooks/useCustomStyle';
import AvatarImageView from '../../../@core/elements/display/ImageView/AvatarImageView';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';

const PREFIX = 'NoticeCard';

const classes = {
  avatar: `${PREFIX}-avatar`,
  avatarImage: `${PREFIX}-avatarImage`,
  creativaItText: `${PREFIX}-creativaItText`,
  btn: `${PREFIX}-btn`,
};

const StyledCard = styled(Card)(({theme}) => ({
  padding: '10px',

  [`& .${classes.avatar}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  [`& .${classes.avatarImage}`]: {
    maxHeight: '80px',
    maxWidth: '80px',
    width: '100%',
    height: '100%',
  },

  [`& .${classes.creativaItText}`]: {
    marginTop: '5px',
    marginBottom: '15px',
    color: '#687882',
  },

  [`& .${classes.btn}`]: {
    marginRight: '20px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '10px',
    },
  },
}));

interface NoticeCardProps {
  notice: any;
}

const NoticeCard: FC<NoticeCardProps> = ({notice}) => {
  const {messages, formatDate} = useIntl();
  const result = useCustomStyle();
  const URL = `/notice-details/${notice.id}`;
  return (
    <StyledCard>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={3} md={3}>
            <Box className={classes.avatar}>
              {/*Todo: logo have to implement after real api ready*/}
              <AvatarImageView
                src={notice?.grid_image_path}
                alt={
                  notice?.image_alt_title
                    ? notice?.image_alt_title
                    : notice?.title
                }
                className={classes.avatarImage}
                variant='square'
              />
            </Box>
          </Grid>
          <Grid item xs={9} md={9}>
            <Link href={URL}>
              <H2 sx={{...result.body1, fontWeight: 'bold', cursor: 'pointer'}}>
                {notice.title}
              </H2>
            </Link>

            <Typography className={classes.creativaItText}>
              {notice.providerName}
            </Typography>

            <Box>
              {notice?.published_at && (
                <Chip
                  size={'medium'}
                  sx={{
                    background: '#e8f1ec',
                    border: '1px solid #e4f1ea',
                    borderRadius: '5px',
                    height: '40px',
                    marginRight: '15px',
                  }}
                  label={getIntlDateFromString(formatDate, notice.published_at)}
                  variant='outlined'
                />
              )}
              {notice?.file_path && (
                <Button color={'primary'} variant={'outlined'}>
                  <Link
                    target={'_blank'}
                    href={FILE_SERVER_FILE_VIEW_ENDPOINT + notice.file_path}>
                    {messages['common.download']}
                  </Link>
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default NoticeCard;
