import {Card, CardActionArea, CardContent, Typography} from '@mui/material';
import React, {FC} from 'react';
import {styled} from '@mui/material/styles';
import GalleryAlbumContentTypes from '../../dashboard/galleryAlbumContents/GalleryAlbumContentTypes';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';

const StyledTypography = styled(Typography)(({theme}) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

interface ContentItemCardProps {
  data: any;
  onClick: any;
}

const ContentItemCard: FC<ContentItemCardProps> = ({
  data,
  onClick: onClickCallback,
}) => {
  const thumbImg =
    data.content_type == GalleryAlbumContentTypes.IMAGE
      ? data.image_path
      : data.content_thumb_image_path;
  return (
    <Card>
      <CardActionArea
        onClick={() => {
          let eventData: any = {
            title: data.title,
            details: data.description,
          };
          if (data.content_type == GalleryAlbumContentTypes.IMAGE) {
            eventData.imagePath = data.image_path;
          } else {
            eventData.videoUrl = data.video_url;
          }
          onClickCallback(eventData);
        }}>
        <CardMediaImageView
          height='140'
          image={thumbImg}
          alt={data?.image_alt_title ? data.image_alt_title : data?.title}
          defaultImage={'/images/blank_gray_image.png'}
          title={data?.title}
        />

        {/*        <CardMediaImageView
          imageUrl={thumbImg ?? '/images/blank_gray_image.png'}
          height='140'
          imageAltText={
            data?.image_alt_title ? data.image_alt_title : data?.title
          }
          title={data?.title}
        />*/}

        {data?.content_type == GalleryAlbumContentTypes.VIDEO ? (
          <PlayCircleIcon
            sx={{
              position: 'absolute',
              top: 'calc(30% - 25px)',
              left: 'calc(50% - 35px)',
              height: '70px',
              width: '70px',
            }}
            color='primary'
          />
        ) : (
          <></>
        )}

        <CardContent>
          <StyledTypography gutterBottom variant='body1'>
            {data?.title}
          </StyledTypography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContentItemCard;
