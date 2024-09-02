import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {Button, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Link from 'next/link';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {LINK_FRONTEND_EDUC_SKILLS} from '../../@core/common/appLinks';
import SectionHeading from '../../@core/elements/common/SectionHeading';
import PageSizes from '../../@core/utilities/PageSizes';
import {
  useFetchCourseListForOffline,
  useFetchOnlineCourseList,
} from '../../services/instituteManagement/hooks';
import {CourseType} from '../dashboard/courses/CourseEnums';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import PaginationComponent from './components/PaginationComponent';
import SkillCard from './components/SkillCard';
import SkillsFilterSection from './components/SkillsFilterSection';
import SkillsSectionSkeleton from './components/SkillsSectionSkeleton';

const PREFIX = 'Skills';

const classes = {
  paginationContainer: `${PREFIX}-paginationContainer`,
  moreBtn: `${PREFIX}-moreBtn`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  justifyContent: 'center',
  [`& .${classes.paginationContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  [`& .${classes.moreBtn}`]: {
    marginTop: '10px',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: '12px',
      right: '0px',
    },
  },
}));

const SkillsSection = () => {
  const {messages} = useIntl();
  const [coursesFilters, setCoursesFilters] = useState<any>({
    page_size: PageSizes.EIGHT,
    page: 1,
  });
  const [courseMode, setCourseMode] = useState<any>(CourseType.OFFLINE);
  const isCourseModeOffline = courseMode == CourseType.OFFLINE;
  const pathValue = 'popular';
  const {
    data: offlineCourseList,
    isLoading: isLoadingCourses,
    metaData: offlineMetaData,
  } = useFetchCourseListForOffline(pathValue, coursesFilters, courseMode);

  const {
    data: onlineCourseList,
    isLoading: isLoadingOnlineCourses,
    metaData: onlineCourseMetaData,
  } = useFetchOnlineCourseList(coursesFilters, courseMode);

  const courseList = isCourseModeOffline ? offlineCourseList : onlineCourseList;

  const metaData = isCourseModeOffline ? offlineMetaData : onlineCourseMetaData;

  return (
    <StyledGrid container spacing={3} my={4}>
      <Grid item xs={12}>
        <SectionHeading title={messages['common.skills_heading'] as string} />
      </Grid>
      <Grid item xs={12}>
        <SkillsFilterSection
          setSkillsFilters={setCoursesFilters}
          setCourseMode={setCourseMode}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {isLoadingCourses || isLoadingOnlineCourses ? (
              <>
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
              </>
            ) : courseList && courseList.length > 0 ? (
              <>
                {courseList?.map((course: any, index: number) => (
                  <Grid key={index} item xs={12} sm={6} md={3}>
                    <SkillCard
                      id={isCourseModeOffline ? course?.id : course?.uuid}
                      title={course?.title}
                      course_fee={course?.course_fee}
                      institute_title={course?.institute_title}
                      isCourseOnlineType={!isCourseModeOffline}
                    />
                  </Grid>
                ))}
              </>
            ) : (
              <Grid item xs={12}>
                <NoDataFoundComponent />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.paginationContainer}>
        {courseList && courseList?.length > 0 && (
          <PaginationComponent
            setPaginationFilter={setCoursesFilters}
            pageMetaData={metaData}
          />
        )}
        <Link href={LINK_FRONTEND_EDUC_SKILLS} passHref>
          <Button
            className={classes.moreBtn}
            variant={'outlined'}
            endIcon={<KeyboardDoubleArrowRightIcon />}>
            {messages['common.see_more']}
          </Button>
        </Link>
      </Grid>
    </StyledGrid>
  );
};

export default SkillsSection;
