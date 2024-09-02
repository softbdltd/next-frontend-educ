import React, {useCallback, useEffect, useState} from 'react';
import {Container, Grid} from '@mui/material';
import CourseCardComponent from '../../../@core/elements/CourseCardComponent';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {H1, Link} from '../../../@core/elements/common';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {styled} from '@mui/material/styles';
import {useFetchCourseList} from '../../../services/instituteManagement/hooks';
import CourseListHeaderSection from '../training/CourseListHeaderSection';
import {
  objectFilter,
  urlParamsUpdate,
} from '../../../@core/utilities/helpers';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import PageSizes from '../../../@core/utilities/PageSizes';
import {FilterItem} from '../../../shared/Interface/common.interface';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import CustomPaginationWithPageNumber from '../training/components/CustomPaginationWithPageNumber';

const PREFIX = 'CourseList';

export const classes = {
  header: `${PREFIX}-header`,
  paginationBox: `${PREFIX}-paginationBox`,
};

export const StyledContainer = styled(Container)(({theme}) => ({
  [`& .${classes.header}`]: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  [`& .${classes.paginationBox}`]: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

const CourseList = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const authUser = useAuthUser<YouthAuthUser>();

  let {courseCategory} = router.query;
  courseCategory = String(courseCategory)?.trim();

  const [pageInfo, setPageInfo] = useState<any>(null);

  const {
    data: courseList,
    isLoading,
    metaData,
  } = useFetchCourseList(courseCategory, pageInfo);

  const getMessageId = (category: any) => {
    switch (category) {
      case 'skill-matching':
        return 'common.skill_courses';
      case 'trending':
        return 'common.trending_courses';
      case 'popular':
        return 'common.popular_courses';
      case 'nearby':
        return 'common.nearby_courses';
      default:
        return 'common.recent_courses';
    }
  };

  useEffect(() => {
    setPageInfo(
      objectFilter({
        ...router.query,
        page_size: router.query?.page_size
          ? Number(router.query?.page_size)
          : PageSizes.EIGHT,
        page: router.query?.page ? Number(router.query?.page) : 1,
        search_text: (router.query?.search_text as string) ?? '',
      }),
    );
  }, [router.query]);

  const filterPopularCoursesList = useCallback(
    (filterKey: string, filterValue: any) => {
      const newFilter: any = {};
      newFilter[filterKey] = filterValue;

      setPageInfo((prev: any) => {
        return objectFilter({...prev, ...newFilter});
      });
    },
    [],
  );

  const filterCoursesListByRouteParams = useCallback(
    (filters: Array<FilterItem>) => {
      const newFilter: any = {};
      filters.map((item) => {
        newFilter[item.filterKey] = item.filterValue;
      });

      setPageInfo((prev: any) => {
        return {...prev, ...newFilter};
      });
    },
    [],
  );

  useEffect(() => {
    if (courseCategory == 'nearby')
      if (authUser?.isYouthUser) {
        setPageInfo(
          objectFilter({
            ...router.query,
            loc_district_id: authUser?.loc_district_id,
          }),
        );
      }
  }, [authUser]);

  useEffect(() => {
    if (router.query?.page == '1') return;
    if (isLoading !== false) return;
    if (Object.keys(router.query).length > 0 && courseList?.length === 0) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: 1,
          },
        },
        undefined,
        {shallow: true},
      );
    }
  }, [courseList]);

  const onPaginationChange = useCallback(
    (event: any, currentPage: number) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: currentPage ?? 1,
        page_size: router.query?.page_size ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: router.query?.page ?? 1,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  return (
    <>
      <CourseListHeaderSection
        addFilterKey={filterPopularCoursesList}
        routeParamsFilters={filterCoursesListByRouteParams}
      />
      <StyledContainer>
        {isLoading ? (
          <BoxCardsSkeleton />
        ) : courseList && courseList.length > 0 ? (
          <Grid container spacing={3} padding={5}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <H1 className={classes.header}>
                    {messages[getMessageId(courseCategory)]}
                  </H1>
                </Grid>
              </Grid>
            </Grid>
            {courseList &&
              courseList.map((course: any) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={course.id}>
                    <Link href={`/course-details/${course.id}`}>
                      <CourseCardComponent course={course} />
                    </Link>
                  </Grid>
                );
              })}
          </Grid>
        ) : (
          <NoDataFoundComponent />
        )}

        <CustomPaginationWithPageNumber
          metaData={metaData}
          pageInfo={pageInfo}
          onPaginationChange={onPaginationChange}
          rowsPerPage={Number(router.query.page_size)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledContainer>
    </>
  );
};

export default CourseList;
