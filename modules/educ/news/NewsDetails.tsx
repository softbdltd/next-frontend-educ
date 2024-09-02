import React from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {useFetchPublicNoticeOrNews} from '../../../services/cmsManagement/hooks';
import {getIntlDateFromString} from '../../../@core/utilities/helpers';
import {Link} from '../../../@core/elements/common';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import {LINK_FRONTEND_NEWS} from '../../../@core/common/appLinks';

const PREFIX = 'NoticeDetails';

const classes = {
  date: `${PREFIX}-date`,
  icon: `${PREFIX}-icon`,
  container: `${PREFIX}-container`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.date}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.icon}`]: {
    color: '#ffff',
    padding: '2px',
    borderRadius: '3px',
    '&:not(:last-child)': {marginRight: '10px'},
  },

  [`& .${classes.container}`]: {
    marginTop: '50px',
  },
}));

const NewsDetails = () => {
  const {messages, formatDate} = useIntl();
  const router = useRouter();
  const {newsId} = router.query;
  const {data: news, isLoading: isNoticeLoading} = useFetchPublicNoticeOrNews(
    Number(newsId),
  );

  const theme = useTheme();

  return (
    <StyledContainer maxWidth={'lg'}>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={6}>
          <Link href={LINK_FRONTEND_NEWS}>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}>
              {messages['news.list']}
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6} textAlign={'right'}>
          {news?.file_path && (
            <Tooltip title={messages['common.download_label']}>
              <Link
                target={'_blank'}
                href={FILE_SERVER_FILE_VIEW_ENDPOINT + news.file_path}>
                <Button variant={'contained'} endIcon={<DownloadIcon />}>
                  {messages['common.download']}
                </Button>
              </Link>
            </Tooltip>
          )}
        </Grid>

        <Grid item xs={12} mt={4}>
          <Box className={classes.date}>
            <DateRangeIcon color={'primary'} />
            <Typography color={'primary'}>
              {getIntlDateFromString(formatDate, news?.published_at)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant={'h3'} tabIndex={0} fontWeight={'bold'} aria-label={news?.title}>
            {news?.title}
          </Typography>
        </Grid>
        {isNoticeLoading ? (
          <Grid item xs={12}>
            <Skeleton variant='rectangular' width={1150} height={400} />
          </Grid>
        ) : (
          <>
            {news && news?.main_image_path && (
              <Grid item xs={12}>
                <CardMediaImageView
                  height='400'
                  sx={{
                    objectFit: 'unset',
                    [theme.breakpoints.down('sm')]: {
                      height: 150,
                    },
                    [theme.breakpoints.up('xl')]: {
                      height: 550,
                    },
                  }}
                  image={news?.main_image_path}
                  alt={
                    news?.image_alt_title ? news?.image_alt_title : news?.title
                  }
                  title={news?.title}
                />
              </Grid>
            )}
          </>
        )}

        <Grid item xs={12}>
          <div
            dangerouslySetInnerHTML={{
              __html: news?.details,
            }}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default NewsDetails;
