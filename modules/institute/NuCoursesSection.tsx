import React, {useEffect, useState} from 'react';
import {Box, Container, Grid, Skeleton, Tab, Tabs} from '@mui/material';
import UnderlinedHeading from '../../@core/elements/common/UnderlinedHeading';
import {
  useFetchCourseList,
  useFetchOnlineCourseList,
  useFetchUpcomingCourseList,
} from '../../services/instituteManagement/hooks';
import {useIntl} from 'react-intl';
import {CourseType} from '../dashboard/courses/CourseEnums';
import CourseSectionCarousel from './courseSectionCarousel';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import CourseTypes from '../../@core/utilities/CourseTypes';
import PageSizes from '../../@core/utilities/PageSizes';
import {NUDomains} from '../../@core/utilities/helpers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{paddingTop: '10px'}}>{children}</Box>}
    </div>
  );
};

const indexProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const NuCoursesSection = () => {
  const {messages} = useIntl();

  const [upcomingCoursesFilter, setUpcomingCoursesFilter] = useState<any>(null);

  const [runningCoursesFilter, setRunningCoursesFilter] = useState<any>({
    page_size: PageSizes.TEN,
    availability: CourseTypes.RUNNING,
  });
  const [elearningFilter, setElearningFilter] = useState<any>(null);

  const {data: upcomingCourses, isLoading: isUpcomingCourse} =
    useFetchUpcomingCourseList(upcomingCoursesFilter);

  const {data: runningCourseList, isLoading: isLoadingCourseList} =
    useFetchCourseList('recent', runningCoursesFilter);

  const {data: elearningCourses, isLoading: isElearningCourse} =
    useFetchOnlineCourseList(elearningFilter, CourseType.ONLINE);

  const [value, setValue] = useState(CourseTypes.UPCOMING);

  useEffect(() => {
    let params: any = {
      page_size: PageSizes.TEN,
      availability: CourseTypes.UPCOMING,
    };
    if (NUDomains.includes(String(window?.location?.hostname))) {
      params.nu_upcoming = 1;
    }
    setUpcomingCoursesFilter(params);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue == CourseTypes.RUNNING) {
      setRunningCoursesFilter((prevState: any) => {
        return {...prevState, ...{availability: newValue}};
      });
    }
    if (newValue == CourseTypes.UPCOMING) {
      setUpcomingCoursesFilter((prevState: any) => {
        return {...prevState, ...{availability: newValue}};
      });
    }
    if (newValue == CourseTypes.E_LEARNING) {
      setElearningFilter((prevState: any) => {
        return {...prevState, ...{availability: newValue}};
      });
    }
  };

  return (
    <Container maxWidth='lg'>
      <Grid container sx={{marginTop: '60px'}}>
        <Grid item xs={12}>
          <UnderlinedHeading>{messages['common.courses']}</UnderlinedHeading>
          <Box sx={{width: '100%'}}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor='primary'
              indicatorColor='primary'
              aria-label='primary tabs example'>
              <Tab
                value={CourseTypes.UPCOMING}
                label={messages['nu.name']}
                {...indexProps(CourseTypes.UPCOMING)}
              />
              <Tab
                value={CourseTypes.RUNNING}
                label={messages['nu.training_institute']}
                {...indexProps(CourseTypes.RUNNING)}
              />
              {/*<Tab*/}
              {/*  value={CourseTypes.E_LEARNING}*/}
              {/*  label={messages['common.e_learning']}*/}
              {/*  {...indexProps(CourseTypes.E_LEARNING)}*/}
              {/*/>*/}
            </Tabs>
          </Box>
          <TabPanel value={value} index={CourseTypes.UPCOMING}>
            <Box>
              {isUpcomingCourse ? (
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: '20px',
                    justifyContent: 'space-around',
                  }}>
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                </Box>
              ) : upcomingCourses && upcomingCourses.length ? (
                <CourseSectionCarousel courses={upcomingCourses} />
              ) : (
                <NoDataFoundComponent
                  message={
                    messages[
                      'course.course_information_will_be_added'
                    ] as string
                  }
                />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={CourseTypes.RUNNING}>
            <Box>
              {isLoadingCourseList ? (
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: '20px',
                    justifyContent: 'space-around',
                  }}>
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                </Box>
              ) : runningCourseList && runningCourseList.length ? (
                <CourseSectionCarousel courses={runningCourseList} />
              ) : (
                <NoDataFoundComponent
                  message={
                    messages[
                      'course.course_information_will_be_added'
                    ] as string
                  }
                />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={CourseTypes.E_LEARNING}>
            <Box>
              {isElearningCourse ? (
                <Box
                  sx={{
                    display: 'flex',
                    marginTop: '20px',
                    justifyContent: 'space-around',
                  }}>
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                  <Skeleton variant='rectangular' width={250} height={300} />
                </Box>
              ) : elearningCourses && elearningCourses.length ? (
                <CourseSectionCarousel
                  courses={elearningCourses}
                  courseType={'online'}
                />
              ) : (
                <NoDataFoundComponent />
              )}
            </Box>
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};
export default NuCoursesSection;
