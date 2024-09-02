import React, {useEffect, useState} from 'react';
import {Grid, Skeleton, Typography} from '@mui/material';
import SectionHeading from '../../../@core/elements/common/SectionHeading';
import CardWithImageComponent from '../../home/components/CardWithImageComponent';
import NoDataFoundComponent from '../../learner/common/NoDataFoundComponent';
import PaginationComponent from '../../home/components/PaginationComponent';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {useFetchBlogAndSuccessStories} from '../../../services/IndustryManagement/hooks';
import PageSizes from '../../../@core/utilities/PageSizes';
import CardWithImageSkeleton from '../../home/components/CardWithImageSkeleton';
import {LINK_FRONTEND_ENTREPRENEURSHIP_DETAILS} from '../../../@core/common/appLinks';
import Link from 'next/link';
import BlogAndSuccessStoriesCover from './BlogAndSuccessStoriesCover';
import {Fonts} from '../../../shared/constants/AppEnums';
import BlogAndSuccessStoriesFilter from './BlogAndSuccessStoriesFilter';

const PREFIX = 'BlogAndSuccessStories';

const classes = {
  headerTitle: `${PREFIX}-headerTitle`,
  sectionHeading: `${PREFIX}-sectionHeading`,
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
  [`& .${classes.sectionHeading}`]: {
    textAlign: 'center',
    // fontSize: '1.9rem',
    fontWeight: Fonts.BOLD,
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
  },
  [`& .${classes.paginationContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  [`& .${classes.moreBtn}`]: {
    marginTop: '10px',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}));

const BlogAndSuccessStories = () => {
  const {messages} = useIntl();
  const [apiFilter, setApiFilter] = useState<any>({
    page_size: PageSizes.TWELVE,
  });
  const [featuredItem, setFeaturedItem] = useState<any>(null);

  const {
    data: blogAndSuccessStoriesList,
    isLoading: isLoadingBlogAndSuccessStoriesList,
    metaData,
  } = useFetchBlogAndSuccessStories(apiFilter);

  useEffect(() => {
    if (blogAndSuccessStoriesList?.length > 0 && metaData?.current_page == 1) {
      setFeaturedItem(blogAndSuccessStoriesList[0]);
    }
  }, [blogAndSuccessStoriesList, metaData]);

  return (
    <>
      <StyledGrid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <SectionHeading
            className={classes.headerTitle}
            title={messages['common.entrepreneurship'] as string}
          />
        </Grid>
        {isLoadingBlogAndSuccessStoriesList ? (
          <Grid item xs={12}>
            <Skeleton
              animation='wave'
              variant='rectangular'
              sx={{height: '360px', width: '100%', borderRadius: '20px'}}
            />
          </Grid>
        ) : featuredItem ? (
          <Grid item xs={12}>
            <BlogAndSuccessStoriesCover featuredItem={featuredItem} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <NoDataFoundComponent
              messageType={messages['common.cover_image']}
            />
          </Grid>
        )}
        <Grid item container justifyContent={'space-between'}>
          <Grid item pb={'15px'} pt={'12px'}>
            <Typography className={classes.sectionHeading} variant={'h3'}>
              {messages['blog_and_success_stories.label'] as string}
            </Typography>
          </Grid>
          <Grid item pt={'12px'}>
            <BlogAndSuccessStoriesFilter setApiFilters={setApiFilter} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {isLoadingBlogAndSuccessStoriesList ? (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <CardWithImageSkeleton imageHeight={'200px'} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <CardWithImageSkeleton imageHeight={'200px'} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <CardWithImageSkeleton imageHeight={'200px'} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <CardWithImageSkeleton imageHeight={'200px'} />
                  </Grid>
                </>
              ) : blogAndSuccessStoriesList &&
                blogAndSuccessStoriesList.length > 0 ? (
                <>
                  {blogAndSuccessStoriesList?.map((item: any) => (
                    <Link
                      key={item?.id}
                      href={LINK_FRONTEND_ENTREPRENEURSHIP_DETAILS + item?.id}
                      passHref>
                      <Grid item xs={12} sm={6} md={3}>
                        <CardWithImageComponent
                          imageUrl={item?.thumbnail_image}
                          title={item?.title}
                          date={item?.created_at}
                          bottomText={item?.full_name}
                          imageHeight={'200px'}
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
          {blogAndSuccessStoriesList &&
            blogAndSuccessStoriesList?.length > 0 && (
              <PaginationComponent
                setPaginationFilter={setApiFilter}
                pageMetaData={metaData}
              />
            )}
        </Grid>
      </StyledGrid>
    </>
  );
};

export default BlogAndSuccessStories;
