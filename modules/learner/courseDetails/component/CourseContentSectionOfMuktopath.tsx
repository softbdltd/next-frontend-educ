import {TabContext, TabList} from '@mui/lab';
import {Box, Container, Tab} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {FC, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {CourseDetailsTabsForMuktopath} from '../CourseDetailsEnums';
import MuktopathSyllabusComponent from './MuktopathSyllabus';

const PREFIX = 'CourseContentSection';

const classes = {
  iconStyle: `${PREFIX}-iconStyle`,
  accordion: `${PREFIX}-accordion`,
  sectionTitleStyle: `${PREFIX}-sectionTitleStyle`,
  dFlexAlignCenter: `${PREFIX}-dFlexAlignCenter`,
  courseBadgeBox: `${PREFIX}-courseBadgeBox`,
  courseBadgeIcon: `${PREFIX}-courseBadgeIcon`,
  courseBadgeTitle: `${PREFIX}-courseBadgeTitle`,
  dividerStyle: `${PREFIX}-dividerStyle`,
  boxMargin: `${PREFIX}-boxMargin`,
  lessonBox: `${PREFIX}-lessonBox`,
  listStyle: `${PREFIX}-listStyle`,
  listItem: `${PREFIX}-listItem`,
  trainerBox: `${PREFIX}-trainerBox`,
  trainerNameAndAboutBox: `${PREFIX}-trainerNameAndAboutBox`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.accordion}`]: {
    marginBottom: '10px',
  },
  [`& .${classes.sectionTitleStyle}`]: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
  },

  [`& .${classes.dFlexAlignCenter}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.courseBadgeBox}`]: {
    color: '#999',
  },

  [`& .${classes.courseBadgeIcon}`]: {
    height: 60,
    width: 60,
    marginRight: 15,
  },

  [`& .${classes.courseBadgeTitle}`]: {
    color: '#161616',
    fontWeight: 'bold',
  },

  [`&  .${classes.boxMargin}`]: {
    marginTop: 20,
    marginBottom: 25,
  },

  [`& .${classes.lessonBox}`]: {
    maxWidth: '600px',
    border: '1px solid #e9e9e9',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },

  [`& .${classes.listStyle}`]: {
    padding: 0,
    background: '#fbfbf8',
    borderRadius: 5,
  },

  [`& .${classes.listItem}`]: {
    '& .MuiListItemText-primary': {
      display: 'inline-block',
      width: '70%',
    },
    '& .MuiListItemText-secondary': {
      display: 'inline-block',
      float: 'right',
      width: '30%',
      textAlign: 'right',
    },
  },

  [`& .${classes.trainerBox}`]: {
    marginTop: 20,
    marginBottom: 20,
  },

  [`& .${classes.trainerNameAndAboutBox}`]: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface CourseContentProps {
  course: any;
}

const CourseContentSectionOfMuktopath: FC<CourseContentProps> = ({course}) => {
  const {messages} = useIntl();
  const [value, setValue] = useState<string>(
    CourseDetailsTabsForMuktopath.TAB_OBJECTIVE,
  );

  const objectiveRef = useRef<any>();
  const detailsRef = useRef<any>();
  const syllabusRef = useRef<any>();
  const requirementRef = useRef<any>();
  // const courseRequirementRef = useRef<any>();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);

    switch (newValue) {
      case CourseDetailsTabsForMuktopath.TAB_OBJECTIVE:
        objectiveRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case CourseDetailsTabsForMuktopath.TAB_DETAILS:
        detailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case CourseDetailsTabsForMuktopath.TAB_SYLLABUS:
        syllabusRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case CourseDetailsTabsForMuktopath.TAB_REQUIREMENTS:
        requirementRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      // case CourseDetailsTabsForMuktopath.TAB_COURSE_REQUIREMENTS:
      //   courseRequirementRef.current?.scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'start',
      //   });
      //   break;
    }
  };

  return (
    <StyledBox>
      <TabContext value={value}>
        <Box sx={{background: '#e6f3ec'}}>
          <Container maxWidth={'lg'}>
            <TabList
              aria-label='tabs'
              onChange={handleChange}
              variant='scrollable'
              scrollButtons='auto'>
              <Tab
                label={messages['course_details.objective']}
                value={CourseDetailsTabsForMuktopath.TAB_OBJECTIVE}
              />
              <Tab
                label={messages['course_details.details']}
                value={CourseDetailsTabsForMuktopath.TAB_DETAILS}
              />
              <Tab
                label={messages['course_details.syllabus']}
                value={CourseDetailsTabsForMuktopath.TAB_SYLLABUS}
              />
              <Tab
                label={messages['course_details.requirement']}
                value={CourseDetailsTabsForMuktopath.TAB_REQUIREMENTS}
              />
              {/*<Tab*/}
              {/*  label={messages['course_details.course_requirement']}*/}
              {/*  value={CourseDetailsTabsForMuktopath.TAB_COURSE_REQUIREMENTS}*/}
              {/*/>*/}
            </TabList>
          </Container>
        </Box>

        <Container maxWidth={'lg'}>
          <Box>
            <Box ref={objectiveRef} className={classes.boxMargin}>
              <h2 className={classes.sectionTitleStyle}>
                {messages['course_details.objective']}
              </h2>
              {course?.objective ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: course?.objective,
                  }}
                />
              ) : (
                <NoDataFoundComponent
                  messageType={messages['course_details.objective']}
                  messageTextType={'body1'}
                />
              )}
            </Box>

            <Box ref={detailsRef}>
              <h2 className={classes.sectionTitleStyle}>
                {messages['course_details.details']}
              </h2>
              {course?.details ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: course?.details,
                  }}
                />
              ) : (
                <NoDataFoundComponent
                  messageType={messages['course_details.details']}
                  messageTextType={'body1'}
                />
              )}
            </Box>

            <Box ref={syllabusRef}>
              <h2 className={classes.sectionTitleStyle}>
                {messages['course_details.syllabus']}
              </h2>
              {course?.syllabus?.length > 0 ? (
                <MuktopathSyllabusComponent syllabus={course?.syllabus} />
              ) : (
                <NoDataFoundComponent
                  messageType={messages['course_details.details']}
                  messageTextType={'body1'}
                />
              )}
            </Box>

            <Box ref={requirementRef} className={classes.boxMargin}>
              <h2 className={classes.sectionTitleStyle}>
                {messages['course_details.requirement']}
              </h2>
              <Box>
                {course?.requirement == `<p> </p>` || !course?.requirement ? (
                  <NoDataFoundComponent
                    messageType={messages['course_details.requirement']}
                    messageTextType={'body1'}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: course?.requirement,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </TabContext>
    </StyledBox>
  );
};

export default CourseContentSectionOfMuktopath;
