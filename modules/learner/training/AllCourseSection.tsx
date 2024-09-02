import {useCallback, useState} from 'react';
import {Box, Container, Grid} from '@mui/material';
import CourseListHeaderSection from './CourseListHeaderSection';
//import PopularOnlineCoursesSection from './PopularOnlineCoursesSection';
import SkillMatchingCoursesSection from './SkillMatchingCoursesSection';
import PopularCoursesSection from './PopularCoursesSection';
import TrendingCoursesSection from './TrendingCoursesSection';
import {useRouter} from 'next/router';
import {styled} from '@mui/material/styles';
import {FilterItem} from '../../../shared/Interface/common.interface';
import RowStatus from '../../../@core/utilities/RowStatus';

const PREFIX = 'AllCourseSection';

export const classes = {
  mainContent: `${PREFIX}-mainContent`,
};

export const StyledCourseSection = styled(Box)(({theme}) => ({
  margin: '0px auto 20px',

  [`& .${classes.mainContent}`]: {
    marginTop: 20,
  },
}));

const CourseListPage = () => {
  const [filters, setFilters] = useState<any>({row_status: RowStatus.ACTIVE});
  const router = useRouter();
  const {courseType} = router.query;

  const filterCoursesListTrainingList = useCallback(
    (filterKey: string, filterValue: any) => {
      const newFilter: any = {};
      newFilter[filterKey] = filterValue;

      setFilters((prev: any) => {
        return {...prev, ...newFilter};
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

      setFilters((prev: any) => {
        return {...prev, ...newFilter};
      });
    },
    [],
  );

  return (
    <StyledCourseSection>
      <CourseListHeaderSection
        addFilterKey={filterCoursesListTrainingList}
        routeParamsFilters={filterCoursesListByRouteParams}
      />
      <Container maxWidth={'lg'} className={classes.mainContent}>
        <Grid container spacing={5}>
          {courseType == 'skill-matching' && (
            <Grid item xs={12}>
              <SkillMatchingCoursesSection
                filters={filters}
                showAllCourses={true}
              />
            </Grid>
          )}
          {courseType == 'popular' && (
            <Grid item xs={12}>
              <PopularCoursesSection filters={filters} showAllCourses={true} />
            </Grid>
          )}

          {courseType == 'trending' && (
            <Grid item xs={12}>
              <TrendingCoursesSection filters={filters} showAllCourses={true} />
            </Grid>
          )}

          {/*{courseType == 'e-learning' && (
            <Grid item xs={12}>
              <PopularOnlineCoursesSection
                filters={filters}
                showAllCourses={true}
              />
            </Grid>
          )}*/}
        </Grid>
      </Container>
    </StyledCourseSection>
  );
};

export default CourseListPage;
