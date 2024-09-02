import {Box, Container, Grid} from '@mui/material';
import React, {useCallback, useState} from 'react';
import {FilterItem} from '../../../shared/Interface/common.interface';
import {styled} from '@mui/material/styles';
import AccessToSkillCourseFilterSection from './components/AccessToSkillCourseFilterSection';
import AccessToSkillCourseSection from './components/AccessToSkillCourseSection';

const PREFIX = 'accessToSkillPage';

export const classes = {
  mainContent: `${PREFIX}-mainContent`,
};

export const StyledAccessToSkillCourseSection = styled(Box)(({theme}) => ({
  margin: '0px auto 20px',

  [`& .${classes.mainContent}`]: {
    marginTop: 20,
  },
}));

const AccessToSkillPage = () => {
  const [filters, setFilters] = useState<any>(null);
  console.log('filters', filters);
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
    <StyledAccessToSkillCourseSection>
      <AccessToSkillCourseFilterSection
        addFilterKey={filterCoursesListTrainingList}
        routeParamsFilters={filterCoursesListByRouteParams}
      />
      <Container maxWidth={'lg'} className={classes.mainContent}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <AccessToSkillCourseSection
              filters={filters}
              showAllCourses={true}
            />
          </Grid>
        </Grid>
      </Container>
    </StyledAccessToSkillCourseSection>
  );
};
export default AccessToSkillPage;
