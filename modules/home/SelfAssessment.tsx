import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Container, Grid} from '@mui/material';
import {Zoom} from 'react-awesome-reveal';
import {H1, Link} from '../../@core/elements/common';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  BLOCK_ID_SELF_ASSESSMENT,
  CONTENT_ID_SELF_ASSESSMENT,
} from '../../@core/utilities/StaticContentConfigs';
import {LINK_NICE3_FRONTEND_STATIC_CONTENT} from '../../@core/common/appLinks';
import ContentTypes from '../dashboard/recentActivities/ContentTypes';
import {getEmbeddedVideoUrl} from '../../@core/utilities/helpers';
import PageBlockTemplateTypes from '../../@core/utilities/PageBlockTemplateTypes';
import {useFetchStaticPageBlock} from '../../services/cmsManagement/hooks';
import CardMediaImageView from '../../@core/elements/display/ImageView/CardMediaImageView';

const PREFIX = 'SelfAssessment';

const classes = {
  detailsButton: `${PREFIX}-detailsButton`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.detailsButton}`]: {
    '& svg': {
      paddingLeft: '5px',
    },
  },
}));

const SelfAssessment = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [templateConfig, setTemplateConfig] = useState<any>({
    textLeft: true,
    imageOrVideoLeft: false,
  });
  const [staticPageParams] = useState<any>({});

  const {data: blockData} = useFetchStaticPageBlock(
    BLOCK_ID_SELF_ASSESSMENT,
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
    <>
      {blockData ? (
        <StyledContainer maxWidth={'lg'}>
          <Grid container sx={{marginTop: '40px'}} alignItems={'center'}>
            <Grid
              item
              xs={12}
              md={8}
              order={{xs: templateConfig.textLeft ? 1 : 2}}
              sx={
                templateConfig.textLeft
                  ? {paddingRight: '20px'}
                  : {paddingLeft: '20px'}
              }>
              <H1 style={{fontSize: '2.75rem', fontWeight: 'bold'}}>
                {blockData?.title}
              </H1>
              <div
                dangerouslySetInnerHTML={{
                  __html: blockData?.content,
                }}
              />

              {blockData?.is_button_available == 1 && (
                <Link
                  href={
                    LINK_NICE3_FRONTEND_STATIC_CONTENT +
                    CONTENT_ID_SELF_ASSESSMENT
                  }>
                  <Button variant='contained' className={classes.detailsButton}>
                    {blockData?.button_text}
                    <ArrowForwardIcon />
                  </Button>
                </Link>
              )}
            </Grid>
            {blockData?.is_attachment_available == 1 && (
              <Grid
                item
                xs={12}
                md={4}
                order={{xs: templateConfig.textLeft ? 2 : 1}}>
                {blockData.attachment_type == ContentTypes.IMAGE &&
                  blockData.image_path && (
                    <Zoom>
                      <CardMediaImageView
                        sx={{maxHeight: '265px', objectFit: 'unset'}}
                        image={blockData?.image_path}
                        alt={blockData?.image_alt_title}
                      />
                    </Zoom>
                  )}

                {blockData.attachment_type != ContentTypes.IMAGE && videoUrl && (
                  <Zoom>
                    <iframe
                      width='100%'
                      height='230'
                      style={{
                        borderRadius: '15px',
                      }}
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
        </StyledContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default SelfAssessment;
