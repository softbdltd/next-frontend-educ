import React, {useCallback, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import BasicInfo from './BasicInfo';
import OverviewSection from './OverviewSection';
import PostSection from './PostSection';
import RecentJobSection from './RecentJobSection';
import CourseListSection from './CourseListSection';
import SideMenu from '../../../@core/elements/YouthSideMenu';
import {Container, Grid} from '@mui/material';
import Scrollbar from '../../../@core/core/Scrollbar';
import {debounce} from 'lodash';
import PageSizes from '../../../@core/utilities/PageSizes';
import {objectFilter} from '../../../@core/utilities/helpers';

const PREFIX = 'YouthFeedPage';

const classes = {
  container: `${PREFIX}-container`,
  root: `${PREFIX}-root`,
  scrollBarStyle: `${PREFIX}-scrollBarStyle`,
  rootScrollBar: `${PREFIX}-rootScrollBar`,
  scrollBar: `${PREFIX}-scrollBar`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [`&.${classes.container}`]: {
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 90px)',
      boxSizing: 'border-box',
      overflowY: 'hidden',
    },
  },

  [`& .${classes.root}`]: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      flexDirection: 'column',
    },
  },

  [`& .${classes.scrollBarStyle}`]: {
    paddingTop: 20,
    paddingBottom: '1px',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 90px)',
      overflowY: 'hidden',
      '&:hover': {
        overflowY: 'auto',
      },
    },
    '&>.ps__rail-y': {
      height: 'calc(100% - 40px) !important',
      marginBottom: 20,
      marginTop: 20,
    },
  },

  [`& .${classes.rootScrollBar}`]: {
    overflowY: 'hidden',
  },

  [`& .${classes.scrollBar}`]: {
    height: '82.5vh',
    overflowY: 'hidden',
    '&:hover': {
      $rootScrollBar: {
        overflowY: 'auto',
      },
    },
  },
}));

const YouthFeedPage = () => {
  const [loadingMainPostData, setLoadingMainPostData] = useState(false);
  const isSearching = useRef<boolean>(false);

  const [filters, setFilters] = useState<any>({
    page: 1,
    page_size: PageSizes.TEN,
  });
  const pageIndex = useRef(1);

  const filterPost = useCallback(
    (filterKey: string, filterValue: any) => {
      const newFilter: any = {};
      newFilter[filterKey] = filterValue;
      pageIndex.current = 1;
      newFilter['page'] = pageIndex.current;
      isSearching.current = true;

      setFilters((prev: any) => {
        return objectFilter({...prev, ...newFilter});
      });
      // console.log({filterKey, filterValue, filters});
    },
    [filters],
  );

  const onScrollMainPostContent = (e: any) => {
    if (!loadingMainPostData) {
      isSearching.current = false;
      setFilters((prev: any) => {
        return {...prev, page: pageIndex.current + 1};
      });
      pageIndex.current += 1;
    }
  };

  const onScrollUpPostContent = () => {
    if (pageIndex.current > 1) {
      setFilters((prev: any) => {
        return {...prev, page: pageIndex.current - 1};
      });
      pageIndex.current -= 1;
    }
  };

  return (
    <StyledContainer maxWidth={'lg'} className={classes.container}>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} md={3}>
          <Scrollbar className={classes.scrollBarStyle}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BasicInfo />
              </Grid>
              <Grid item xs={12}>
                <SideMenu />
              </Grid>
            </Grid>
          </Scrollbar>
        </Grid>
        <Grid item xs={12} md={6} order={{xs: 3, md: 2}}>
          <Scrollbar
            className={classes.scrollBarStyle}
            onYReachEnd={debounce(onScrollMainPostContent, 1000)}
            onYReachStart={debounce(onScrollUpPostContent, 1000)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <OverviewSection addFilter={filterPost} />
              </Grid>
              {/* <Grid item xs={12}> //TODO it will be implemented in future
                <FeatureJobSection />
              </Grid>*/}
              <Grid item xs={12}>
                <PostSection
                  filters={filters}
                  pageIndex={pageIndex.current}
                  setLoadingMainPostData={setLoadingMainPostData}
                  isSearching={isSearching.current}
                />
              </Grid>
            </Grid>
          </Scrollbar>
        </Grid>
        <Grid item xs={12} md={3} order={{xs: 2, md: 3}}>
          <Scrollbar className={classes.scrollBarStyle}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RecentJobSection />
              </Grid>
              <Grid item xs={12}>
                <CourseListSection />
              </Grid>
            </Grid>
          </Scrollbar>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default YouthFeedPage;
