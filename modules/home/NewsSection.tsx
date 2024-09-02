import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import PaginationComponent from './components/PaginationComponent';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CardWithImageComponent from './components/CardWithImageComponent';
import NewsOrNoticeFilterSection from './components/NewsOrNoticeFilterSection';
import SectionHeading from '../../@core/elements/common/SectionHeading';
import {useFetchPublicNoticeOrNewses} from '../../services/cmsManagement/hooks';
import PageSizes from '../../@core/utilities/PageSizes';
import {typeUpcomingEvents} from '../../shared/constants/AppEnums';
import CardWithImageSkeleton from './components/CardWithImageSkeleton';
import {
  LINK_FRONTEND_NEWS,
  LINK_FRONTEND_NEWS_DETAILS,
} from '../../@core/common/appLinks';
import Link from 'next/link';

const PREFIX = 'NewsSection';

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

const NewsSection = () => {
  const {messages} = useIntl();
  const [noticeOrNewsFilter, setNoticeOrNewsFilter] = useState<any>({
    page_size: PageSizes.FOUR,
    type: typeUpcomingEvents.TYPE_NEWS,
  });

  const {
    data: newsList,
    isLoading: isLoadingNewsList,
    metaData,
  } = useFetchPublicNoticeOrNewses(noticeOrNewsFilter);

  return (
    <StyledGrid container spacing={3} mt={4}>
      <Grid item xs={12}>
        <SectionHeading
          className={classes.headerTitle}
          title={messages['notice_type.news'] as string}
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
            {isLoadingNewsList ? (
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
            ) : newsList && newsList.length > 0 ? (
              <>
                {newsList?.map((news: any, index: number) => (
                  <Link
                    key={news?.id}
                    href={LINK_FRONTEND_NEWS_DETAILS + news?.id}
                    passHref>
                    <Grid key={index} item xs={12} sm={4} md={6}>
                      <CardWithImageComponent
                        title={news?.title}
                        imageUrl={news?.thumb_image_path}
                        date={news?.published_at}
                      />
                    </Grid>
                  </Link>
                ))}
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
        {newsList && newsList?.length > 0 && (
          <>
            <PaginationComponent
              setPaginationFilter={setNoticeOrNewsFilter}
              pageMetaData={metaData}
            />
            {metaData.total_page > 1 && (
              <Link href={LINK_FRONTEND_NEWS} passHref>
                <Button
                  className={classes.moreBtn}
                  variant={'outlined'}
                  endIcon={<KeyboardDoubleArrowRightIcon />}>
                  {messages['common.more']}
                </Button>
              </Link>
            )}
          </>
        )}
      </Grid>
    </StyledGrid>
  );
};

export default NewsSection;
