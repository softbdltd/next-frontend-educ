import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import PaginationComponent from './components/PaginationComponent';
import CardWithImageComponent from './components/CardWithImageComponent';
import NewsOrNoticeFilterSection from './components/NewsOrNoticeFilterSection';
import SectionHeading from '../../@core/elements/common/SectionHeading';
import PageSizes from '../../@core/utilities/PageSizes';
import {typeUpcomingEvents} from '../../shared/constants/AppEnums';
import {useFetchPublicNoticeOrNewses} from '../../services/cmsManagement/hooks';
import CardWithImageSkeleton from './components/CardWithImageSkeleton';
import {LINK_FRONTEND_UPCOMING_EVENTS_DETAILS} from '../../@core/common/appLinks';
import Link from 'next/link';

const PREFIX = 'UpcomingEventsSection';

const classes = {
  headerTitle: `${PREFIX}-headerTitle`,
  moreBtn: `${PREFIX}-moreBtn`,
  paginationContainer: `${PREFIX}-paginationContainer`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  justifyContent: 'center',

  [`& .${classes.headerTitle}`]: {
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
  },
  [`& .${classes.paginationContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
  [`& .${classes.moreBtn}`]: {
    marginTop: '10px',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}));

const UpcomingEventsSection = () => {
  const {messages} = useIntl();
  const [noticeOrNewsFilter, setNoticeOrNewsFilter] = useState<any>({
    page_size: PageSizes.FOUR,
    type: typeUpcomingEvents.TYPE_UPCOMING_EVENT,
  });

  const {
    data: upcomingEventsList,
    isLoading: isLoadingUpcomingEventsList,
    metaData,
  } = useFetchPublicNoticeOrNewses(noticeOrNewsFilter);

  return (
    <StyledGrid container spacing={3} mt={4}>
      <Grid item xs={12}>
        <SectionHeading
          className={classes.headerTitle}
          title={messages['common.upcoming_events'] as string}
        />
      </Grid>
      <Grid item xs={12}>
        <NewsOrNoticeFilterSection
          setNoticeOrNewsFilter={setNoticeOrNewsFilter}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {isLoadingUpcomingEventsList ? (
              <>
                <Grid item xs={12} sm={4} md={6}>
                  <CardWithImageSkeleton />
                </Grid>
                <Grid item xs={12} sm={4} md={6}>
                  <CardWithImageSkeleton />
                </Grid>
                <Grid item xs={12} sm={4} md={6}>
                  <CardWithImageSkeleton />
                </Grid>
                <Grid item xs={12} sm={4} md={6}>
                  <CardWithImageSkeleton />
                </Grid>
              </>
            ) : upcomingEventsList && upcomingEventsList.length > 0 ? (
              <>
                {upcomingEventsList?.map(
                  (upcomingEvent: any, index: number) => (
                    <Link
                      key={upcomingEvent?.id}
                      href={
                        LINK_FRONTEND_UPCOMING_EVENTS_DETAILS +
                        upcomingEvent?.id
                      }
                      passHref>
                      <Grid key={index} item xs={12} sm={4} md={6}>
                        <CardWithImageComponent
                          title={upcomingEvent?.title}
                          imageUrl={upcomingEvent?.thumb_image_path}
                          date={upcomingEvent?.published_at}
                        />
                      </Grid>
                    </Link>
                  ),
                )}
              </>
            ) : (
              <Grid item xs={12}>
                <NoDataFoundComponent />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.paginationContainer} xs={12}>
        {upcomingEventsList && upcomingEventsList?.length > 0 && (
          <PaginationComponent
            setPaginationFilter={setNoticeOrNewsFilter}
            pageMetaData={metaData}
          />
        )}
      </Grid>
    </StyledGrid>
  );
};

export default UpcomingEventsSection;
