import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Container, Grid, Skeleton} from '@mui/material';
import {Fade, Zoom} from 'react-awesome-reveal';
import {H1, Link} from '../../@core/elements/common';
import {
  BLOCK_ID_INSTITUTE_DETAILS,
  CONTENT_ID_INSTITUTE_DETAILS,
} from '../../@core/utilities/StaticContentConfigs';
import ContentTypes from '../dashboard/recentActivities/ContentTypes';
import {getEmbeddedVideoUrl} from '../../@core/utilities/helpers';
import PageBlockTemplateTypes from '../../@core/utilities/PageBlockTemplateTypes';
import {LINK_INSTITUTE_FRONTEND_STATIC_CONTENT} from '../../@core/common/appLinks';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import {useFetchStaticPageBlock} from '../../services/cmsManagement/hooks';
import CardMediaImageView from '../../@core/elements/display/ImageView/CardMediaImageView';

const PREFIX = 'AboutSection';

const classes = {
  root: `${PREFIX}-root`,
  heading: `${PREFIX}-heading`,
  desc: `${PREFIX}-desc`,
  detailsButton: `${PREFIX}-detailsButton`,
  assessmentImage: `${PREFIX}-assessmentImage`,
  youtubePlayerBox: `${PREFIX}-youtubePlayerBox`,
  youtubePlayerMobileView: `${PREFIX}-youtubePlayerMobileView`,
  youtubePlayer: `${PREFIX}-youtubePlayer`,
  imageView: `${PREFIX}-imageView`,
  attachmentWrapper: `${PREFIX}-attachmentWrapper`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`&.${classes.root}`]: {
    position: 'relative',
    padding: '10px',
    background: theme.palette.grey[200],
    color: theme.palette.text.primary,
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      padding: '50px',
      marginTop: '110px',
    },
  },

  [`& .${classes.heading}`]: {
    color: theme.palette.primary.main,
    fontSize: '2.25rem',
    fontWeight: 'bold',
  },

  [`& .${classes.desc}`]: {
    color: theme.palette.text.primary,
  },

  [`& .${classes.detailsButton}`]: {
    marginTop: '20px',
  },

  [`& .${classes.assessmentImage}`]: {
    height: '340px',
  },

  [`& .${classes.youtubePlayerMobileView}`]: {
    height: '360px',
    borderRadius: '15px',
    bottom: '80px',
    width: '75%',
    [theme.breakpoints.only('xs')]: {
      height: '260px',
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  [`& .${classes.youtubePlayer}`]: {
    height: '300px',
    width: '400px',
    borderRadius: '15px',
    marginTop: '-150px',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    [theme.breakpoints.down('lg')]: {
      height: '210px',
      width: '310px',
    },
  },
  [`& .${classes.imageView}`]: {
    height: '420px',
    borderRadius: '15px',
    marginTop: '-150px',
    width: '20rem',
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      marginTop: '0px',
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  [`& .${classes.attachmentWrapper}`]: {
    [theme.breakpoints.only('sm')]: {
      textAlign: 'center',
    },
  },
}));

const AboutSection = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [templateConfig, setTemplateConfig] = useState<any>({
    textLeft: true,
  });

  const [staticPageParams] = useState<any>({});

  const {data: blockData, isLoading} = useFetchStaticPageBlock(
    BLOCK_ID_INSTITUTE_DETAILS,
    staticPageParams,
  );

  useEffect(() => {
    if (blockData) {
      if (
        blockData.attachment_type != ContentTypes.IMAGE &&
        blockData?.video_url
      ) {
        const embeddedUrl = getEmbeddedVideoUrl(blockData?.video_url);
        setVideoUrl(embeddedUrl);
      }

      if (blockData.template_code == PageBlockTemplateTypes.PBT_RL) {
        setTemplateConfig({
          textLeft: false,
        });
      } else if (blockData.template_code == PageBlockTemplateTypes.PBT_LR) {
        setTemplateConfig({
          textLeft: true,
        });
      }
    }
  }, [blockData]);

  return (
    <StyledGrid container xl={12} className={classes.root}>
      {isLoading ? (
        <Skeleton variant={'rectangular'} width={'100%'} height={400} />
      ) : blockData ? (
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={4}
            justifyContent='space-around'
            alignItems='center'>
            <Grid
              item
              xs={12}
              md={7}
              order={{xs: templateConfig.textLeft ? 1 : 2}}>
              <Fade direction='down'>
                <H1 gutterBottom={true} className={classes.heading}>
                  {blockData?.title}
                </H1>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: blockData?.content,
                  }}
                />

                {blockData?.is_button_available == 1 ? (
                  <Link
                    href={
                      LINK_INSTITUTE_FRONTEND_STATIC_CONTENT +
                      CONTENT_ID_INSTITUTE_DETAILS
                    }>
                    <Button
                      variant='outlined'
                      className={classes.detailsButton}
                      size={'medium'}
                      color={'primary'}>
                      {blockData?.button_text}
                      <ArrowForwardIcon color={'primary'} />
                    </Button>
                  </Link>
                ) : (
                  <Box />
                )}
              </Fade>
            </Grid>

            {blockData?.is_attachment_available == 1 && (
              <Grid
                item
                xs={12}
                md={4}
                order={{xs: templateConfig.textLeft ? 2 : 1}}
                className={classes.attachmentWrapper}>
                {blockData.attachment_type == ContentTypes.IMAGE &&
                  blockData.image_path && (
                    <Zoom>
                      <CardMediaImageView
                        className={classes.imageView}
                        image={blockData?.image_path}
                        alt={
                          blockData?.image_alt_title
                            ? blockData?.image_alt_title
                            : blockData?.title
                        }
                      />
                    </Zoom>
                  )}

                {blockData.attachment_type != ContentTypes.IMAGE && videoUrl && (
                  <Zoom>
                    <iframe
                      className={classes.youtubePlayerMobileView}
                      src={videoUrl}
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      allowFullScreen
                      title='Embedded youtube'
                    />
                    <iframe
                      className={classes.youtubePlayer}
                      src={videoUrl}
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      allowFullScreen
                      title='Embedded youtube'
                    />
                  </Zoom>
                )}
              </Grid>
            )}
          </Grid>
        </Container>
      ) : (
        <Grid container sx={{marginTop: '-35px'}}>
          <NoDataFoundComponent messageTextType={'h6'} />
        </Grid>
      )}
    </StyledGrid>
  );
};

export default AboutSection;
