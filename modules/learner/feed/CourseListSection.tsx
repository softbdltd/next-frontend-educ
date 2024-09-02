import React, {useCallback, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import {ChevronRight} from '@mui/icons-material';
import RecentCourseComponent from './components/RecentCourseComponent';
import clsx from 'clsx';
import {useIntl} from 'react-intl';
import Link from 'next/link';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {objectFilter} from '../../../@core/utilities/helpers';
import {Fonts} from '../../../shared/constants/AppEnums';
import PageSizes from '../../../@core/utilities/PageSizes';
import {useFetchCourseList} from '../../../services/instituteManagement/hooks';

const PREFIX = 'CourseListSection';

const classes = {
  recentCourseSectionRoot: `${PREFIX}-recentCourseSectionRoot`,
  featureSectionTitle: `${PREFIX}-featureSectionTitle`,
  courseItem: `${PREFIX}-courseItem`,
  divider: `${PREFIX}-divider`,
  selectStyle: `${PREFIX}-selectStyle`,
  seeMoreButton: `${PREFIX}-seeMoreButton`,
  selectControl: `${PREFIX}-selectControl`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.recentCourseSectionRoot}`]: {
    marginTop: 0,
    paddingBottom: 10,
    paddingTop: 20,
  },

  [`& .${classes.featureSectionTitle}`]: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  [`& .${classes.courseItem}`]: {
    marginBottom: 10,
  },

  [`& .${classes.divider}`]: {
    width: '100%',
    height: 1,
    marginBottom: 5,
  },

  [`& .${classes.selectStyle}`]: {
    '& .MuiSelect-select': {
      padding: '10px 30px 10px 15px',
    },
    backgroundColor: theme.palette.grey['100'],
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.seeMoreButton}`]: {
    boxShadow: 'none',
    marginTop: 10,
    fontWeight: Fonts.BOLD,
  },

  [`& .${classes.selectControl}`]: {
    marginLeft: 20,
    marginBottom: 10,
  },
}));

const CourseListSection = () => {
  const {messages} = useIntl();
  const selectedType = useRef<string>('recent');
  const URL = `/course-list/${selectedType.current}`;
  const authYouth = useAuthUser<YouthAuthUser>();

  const [courseFilters, setCourseFilters] = useState({
    page_size: PageSizes.THREE,
  });
  const {
    data: courses,
    metaData: coursesMetaData,
    isLoading,
  } = useFetchCourseList(selectedType.current, courseFilters);

  const handleCourseCategoryChange = useCallback((event: any) => {
    const value = event.target.value;
    if (value == 'nearby') {
      setCourseFilters((prevState) => {
        return {...prevState, loc_district_id: authYouth?.loc_district_id};
      });
    } else {
      setCourseFilters((prevState) => {
        return objectFilter({...prevState, loc_district_id: 0});
      });
    }

    selectedType.current = value;
  }, []);

  return (
    <StyledCard>
      <Grid container className={classes.recentCourseSectionRoot}>
        <Grid item xs={12} md={12}>
          <Select
            id='recentCourses'
            autoWidth
            defaultValue={selectedType.current}
            variant='outlined'
            className={clsx(classes.selectStyle, classes.selectControl)}
            onChange={handleCourseCategoryChange}>
            <MenuItem value={'recent'}>
              {messages['common.recent_courses']}
            </MenuItem>
            <MenuItem value={'popular'}>
              {messages['common.popular_courses']}
            </MenuItem>
            <MenuItem value={'nearby'}>
              {messages['common.nearby_courses']}
            </MenuItem>
            <MenuItem value={'trending'}>
              {messages['common.trending_courses']}
            </MenuItem>
          </Select>
        </Grid>

        {isLoading ? (
          <Grid item xs={12} textAlign={'center'} mt={4} mb={4}>
            <CircularProgress color='primary' size={50} />
          </Grid>
        ) : courses && courses.length > 0 ? (
          courses.map((course: any, index: number) => {
            return (
              <Grid item xs={12} key={index} className={classes.courseItem}>
                {index != 0 && <Divider className={classes.divider} />}
                <RecentCourseComponent data={course} />
              </Grid>
            );
          })
        ) : (
          <NoDataFoundComponent messageTextType={'inherit'} />
        )}

        {coursesMetaData.current_page < coursesMetaData.total_page && (
          <Grid item xs={12} style={{paddingLeft: 15}}>
            <Link href={URL} passHref>
              <Button
                variant={'text'}
                color={'primary'}
                size={'medium'}
                className={classes.seeMoreButton}>
                {messages['learner_feed.see_more_courses']}
                <ChevronRight color={'primary'} />
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
    </StyledCard>
  );
};

export default CourseListSection;
