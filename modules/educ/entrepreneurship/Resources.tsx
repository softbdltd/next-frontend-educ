import React from 'react';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';
import {Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import CardMediaImageView from '../../../@core/elements/display/ImageView/CardMediaImageView';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import {Box} from '@mui/system';
import {useFetchPublicResources} from '../../../services/cmsManagement/hooks';
import ResourceSkeleton from './ResourceSkeleton';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';

const PREFIX = 'Entrepreneurship';

export const classes = {
  gridItem: `${PREFIX}-gridItem`,
  image: `${PREFIX}-image`,
  btn: `${PREFIX}-btn`,
  downloadBtn: `${PREFIX}-downloadBtn`,
  imageContainer: `${PREFIX}-imageContainer`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  marginTop: '20px',
  marginBottom: '20px',

  [`& .${classes.gridItem}`]: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  [`& .${classes.imageContainer}`]: {
    position: 'relative',
    [`& .${classes.image}`]: {
      borderRadius: '10px',
      height: '350px',
    },
    [`& .${classes.btn}`]: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'none',
    },
    '&:hover': {
      [`& .${classes.image}`]: {
        filter: 'brightness(50%)',
        transition: 'filter 0.3s ease-in-out',
      },
      [`& .${classes.btn}`]: {
        display: 'block',
      },
    },
  },

  [`& .${classes.downloadBtn}`]: {
    color: theme.palette.primary.main,
    backgroundColor: 'white',
    textTransform: 'none',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  },
}));

const Resources = () => {
  const {messages} = useIntl();
  const {data: resources, isLoading: isLoadingResources} =
    useFetchPublicResources();
  return (
    <StyledGrid container justifyContent={'space-between'}>
      <Grid item>
        <Typography pt={'22px'} variant={'h3'} fontWeight={'600'}>
          {messages['common.resource']}
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        {isLoadingResources ? (
          <ResourceSkeleton />
        ) : resources && resources?.length > 0 ? (
          resources.map((resource: any, index: number) => {
            return (
              <Grid
                key={index}
                xs={6}
                sm={6}
                md={3}
                item
                className={classes.gridItem}>
                <Box className={classes.imageContainer}>
                  <CardMediaImageView
                    className={classes.image}
                    image={resource?.thumbnail_image}
                    alt={resource?.title}
                  />
                  <Box className={classes.btn}>
                    <a
                      target='_blank'
                      href={
                        FILE_SERVER_FILE_VIEW_ENDPOINT + resource?.file_path
                      }
                      rel='noopener noreferrer'>
                      <Button
                        variant='contained'
                        color='primary'
                        className={classes.downloadBtn}
                        startIcon={<DownloadIcon />}>
                        <Typography variant={'body1'}>
                          {messages['common.download']}
                        </Typography>
                      </Button>
                    </a>
                  </Box>
                </Box>
                <Typography variant={'h6'}>{resource?.title}</Typography>
              </Grid>
            );
          })
        ) : (
          <NoDataFoundComponent />
        )}
      </Grid>
    </StyledGrid>
  );
};

export default Resources;
