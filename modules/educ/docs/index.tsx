import DownloadIcon from '@mui/icons-material/Download';
import {Container, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import React from 'react';
import {useIntl} from 'react-intl';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import {useFetchPublicSupportingDocs} from '../../../services/cmsManagement/hooks';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import SupportingDocskeleton from '../entrepreneurship/ResourceSkeleton';

const PREFIX = 'docs';
export const classes = {
  gridItem: `${PREFIX}-gridItem`,
  btn: `${PREFIX}-btn`,
  downloadBtn: `${PREFIX}-downloadBtn`,
  boxContainer: `${PREFIX}-boxContainer`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  marginTop: '20px',
  marginBottom: '20px',

  [`& .${classes.gridItem}`]: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  [`& .${classes.boxContainer}`]: {
    position: 'relative',
    boxShadow: '0px 0px 8px 0px #c3c3c3',
    borderRadius: '10px',
    padding: '15px 7px',
    minHeight: '130px',

    [`& .${classes.btn}`]: {
      position: 'absolute',
      bottom: '10%',
      left: '50%',
      transform: 'translate(-50%, -10%)',
      display: 'none',
    },

    '&:hover': {
      backgroundColor: '#ecedebfa',
      transition: 'filter 0.3s ease-in-out',

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

const DocsPage = () => {
  const {messages} = useIntl();
  const {data: SupportingDocs, isLoading: isLoadingSupportingDocs} =
    useFetchPublicSupportingDocs();
  return (
    <Container maxWidth={'lg'}>
      <StyledGrid container justifyContent={'space-between'}>
        <Grid item>
          <Typography pt={'22px'} variant={'h3'} fontWeight={'600'}>
            {messages['menu.supporting_documents']}
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          {isLoadingSupportingDocs ? (
            <SupportingDocskeleton />
          ) : SupportingDocs && SupportingDocs?.length > 0 ? (
            SupportingDocs.map((doc: any, index: number) => {
              return (
                <Grid
                  key={index}
                  xs={6}
                  sm={6}
                  md={4}
                  item
                  className={classes.gridItem}>
                  <Box className={classes.boxContainer}>
                    <Typography variant={'h1'} align={'center'}>
                      {doc?.title}
                    </Typography>
                    <Box className={classes.btn}>
                      <a
                        target='_blank'
                        href={FILE_SERVER_FILE_VIEW_ENDPOINT + doc?.file_path}
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
                </Grid>
              );
            })
          ) : (
            <NoDataFoundComponent />
          )}
        </Grid>
      </StyledGrid>
    </Container>
  );
};

export default DocsPage;
