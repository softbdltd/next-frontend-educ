import React, {FC, SyntheticEvent, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {TabContext, TabList} from '@mui/lab';
import {Alarm, CardMembership} from '@mui/icons-material';
import clsx from 'clsx';
import {useIntl} from 'react-intl';
import {
  getCourseDuration,
  getFormatMessage,
  getIntlDateFromString,
  getIntlNumber,
} from '../../../@core/utilities/helpers';
import NoDataFoundComponent from '../common/NoDataFoundComponent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {useFetchTrainingCentersWithBatches} from '../../../services/instituteManagement/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextInputSkeleton from '../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton';
import {CourseDetailsTabs} from './CourseDetailsEnums';

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

const StyledDividerStyle = styled(Divider)(({theme}) => ({
  margin: '10px 30px',
  borderWidth: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

interface CourseContentProps {
  course: any;
}

/*const lessonsList = [
  {
    name: 'Introduction',
    duration: '6.22',
  },
  {
    name: 'Started with python',
    duration: '6.22',
  },
  {
    name: 'Data Types',
    duration: '6.22',
  },
  {
    name: 'Operation with data types',
    duration: '6.22',
  },
];*/

const CourseContentSection: FC<CourseContentProps> = ({course}) => {
  const {messages, formatNumber, formatDate, formatMessage} = useIntl();
  const [value, setValue] = useState<string>(CourseDetailsTabs.TAB_OVERVIEW);
  const [batchFilterParams] = useState({
    active: true,
  });
  const overviewRef = useRef<any>();
  //const lessonRef = useRef<any>();
  const assessmentMethodRef = useRef<any>();
  const requirementRef = useRef<any>();
  // const objectiveRef = useRef<any>();
  const eligibilityRef = useRef<any>();
  const targetGroupRef = useRef<any>();
  const trainerRef = useRef<any>();
  const trainingMethodologyRef = useRef<any>();

  const [expandedState, setExpanded] = useState<string | false>(false);
  const {data: trainingCentersWithBatches, isLoading: trainingCentersLoading} =
    useFetchTrainingCentersWithBatches(course?.id, batchFilterParams);
  const handleChangeAccordion =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);

    switch (newValue) {
      case CourseDetailsTabs.TAB_OVERVIEW:
        overviewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      /*case CourseDetailsTabs.TAB_LESSON:
        lessonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;*/
      case CourseDetailsTabs.TAB_EVALUATION_SYSTEM:
        assessmentMethodRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case CourseDetailsTabs.TAB_REQUIREMENTS:
        requirementRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case CourseDetailsTabs.TAB_TRAINER:
        trainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case CourseDetailsTabs.TAB_TRAINING_METHODOLOGY:
        trainingMethodologyRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      // case CourseDetailsTabs.TAB_OBJECTIVE:
      //   objectiveRef.current?.scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'start',
      //   });
      //   break;

      case CourseDetailsTabs.TAB_ELIGIBILITY:
        eligibilityRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;

      case CourseDetailsTabs.TAB_TARGET_GROUP:
        targetGroupRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
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
                label={messages['course_details.overview']}
                value={CourseDetailsTabs.TAB_OVERVIEW}
              />
              {/*<Tab
                label={messages['course_details.lesson']}
                value={CourseDetailsTabs.TAB_LESSON}
              />*/}
              {/*<Tab
                label={messages['course_details.objective']}
                value={CourseDetailsTabs.TAB_OBJECTIVE}
              />*/}
              <Tab
                label={messages['course_details.assessment_method']}
                value={CourseDetailsTabs.TAB_EVALUATION_SYSTEM}
              />
              <Tab
                label={messages['course_details.target_group']}
                value={CourseDetailsTabs.TAB_TARGET_GROUP}
              />
              <Tab
                label={messages['course_details.requirements']}
                value={CourseDetailsTabs.TAB_REQUIREMENTS}
              />
              <Tab
                label={messages['course_details.training_methodology']}
                value={CourseDetailsTabs.TAB_TRAINING_METHODOLOGY}
              />
              <Tab
                label={messages['course_details.ageRange']}
                value={CourseDetailsTabs.TAB_ELIGIBILITY}
              />
              <Tab
                label={messages['course_details.trainer']}
                value={CourseDetailsTabs.TAB_TRAINER}
              />
            </TabList>
          </Container>
        </Box>

        <Container maxWidth={'lg'}>
          <Box>
            <Grid container className={classes.boxMargin}>
              <Grid item>
                <Box
                  className={clsx(
                    classes.dFlexAlignCenter,
                    classes.courseBadgeBox,
                  )}>
                  <CardMembership className={classes.courseBadgeIcon} />
                  <Box>
                    <Box className={classes.courseBadgeTitle}>
                      {messages['common.certificate']}
                    </Box>
                    {/*<Box>{messages['course_details.earn_certificate']}</Box>*/}
                  </Box>
                </Box>
              </Grid>

              {/*<StyledDividerStyle orientation='vertical' flexItem />
              <Grid item>
                <Box
                  className={clsx(
                    classes.dFlexAlignCenter,
                    classes.courseBadgeBox,
                  )}>
                  <Language className={classes.courseBadgeIcon} />
                  <Box>
                    <Box className={classes.courseBadgeTitle}>
                      {messages['course_details.online_100_percent']}
                    </Box>
                    <Box>{messages['course_details.start_instantly']}</Box>
                  </Box>
                </Box>
              </Grid>*/}
              <StyledDividerStyle orientation='vertical' flexItem />
              <Grid item>
                <Box
                  className={clsx(
                    classes.dFlexAlignCenter,
                    classes.courseBadgeBox,
                  )}>
                  <Alarm className={classes.courseBadgeIcon} />
                  <Box
                    tabIndex={0}
                    aria-label={`${getCourseDuration(
                      course?.duration,
                      formatNumber,
                      messages,
                    )}`}
                    role={'heading'}>
                    <Box className={classes.courseBadgeTitle}>
                      {getCourseDuration(
                        course?.duration,
                        formatNumber,
                        messages,
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course.available_training_centers']}
              </h2>
              <Grid item xs={12} my={2}>
                {!course?.id || trainingCentersLoading ? (
                  <TextInputSkeleton />
                ) : trainingCentersWithBatches &&
                  trainingCentersWithBatches.length ? (
                  trainingCentersWithBatches.map((item: any) => (
                    <Accordion
                      className={classes.accordion}
                      expanded={expandedState === item?.id}
                      onChange={handleChangeAccordion(item?.id)}
                      key={item?.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1bh-content'
                        id='panel1bh-header'>
                        <Typography
                          sx={{
                            width: '100%',
                            color:
                              expandedState == item?.id ? 'primary.main' : '',
                          }}>
                          {item?.title}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table
                            size={'small'}
                            aria-label="Training Center's table">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  {messages['rpl_batch.title']}
                                </TableCell>
                                <TableCell>
                                  {messages['batches.registration_start_date']}
                                </TableCell>
                                <TableCell>
                                  {messages['batches.registration_end_date']}
                                </TableCell>
                                <TableCell>
                                  {messages['batches.start_date']}
                                </TableCell>
                                <TableCell>
                                  {messages['batches.end_date']}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(item?.batches || []).map(
                                (batch: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell component='th'>
                                      {batch?.title}
                                    </TableCell>
                                    <TableCell>
                                      {getIntlDateFromString(
                                        formatDate,
                                        batch?.registration_start_date,
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {getIntlDateFromString(
                                        formatDate,
                                        batch?.registration_end_date,
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {getIntlDateFromString(
                                        formatDate,
                                        batch?.batch_start_date,
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {getIntlDateFromString(
                                        formatDate,
                                        batch?.batch_end_date,
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography>
                    {messages['course.no_training_center_found']}
                  </Typography>
                )}
              </Grid>
            </Box>

            <Box ref={overviewRef} className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.overview']}
              </h2>
              {course?.overview ? (
                <Typography sx={{paddingTop: 4}}>{course?.overview}</Typography>
              ) : (
                <NoDataFoundComponent
                  messageType={messages['course_details.overview']}
                  messageTextType={'body1'}
                  sx={{}}
                />
              )}
            </Box>

            <Box style={{marginTop: 20, marginBottom: 20}}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.duration']}
              </h2>
              <Box style={{display: 'flex', alignItems: 'center'}}>
                {course?.duration ? (
                  <Typography
                    tabIndex={0}
                    aria-label={`${getCourseDuration(
                      course?.duration,
                      formatNumber,
                      messages,
                    )}`}
                    role={'heading'}>
                    {getCourseDuration(
                      course?.duration,
                      formatNumber,
                      messages,
                    )}
                  </Typography>
                ) : (
                  <NoDataFoundComponent messageTextType={'body1'} sx={{}} />
                )}
              </Box>
            </Box>
            <Box style={{marginTop: 20, marginBottom: 20}}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.enrolledYouth']}
              </h2>
              <Box style={{display: 'flex', alignItems: 'center'}}>
                {course?.enroll_count > 0 ? (
                  <Typography
                    tabIndex={0}>
                    {getFormatMessage(
                      formatMessage,
                      'course_details.enrolled',
                      {
                        total: getIntlNumber(
                          formatNumber,
                          course?.enroll_count,
                        ),
                      },
                    )}
                  </Typography>
                ) : (
                  <Typography>
                    {getFormatMessage(
                      formatMessage,
                      'course_details.enrolled',
                      {
                        total: getIntlNumber(formatNumber, 0),
                      },
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
            {/*<Box ref={objectiveRef} className={classes.boxMargin}>
              <h2 tabIndex=0 className={classes.sectionTitleStyle}>
                {messages['course_details.objective']}
              </h2>*/}
            {/* <Box>
              <Box>
                {course?.objective ? (
                  <Typography>{course?.objective}</Typography>
                ) : (
                  <NoDataFoundComponent
                    messageType={messages['course_details.objective']}
                    messageTextType={'body1'}
                    sx={{}}
                  />
                )}
              </Box>
            </Box> */}

            <Box ref={assessmentMethodRef}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.assessment_method']}
              </h2>
              {course?.evaluation_system ? (
                <Typography>{course?.evaluation_system}</Typography>
              ) : (
                <NoDataFoundComponent
                  messageType={messages['course_details.assessment_method']}
                  messageTextType={'body1'}
                  sx={{}}
                />
              )}
            </Box>

            <Box ref={requirementRef} className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.requirements']}
              </h2>
              <Box>
                {course?.prerequisite ? (
                  <Typography>{course?.prerequisite}</Typography>
                ) : (
                  <NoDataFoundComponent
                    messageType={messages['course_details.requirements']}
                    messageTextType={'body1'}
                    sx={{}}
                  />
                )}
              </Box>
            </Box>

            <Box ref={eligibilityRef} className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.ageRange']}
              </h2>
              <Box>
                {course?.eligibility ? (
                  <Typography>{course?.eligibility}</Typography>
                ) : (
                  <NoDataFoundComponent
                    messageType={messages['course_details.ageRange']}
                    messageTextType={'body1'}
                    sx={{}}
                  />
                )}
              </Box>
            </Box>

            <Box ref={targetGroupRef} className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.target_group']}
              </h2>
              <Box>
                {course?.target_group ? (
                  <Typography>{course?.target_group}</Typography>
                ) : (
                  <NoDataFoundComponent
                    messageType={messages['course_details.target_group']}
                    messageTextType={'body1'}
                    sx={{}}
                  />
                )}
              </Box>
            </Box>

            <Box ref={trainingMethodologyRef} className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.training_methodology']}
              </h2>
              <Box>
                {course?.training_methodology ? (
                  <Typography>{course?.training_methodology}</Typography>
                ) : (
                  <NoDataFoundComponent
                    messageType={
                      messages['course_details.training_methodology']
                    }
                    messageTextType={'body1'}
                    sx={{}}
                  />
                )}
              </Box>
            </Box>

            <Box ref={trainerRef} className={classes.boxMargin}>
              <h2 tabIndex={0} className={classes.sectionTitleStyle}>
                {messages['course_details.trainer']}
              </h2>
              {course?.trainers && course.trainers.length > 0 ? (
                course.trainers.map((trainer: any, index: number) => (
                  <Box
                    key={index}
                    className={clsx(
                      classes.dFlexAlignCenter,
                      classes.trainerBox,
                    )}>
                    <Avatar sx={{height: 40, width: 40}} />
                    <Box className={classes.trainerNameAndAboutBox}>
                      <Box fontWeight={'bold'}>
                        {trainer?.trainer_first_name +
                          ' ' +
                          trainer?.trainer_last_name}
                      </Box>
                      <Typography variant={'caption'}>
                        {trainer?.about}
                      </Typography>
                      {/*<Link
                        href={'#more-courses'}
                        style={{textDecoration: 'none'}}>
                        <IntlMessages
                          id='course_details.view_more_courses_by'
                          values={{
                            subject:
                              trainer?.trainer_first_name +
                              ' ' +
                              trainer?.trainer_last_name,
                          }}
                        />
                      </Link>*/}
                    </Box>
                  </Box>
                ))
              ) : (
                <NoDataFoundComponent
                  messageType={messages['course_details.trainer']}
                  messageTextType={'body1'}
                  sx={{}}
                />
              )}
            </Box>
          </Box>
        </Container>
      </TabContext>
    </StyledBox>
  );
};

export default CourseContentSection;
