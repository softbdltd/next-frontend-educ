import React, {useCallback, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid} from '@mui/material';
import CourseInfoBlock from './components/CourseInfoBlock';
import {useIntl} from 'react-intl';
import PostLoadingSkeleton from '../common/PostLoadingSkeleton';
import {H1} from '../../../@core/elements/common';
import {useCustomStyle} from '../../../@core/hooks/useCustomStyle';
import {useFetchYouthFeedDataList} from '../../../services/learnerManagement/hooks';
import {FeedItemTypes} from '../../../@core/utilities/FeedItemTypes';
import JobCardComponent from '../../../@core/elements/JobCardComponent';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import EnrolementInfoPopup from '../courseDetails/EnrolementInfoPopup';

const PREFIX = 'PostSection';

const classes = {
  recentFeedSectionTitle: `${PREFIX}-recentFeedSectionTitle`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.recentFeedSectionTitle}`]: {
    fontWeight: 'bold',
  },
}));

interface PostSectionProps {
  filters?: any;
  pageIndex: number;
  setLoadingMainPostData: any;
  isSearching: boolean;
}

const PostSection = ({
  filters,
  pageIndex,
  setLoadingMainPostData,
  isSearching,
}: PostSectionProps) => {
  const {messages} = useIntl();
  const result = useCustomStyle();
  const [feedDataFilters] = useState({});
  const [posts, setPosts] = useState<Array<any>>([]);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const {
    data: feedData,
    isLoading,
    mutate: mutateFeedData,
  } = useFetchYouthFeedDataList(feedDataFilters);

  useEffect(() => {
    setLoadingMainPostData(isLoading || (feedData && feedData.length == 0));
  }, [isLoading]);

  useEffect(() => {
    if (feedData && feedData.length > 0) {
      let dataLists: any = feedData;
      if (filters?.search_text) {
        dataLists = getFilteredList();
      }

      if (filters?.loc_district_id) {
        dataLists = getFilteredListForDistricts();
      }

      let total = pageIndex * filters.page_size;
      let start = 0;
      let end = dataLists.length;

      let total_page = Math.ceil(end / filters.page_size);

      if (total > dataLists.length) {
        start = (pageIndex - 1) * filters.page_size;
        setLoadingMainPostData(true);
      } else {
        start = (pageIndex - 1) * filters.page_size;
        end = pageIndex * filters.page_size;
        setLoadingMainPostData(false);
      }

      if (pageIndex == 1) {
        setPosts(dataLists.slice(start, end));
      } else if (pageIndex <= total_page) {
        setPosts((prevPosts: any) => {
          return [...prevPosts, ...dataLists.slice(start, end)];
        });
      }
    }
  }, [feedData, filters]);

  const getFilteredListForDistricts = () => {
    return feedData?.filter((item: any) => {
      const districtId = filters?.loc_district_id;
      const jobLocationsObj = item?.additional_job_information;
      let job;
      let course;

      if (item.job_id) {
        if (jobLocationsObj?.job_place_type === 1) {
          if (jobLocationsObj?.job_locations?.length === 0) {
            return true;
          } else {
            job = jobLocationsObj?.job_locations?.filter(
              (loc: any) => loc.loc_district_id === districtId,
            );
          }
        }
      } else {
        course = item?.locations?.filter(
          (loc: any) => loc.loc_district_id === districtId,
        );
      }

      return job?.length > 0 || course?.length > 0;
    });
  };

  const getFilteredList = () => {
    const searchText = filters.search_text;
    return feedData.filter((item: any) => {
      return !!(
        item?.job_title?.includes(searchText) ||
        item?.job_title_en?.includes(searchText) ||
        item?.industry_association_title?.includes(searchText) ||
        item?.industry_association_title_en?.includes(searchText) ||
        item?.organization_title?.includes(searchText) ||
        item?.organization_title_en?.includes(searchText) ||
        item?.title?.includes(searchText) ||
        item?.title_en?.includes(searchText) ||
        item?.institute_title?.includes(searchText) ||
        item?.institute_title_en?.includes(searchText)
      );
    });
  };

  const onJobPopupClose = () => {
    mutateFeedData();
  };

  const getPostItem = (post: any) => {
    switch (Number(post.feed_item_type)) {
      case FeedItemTypes.COURSE:
        return (
          <CourseInfoBlock
            course={post}
            openEnrollmentViewModal={openEnrollmentViewModal}
          />
        );
      case FeedItemTypes.JOB:
        return (
          <JobCardComponent
            job={post}
            size={'small'}
            onPopupClose={onJobPopupClose}
          />
        );
      default:
        return <></>;
    }
  };

  const onCloseViewModal = useCallback(() => {
    setIsOpenViewModal(false);
    setSelectedCourse(null);
  }, []);

  const openEnrollmentViewModal = useCallback((course: any) => {
    setSelectedCourse(course);
    setIsOpenViewModal(true);
  }, []);

  return (
    <React.Fragment>
      <StyledGrid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <H1 sx={{...result.body1}} className={classes.recentFeedSectionTitle}>
            {messages['learner_feed.recent_post']}
          </H1>
        </Grid>

        {isLoading ? (
          <Grid item xs={12}>
            <PostLoadingSkeleton />
          </Grid>
        ) : posts && posts.length > 0 ? (
          posts.map((post: any, index) => {
            return (
              <Grid item xs={12} key={index}>
                {getPostItem(post)}
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Box sx={{textAlign: 'center', fontSize: 20}}>
              <NoDataFoundComponent messageTextType={'h6'} />
            </Box>
          </Grid>
        )}
      </StyledGrid>
      {isOpenViewModal && selectedCourse && (
        <EnrolementInfoPopup
          onClose={onCloseViewModal}
          enrollments={selectedCourse?.enrollments}
          courseId={selectedCourse?.id}
        />
      )}
    </React.Fragment>
  );
};

export default PostSection;
