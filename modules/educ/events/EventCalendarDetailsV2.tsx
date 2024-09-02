import DownloadIcon from '@mui/icons-material/Download';
import {Box, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import React from 'react';
import {useIntl} from 'react-intl';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../@core/common/apiRoutes';
import CommonButton from '../../@core/elements/button/CommonButton/CommonButton';
import {Link} from '../../@core/elements/common';
import ImageView from '../../@core/elements/display/ImageView/ImageView';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
const PREFIX = 'CourseContentSection';

const classes = {
  boxMargin: `${PREFIX}-boxMargin`,
  sectionTitleStyle: `${PREFIX}-sectionTitleStyle`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.sectionTitleStyle}`]: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
  },

  [`&  .${classes.boxMargin}`]: {
    marginTop: 20,
    marginBottom: 25,
  },
}));

const EventCalendarDetailsV2 = ({itemData}: any) => {
  const {messages} = useIntl();
  return (
    <StyledBox>
      {itemData ? (
        <>
          <Box className={classes.boxMargin}>
            <h2 className={classes.sectionTitleStyle}>
              {messages['common.title']}
            </h2>
            <Typography sx={{paddingTop: '4px'}}>{itemData?.title}</Typography>
          </Box>
          <Box className={classes.boxMargin}>
            <h2 className={classes.sectionTitleStyle}>
              {messages['common.event_start_date']}
            </h2>
            <Typography sx={{paddingTop: '4px'}}>
              {itemData?.start_date}
            </Typography>
          </Box>
          <Box className={classes.boxMargin}>
            <h2 className={classes.sectionTitleStyle}>
              {messages['common.event_end_date']}
            </h2>
            <Typography sx={{paddingTop: '4px'}}>
              {itemData?.end_date}
            </Typography>
          </Box>
          <Box className={classes.boxMargin}>
            <h2 className={classes.sectionTitleStyle}>
              {messages['common.start_time']}
            </h2>
            <Typography sx={{paddingTop: '4px'}}>
              {itemData?.start_time}
            </Typography>
          </Box>
          <Box className={classes.boxMargin}>
            <h2 className={classes.sectionTitleStyle}>
              {messages['common.end_time']}
            </h2>
            <Typography sx={{paddingTop: '4px'}}>
              {itemData?.end_time}
            </Typography>
          </Box>
          {itemData?.image_path && (
            <Box className={classes.boxMargin}>
              <h2 className={classes.sectionTitleStyle}>
                {messages['common.photo']}
              </h2>
              <Link
                href={FILE_SERVER_FILE_VIEW_ENDPOINT + itemData?.image_path}
                target={'_blank'}>
                <ImageView
                  label={''}
                  imageUrl={itemData?.image_path}
                  isLoading={false}
                />
              </Link>
            </Box>
          )}
          {itemData?.file_path && (
            <Box className={classes.boxMargin}>
              <h2 className={classes.sectionTitleStyle}>
                {messages['common.photo']}
              </h2>
              <Link
                underline='none'
                href={`${FILE_SERVER_FILE_VIEW_ENDPOINT + itemData?.file_path}`}
                download
                target={'_blank'}
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  marginTop: '2rem',
                }}>
                <CommonButton
                  startIcon={<DownloadIcon />}
                  key={1}
                  onClick={() => console.log('file downloading')}
                  btnText={'common.download_file'}
                  variant={'outlined'}
                  color={'primary'}
                />
              </Link>
            </Box>
          )}
        </>
      ) : (
        <NoDataFoundComponent />
      )}
    </StyledBox>
  );
};

export default EventCalendarDetailsV2;
