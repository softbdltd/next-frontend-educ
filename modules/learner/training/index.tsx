import React, {useCallback, useState} from 'react';
import {Box, Container, Grid} from '@mui/material';
import CourseListHeaderSection from './CourseListHeaderSection';
//import PopularOnlineCoursesSection from './PopularOnlineCoursesSection';
import SkillMatchingCoursesSection from './SkillMatchingCoursesSection';
import PopularCoursesSection from './PopularCoursesSection';
import TrendingCoursesSection from './TrendingCoursesSection';
import {styled} from '@mui/material/styles';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {FilterItem} from '../../../shared/Interface/common.interface';
import RowStatus from '../../dashboard/users/RowStatus';

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

const CourseListPage = () => {
  const authUser = useAuthUser<YouthAuthUser>();

  const [filters, setFilters] = useState<any>({row_status: RowStatus.ACTIVE});

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
      <CourseListHeaderSection
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
          {/*<Grid item xs={12}>
            <PopularOnlineCoursesSection
              filters={filters}
              showAllCourses={false}
            />
          </Grid>*/}

          <Grid item xs={12}>
            <TrendingCoursesSection filters={filters} showAllCourses={false} />
          </Grid>

          <Grid item xs={12}>
            <PopularCoursesSection filters={filters} showAllCourses={false} />
          </Grid>

          {/*<Grid item xs={12}> //TODO temporarily commented
            <NearbyTrainingCenterSection showAllNearbyTrainingCenter={false} />
          </Grid>*/}
        </Grid>
      </Container>
    </StyledTrainingRoot>
  );
};

export default CourseListPage;
