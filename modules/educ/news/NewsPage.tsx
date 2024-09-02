import SearchIcon from '@mui/icons-material/Search';
import { Button, Container, Grid, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { LINK_FRONTEND_NEWS_DETAILS } from '../../../@core/common/appLinks';
import { H2 } from '../../../@core/elements/common';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import PageSizes from '../../../@core/utilities/PageSizes';
import { useFetchPublicNoticeOrNewses } from '../../../services/cmsManagement/hooks';
import { typeUpcomingEvents } from '../../../shared/constants/AppEnums';
import CardWithImageComponent from '../../home/components/CardWithImageComponent';
import PaginationComponent from '../../home/components/PaginationComponent';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import { urlParamsUpdate } from '../../learner/learnerConstants';
import NewsCover from './NewsCover';
import NewsPageSkeleton from './NewsPageSkeleton';

const PREFIX = 'NewsPage';

const classes = {
  moreBtn: `${PREFIX}-moreBtn`,
  paginationContainer: `${PREFIX}-paginationContainer`,
  dateFilterContainer: `${PREFIX}-dateFilterContainer`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  justifyContent: 'center',
  marginTop: '0',
  [theme.breakpoints.up('md')]: {
    marginTop: '10px',
  },
  [`& .${classes.paginationContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.dateFilterContainer}`]: {
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
  [`& .${classes.moreBtn}`]: {
    marginTop: '10px',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}));

const NewsPage = () => {
  const {messages} = useIntl();
  const [noticeOrNewsFilter, setNoticeOrNewsFilter] = useState<any>(null);
  const [featuredItem, setFeaturedItem] = useState<any>(null);
  const router = useRouter();

  const {
    data: newsList,
    isLoading: isLoadingNewsList,
    metaData,
  } = useFetchPublicNoticeOrNewses(noticeOrNewsFilter);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<any>();

  useEffect(() => {
    if (newsList?.length > 0 && metaData?.current_page == 1) {
      setFeaturedItem(newsList[0]);
    }

    if (newsList?.length <= 0) {
      setFeaturedItem(null);
    }
  }, [newsList, metaData]);

  useEffect(() => {
    const filter: any = {
      ...router.query,
      page_size: PageSizes.TWELVE,
      page: router.query?.page ? Number(router.query?.page) : 1,
      type: typeUpcomingEvents.TYPE_NEWS,
    };
    setNoticeOrNewsFilter(filter);
    reset({
      published_at: filter?.published_at ?? null,
    });
  }, [router.query]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const updatedParams = {
      ...router.query,
    };

    if (data?.published_at) {
      updatedParams.published_at = data.published_at;
    } else {
      delete updatedParams.published_at;
    }

    urlParamsUpdate(router, updatedParams);
  };

  return (
    <Container maxWidth={'lg'}>
      <StyledGrid container spacing={3} mb={5}>
        <Grid item xs={12}>
          <Grid container justifyContent={'space-between'}>
            <Grid xs={12} md={5} mb={2}>
              <H2 tabIndex={0} fontWeight={'600'}>
                {messages['notice_type.news']}
              </H2>
            </Grid>
            <Grid xs={12} md={5.5}>
              <Grid
                container
                spacing={2}
                className={classes.dateFilterContainer}>
                <Grid item xs={5} md={4}>
                  <CustomDatePicker
                    id='published_at'
                    label={messages['common.date']}
                    control={control}
                    errorInstance={errors}
                  />
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    sx={{p: {xs: '5.5px 16px', md: '7px 16px'}}}
                    variant={'contained'}
                    endIcon={<SearchIcon />}>
                    {messages['common.search']}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {isLoadingNewsList ? (
          <Grid item xs={12}>
            <Skeleton
              animation='wave'
              variant='rectangular'
              sx={{height: '360px', width: '100%', borderRadius: '20px'}}
            />
          </Grid>
        ) : featuredItem ? (
          <Grid item xs={12}>
            <NewsCover featuredItem={featuredItem} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <NoDataFoundComponent
              messageType={messages['common.cover_image']}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {isLoadingNewsList ? (
                <NewsPageSkeleton />
              ) : newsList && newsList.length > 0 ? (
                <>
                  {newsList?.map((item: any) => (
                    <Link
                      key={item?.id}
                      href={LINK_FRONTEND_NEWS_DETAILS + item?.id}
                      passHref>
                      <Grid item xs={12} md={3}>
                        <CardWithImageComponent
                          title={item?.title}
                          imageUrl={item?.thumb_image_path}
                          date={item?.published_at}
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
            <PaginationComponent
              pageMetaData={metaData}
              isRoutePagination={true}
            />
          )}
        </Grid>
      </StyledGrid>
    </Container>
  );
};

export default NewsPage;
