import {Box, Container, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {useCallback, useState} from 'react';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {FilterItem} from '../../../shared/Interface/common.interface';
import EducCourseListHeaderSection from './EducCourseListHeaderSection';
import PopularCoursesSection from './PopularCoursesSection';
import SkillMatchingCoursesSection from './SkillMatchingCoursesSection';
import TrendingCoursesSection from './TrendingCoursesSection';

const PREFIX = 'TrainingPage';

export const classes = {
  mainContent: `${PREFIX}-mainContent`,
};

export const StyledTrainingRoot = styled(Box)(({theme}) => ({
  margin: '0px auto 20px',

  [`& .${classes.mainContent}`]: {
    marginTop: 20,
  },
}));

const EducCourseListPage = () => {
  const authUser = useAuthUser<YouthAuthUser>();
  // const router = useRouter();
  // const [courseMode, setCourseMode] = useState<any>(CourseType.OFFLINE);
  // const isCourseModeOffline = courseMode == CourseType.OFFLINE;

  const [filters, setFilters] = useState<any>({});

  // useEffect(() => {
  //   setCourseMode(router?.query?.is_offline);
  // }, [router]);

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
    <StyledTrainingRoot>
      <EducCourseListHeaderSection
        addFilterKey={filterCoursesListTrainingList}
        routeParamsFilters={filterCoursesListByRouteParams}
      />
      <Container maxWidth={'lg'} className={classes.mainContent}>
        <Grid container>
          {authUser && authUser?.isYouthUser && (
            <Grid item xs={12}>
              <SkillMatchingCoursesSection
                filters={filters}
                showAllCourses={false}
              />
            </Grid>
          )}

          {/*<Grid item xs={12}>*/}
          {/*  <PopularOnlineCoursesSection*/}
          {/*    filters={filters}*/}
          {/*    showAllCourses={false}*/}
          {/*  />*/}
          {/*</Grid>*/}

          <Grid item xs={12}>
            <TrendingCoursesSection filters={filters} showAllCourses={false} />
          </Grid>

          <Grid item xs={12}>
            <PopularCoursesSection filters={filters} showAllCourses={false} />
          </Grid>
        </Grid>
      </Container>
    </StyledTrainingRoot>
  );
};

export default EducCourseListPage;
