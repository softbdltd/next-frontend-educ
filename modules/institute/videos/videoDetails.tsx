import {styled} from '@mui/material/styles';
import {Card, CardContent, Container, Grid, Skeleton} from '@mui/material';
import {H5} from '../../../@core/elements/common';
import VideoPlayer from './videoPlayer';
import React, {useEffect, useState} from 'react';
import {PlayCircleFilledWhiteOutlined} from '@mui/icons-material';
import {useRouter} from 'next/router';
import {useFetchPublicGalleryAlbumContent} from '../../../services/cmsManagement/hooks';
import {getEmbeddedVideoUrl} from '../../../@core/utilities/helpers';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';

const PREFIX = 'VideoDetails';

const classes = {
  customPlayer: `${PREFIX}-customPlayer`,
  playIcon: `${PREFIX}-playIcon`,
  customPlayerCard: `${PREFIX}-customPlayerCard`,
  playButtonText: `${PREFIX}-playButtonText`,
};

const StyledContainer = styled(Container)(() => ({
  [`& .${classes.customPlayer}`]: {
    width: '100%',
    height: '280px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    textDecoration: 'none',
  },

  [`& .${classes.playIcon}`]: {
    fontSize: '90px',
    position: 'absolute',
  },

  [`& .${classes.customPlayerCard}`]: {
    backgroundColor: '#b8c6db',
    backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)',
  },

  [`& .${classes.playButtonText}`]: {
    position: 'absolute',
    color: 'rgb(134 145 46)',
    textShadow: '#437436 1px 1px',
  },
}));

const VideoDetails = () => {
  const router = useRouter();
  const {videoId}: any = router.query;
  const {data: videoData, isLoading: isLoadingVideos} =
    useFetchPublicGalleryAlbumContent(videoId);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (videoData?.video_url) {
      const embeddedUrl = getEmbeddedVideoUrl(videoData?.video_url);
      setVideoUrl(embeddedUrl);
    }
  }, [videoData]);

  return (
    <StyledContainer maxWidth={'md'}>
      {isLoadingVideos ? (
        <Grid
          item
          xs={12}
          sx={{display: 'flex', justifyContent: 'space-evenly'}}>
          <Skeleton variant='rectangular' width={'22%'} height={140} />
        </Grid>
      ) : videoData ? (
        <Grid container spacing={3} mt={2}>
          {videoUrl ? (
            <Grid item xs={12}>
              <VideoPlayer url={videoUrl} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Card className={classes.customPlayerCard}>
                <a href={videoData.video_url} target='_blank' rel='noreferrer'>
                  <CardContent className={classes.customPlayer}>
                    <PlayCircleFilledWhiteOutlined
                      className={classes.playIcon}
                    />
                    <div className={classes.playButtonText}>
                      Click to Play in an external Player
                    </div>
                  </CardContent>
                </a>
              </Card>
            </Grid>
          )}
          <Grid item xs={12}>
            <H5>{videoData.title}</H5>
          </Grid>
          <Grid item xs={12} display={'flex'}>
            <div dangerouslySetInnerHTML={{__html: videoData.description}} />
          </Grid>
        </Grid>
      ) : (
        <Grid container mt={3}>
          <Grid item xs={12}>
            <NoDataFoundComponent messageTextType={'h6'} />
          </Grid>
        </Grid>
      )}
    </StyledContainer>
  );
};

export default VideoDetails;
