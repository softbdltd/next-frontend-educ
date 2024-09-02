import {ChevronRight} from '@mui/icons-material';
import {Button, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {H3, Link} from '../../../@core/elements/common';
import CourseCardComponent from '../../../@core/elements/CourseCardComponent';
import PageSizes from '../../../@core/utilities/PageSizes';
import {useFetchCourseList} from '../../../services/instituteManagement/hooks';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import {urlParamsUpdate} from '../learnerConstants';
import CustomPaginationWithPageNumber from './components/CustomPaginationWithPageNumber';

const PREFIX = 'TrendingCoursesSection';

export const classes = {
  subHeader: `${PREFIX}-subHeader`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.subHeader}`]: {
    // fontSize: '1.421875rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

interface TrendingCoursesSectionProps {
  filters?: any;
  showAllCourses: boolean;
  isCourseType?: any;
}

const pathValue = 'trending';

const TrendingCoursesSection = ({
  filters,
  showAllCourses,
}: TrendingCoursesSectionProps) => {
  const {messages} = useIntl();
  const router = useRouter();
  const path = router.pathname;
  const [pageInfo, setPageInfo] = useState<any | null>(
    Object.keys(filters).length > 0 ? filters : null,
  );

  const {
    data: courseList,
    metaData: courseListMetaData,
    isLoading: isLoadingCourseList,
  } = useFetchCourseList(pathValue, pageInfo);

  useEffect(() => {
    const filter: any = {
      ...filters,
      ...router.query,
      page_size: showAllCourses
        ? router.query?.page_size
          ? Number(router.query?.page_size)
          : PageSizes.EIGHT
        : PageSizes.FOUR,
      page: router.query?.page ? Number(router.query?.page) : 1,
      search_text: (router.query?.search_text as string) ?? '',
    };

    if (filter?.district) {
      filter['loc_district_id'] = filter?.district;
      delete filter['district'];
    }
    setPageInfo(filter);
  }, [router.query]);

  useEffect(() => {
    if (router.query?.page == '1') return;
    if (isLoadingCourseList !== false) return;
    const {courseType: _, ...others} = router.query;
    if (Object.keys(others).length > 0 && courseList?.length === 0) {
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
    <StyledGrid container spacing={3} mb={8}>
      <Grid item xs={12} sm={12} md={12}>
        <Grid container alignItems={'center'}>
          <Grid item xs={6} sm={9} md={10}>
            <H3 className={classes.subHeader}>{messages['common.skills']}</H3>
          </Grid>
          {!showAllCourses && courseList && courseList.length > 1 && (
            <Grid item xs={6} sm={3} md={2} style={{textAlign: 'right'}}>
              <Link
                href={`${path}/${pathValue}`}
                style={{display: 'inline-block'}}>
                <Button variant={'outlined'} size={'medium'} color={'primary'}>
                  {messages['common.see_all']}
                  <ChevronRight />
                </Button>
              </Link>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Grid container spacing={3}>
          {isLoadingCourseList ? (
            <Grid item xs={12}>
              <BoxCardsSkeleton />
            </Grid>
          ) : courseList && courseList.length ? (
            <>
              {courseList.map((course: any) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={course.id}>
                    <Link href={`/course-details/${course.id}`}>
                      <CourseCardComponent course={course} />
                    </Link>
                  </Grid>
                );
              })}
              {showAllCourses && (
                <Grid item xs={12}>
                  <CustomPaginationWithPageNumber
                    metaData={courseListMetaData}
                    pageInfo={pageInfo}
                    onPaginationChange={onPaginationChange}
                    rowsPerPage={Number(router.query.page_size)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Grid>
              )}
            </>
          ) : (
            <NoDataFoundComponent
              message={
                messages['skills.skills_information_will_be_added'] as string
              }
            />
          )}
        </Grid>
      </Grid>
    </StyledGrid>
  );
};

export default TrendingCoursesSection;
