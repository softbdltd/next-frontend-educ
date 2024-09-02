import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {DateRangeOutlined} from '@mui/icons-material';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import {useIntl} from 'react-intl';
import React from 'react';
import ContentTypes from '../../dashboard/recentActivities/ContentTypes';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';

const PREFIX = 'RecentActivityCardView';

const classes = {
  dateInfo: `${PREFIX}-dateInfo`,
  image: `${PREFIX}-image`,
  recentActivityTitle: `${PREFIX}-recentActivityTitle`,
};

const StyledCard = styled(Card)(({theme}) => {
  return {
    [`& .${classes.dateInfo}`]: {
      background: theme.palette.common.white,
      color: theme.palette.primary.light,
      display: 'flex',
      padding: '0px',
      minWidth: '180px',
      maxWidth: '195px',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    [`& .${classes.image}`]: {
      overflow: 'hidden',
    },
    [`& .${classes.recentActivityTitle}`]: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  };
});

function RecentActivityCardView({activity}: any) {
  const router = useRouter();
  const path = router.pathname;
  const {formatDate} = useIntl();

  return (
    <StyledCard>
      <Link href={`${path}/${activity.id}`} passHref>
        <CardActionArea>
          {activity.content_type &&
            activity.content_type == ContentTypes.IMAGE && (
              <CardMediaImageView
                height='140'
                image={
                  activity.image_path
                    ? activity.image_path
                    : activity.grid_image_path
                }
                alt={
                  activity?.image_alt_title
                    ? activity?.image_alt_title
                    : activity?.title
                }
                title={activity?.title}
              />
            )}
          {activity.content_type &&
            activity.content_type != ContentTypes.IMAGE && (
              <>
                <CardMediaImageView
                  height='140'
                  image={activity.thumb_image_path}
                  defaultImage={'/images/blank_gray_image.png'}
                  alt={
                    activity?.image_alt_title
                      ? activity?.image_alt_title
                      : activity?.title
                  }
                  title={activity?.title}
                />
                <PlayCircleIcon
                  sx={{
                    position: 'absolute',
                    top: 'calc(30% - 35px)',
                    left: 'calc(50% - 35px)',
                    height: '70px',
                    width: '70px',
                  }}
                  color='primary'
                />
              </>
            )}
          <CardContent>
            <Box className={classes.dateInfo}>
              <DateRangeOutlined />
              <Typography ml={1}>
                {getIntlDateFromString(formatDate, activity?.published_at)}
              </Typography>
            </Box>

            <Typography
              variant='subtitle2'
              component='div'
              className={classes.recentActivityTitle}
              title={activity?.title}>
              {activity?.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </StyledCard>
  );
}

export default RecentActivityCardView;
