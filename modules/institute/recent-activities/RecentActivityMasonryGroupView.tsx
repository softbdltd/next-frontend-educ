import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from '@mui/material';
import {DateRangeOutlined} from '@mui/icons-material';
import React from 'react';
import {styled} from '@mui/material/styles';
import {Link} from '../../../@core/elements/common';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import {useIntl} from 'react-intl';
import {LINK_FRONTEND_EDUC_RECENT_ACTIVITIES} from '../../../@core/common/appLinks';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';

const PREFIX = 'RecentActivityMasonryGroupView';

const classes = {
  dateInfo: `${PREFIX}-dateInfo`,
  image: `${PREFIX}-image`,
  imageTexts: `${PREFIX}-imageTexts`,
};

const StyledImageList = styled(ImageList)(({theme}) => {
  return {
    [`& .${classes.dateInfo}`]: {
      background: theme.palette.common.white,
      color: theme.palette.primary.light,
      display: 'flex',
      padding: '4px',
      minWidth: '180px',
      maxWidth: '195px',
      borderRadius: '5px',
      bottom: '55px',
      left: '5px',
      position: 'absolute',
    },
    [`&.${classes.image}`]: {
      overflow: 'hidden',
      margin: 0,
      '& img': {
        objectFit: 'unset',
        width: '100%',
        height: '100%',
      },
      [theme.breakpoints.down('sm')]: {
        display: 'block',
        ['& .MuiImageListItem-root']: {
          width: '100%',
          height: '250px !important',
        },
      },
    },
    [`& .${classes.imageTexts}`]: {
      position: 'relative',
    },
  };
});

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}%&h=${size * rows}%&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const masonryPositions = [
  {
    cols: 2,
    rows: 2,
  },
  {
    cols: 2,
    rows: 1,
  },
  {
    cols: 1,
    rows: 1,
  },
  {
    cols: 1,
    rows: 1,
  },
];

function RecentActivityMasonryGroupView({items}: any) {
  const {formatDate} = useIntl();

  return (
    <StyledImageList
      sx={{width: '100%', height: 'auto'}}
      variant='quilted'
      cols={4}
      rowHeight={270}
      className={classes.image}>
      {items &&
        items?.map((item: any) => (
          <ImageListItem
            key={item.collage_position}
            cols={masonryPositions[item.collage_position - 1]?.cols || 1}
            rows={masonryPositions[item.collage_position - 1]?.rows || 1}
            style={{position: 'relative'}}>
            <Link
              href={
                item.id
                  ? `${LINK_FRONTEND_EDUC_RECENT_ACTIVITIES}/${item.id}`
                  : ''
              }>
              <img
                {...srcset(
                  item?.id
                    ? FILE_SERVER_FILE_VIEW_ENDPOINT + item.collage_image_path
                    : item.collage_image_path,
                  25,
                  masonryPositions[item.collage_position - 1]?.rows,
                  masonryPositions[item.collage_position - 1]?.cols,
                )}
                alt={item.image_alt_title ? item.image_alt_title : item?.title}
                title={item.image_alt_title}
                loading='lazy'
              />
              <Box className={classes.imageTexts}>
                {item.published_at && (
                  <Box className={classes.dateInfo}>
                    <DateRangeOutlined />
                    <Typography ml={1}>
                      {getIntlDateFromString(formatDate, item.published_at)}
                    </Typography>
                  </Box>
                )}
                {item.title && <ImageListItemBar title={item.title} />}
              </Box>
            </Link>
          </ImageListItem>
        ))}
    </StyledImageList>
  );
}

export default RecentActivityMasonryGroupView;
