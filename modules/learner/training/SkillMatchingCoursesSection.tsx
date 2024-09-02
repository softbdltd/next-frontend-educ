import React, {useCallback, useEffect, useState} from 'react';
import {Button, Grid} from '@mui/material';
import {ChevronRight} from '@mui/icons-material';
import CourseCardComponent from '../../../@core/elements/CourseCardComponent';
import {useIntl} from 'react-intl';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {objectFilter} from '../../../@core/utilities/helpers';
import {H3, Link} from '../../../@core/elements/common';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import BoxCardsSkeleton from '../../institute/Components/BoxCardsSkeleton';
import {useRouter} from 'next/router';
import {styled} from '@mui/material/styles';
import PageSizes from '../../../@core/utilities/PageSizes';
import {useFetchCourseList} from '../../../services/instituteManagement/hooks';
import CustomPaginationWithPageNumber from './components/CustomPaginationWithPageNumber';
import {urlParamsUpdate} from '../learnerConstants';

const PREFIX = 'SkillMatchingCoursesSection';

export const classes = {
  subHeader: `${PREFIX}-subHeader`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.subHeader}`]: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

interface skillMatchingCoursesSectionProps {
  filters?: any;
  showAllCourses: boolean;
}

const SkillMatchingCoursesSection = ({
  filters,
  showAllCourses,
}: skillMatchingCoursesSectionProps) => {
  const {messages} = useIntl();
  const router = useRouter();
  const path = router.pathname;
  const authUser = useAuthUser<YouthAuthUser>();

  const [pageInfo, setPageInfo] = useState<any | null>(
    Object.keys(filters).length > 0 ? filters : null,
  );
  const [skillIdsLists, setSkillIds] = useState<any | []>([]);

  useEffect(() => {
    const filters = objectFilter({
      ...router.query,
      page_size: showAllCourses
        ? router.query?.page_size
          ? Number(router.query?.page_size)
          : PageSizes.EIGHT
        : PageSizes.FOUR,
      page: router.query?.page ? Number(router.query?.page) : 1,
    });

    setPageInfo((prev: any) => {
      return {...prev, ...filters, ...{skill_ids: skillIdsLists}};
    });
  }, [router.query]);

  useEffect(() => {
    if (authUser) {
      let skillIDs: Array<number> = [];
      authUser.skills?.map((skill: any) => {
        skillIDs.push(skill.id);
      });
      setPageInfo((prev: any) => {
        return {...prev, ...{skill_ids: skillIDs}};
      });
      setSkillIds(skillIDs);
    }
  }, [authUser]);

  const pathValue = 'skill-matching';
  let pathWithParams = pathValue;
  if (Object.keys(router.query).length > 0) {
    const params = router.asPath.split('?')[1];
    pathWithParams += '?' + params;
  }
  const {
    data: courseList,
    metaData: courseListMetaData,
    isLoading: isLoadingCourseList,
  } = useFetchCourseList(pathValue, pageInfo?.skill_ids ? pageInfo : null);

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
        page: currentPage,
        page_size: router.query?.page_size ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      urlParamsUpdate(router, {
        ...router.query,
        page: router.query?.page,
        page_size: event.target.value ?? PageSizes.EIGHT,
      });
    },
    [router.query],
  );

  return (
    <StyledGrid container spacing={3} mb={8}>
      <Grid item xs={12} sm={12}>
        <Grid container alignItems={'center'}>
          <Grid item xs={6} sm={9} md={10}>
            <H3 className={classes.subHeader}>
              {messages['common.skill_matching_course']}
            </H3>
          </Grid>
          {!showAllCourses && courseList && courseList.length > 1 && (
            <Grid item xs={6} sm={3} md={2} style={{textAlign: 'right'}}>
              <Link
                href={`${path}/${pathWithParams}`}
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
              {courseList.map((course: any) => (
                <Grid item xs={12} sm={6} md={3} key={course.id}>
                  <Link href={`/course-details/${course.id}`}>
                    <CourseCardComponent course={course} />
                  </Link>
                </Grid>
              ))}

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
            <NoDataFoundComponent />
          )}
        </Grid>
      </Grid>
    </StyledGrid>
  );
};

export default SkillMatchingCoursesSection;
