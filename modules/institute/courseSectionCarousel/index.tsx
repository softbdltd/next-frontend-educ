import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button} from '@mui/material';
import {LINK_FRONTEND_COURSE_DETAILS} from '../../../@core/common/appLinks';
import {Link} from '../../../@core/elements/common';
import CourseCardComponent from '../../../@core/elements/CourseCardComponent';
import CustomCarousel from '../../../@core/elements/display/CustomCarousel/CustomCarousel';
import {ArrowRightAlt} from '@mui/icons-material';
import {useIntl} from 'react-intl';

const PREFIX = 'CourseSectionCarousel';

const classes = {
  boxItem: `${PREFIX}-boxItem`,
  button: `${PREFIX}-button`,
};

const StyledCarouselBox = styled(Box)(({theme}) => ({
  [`& .${classes.boxItem}`]: {
    background: theme.palette.background.paper,
    borderRadius: 4 * parseInt(theme.shape.borderRadius.toString()),
    padding: '20px 10px 35px',
    margin: 0,
    height: '100%',
  },
  '& .react-multiple-carousel__arrow--left': {
    left: 0,
  },
  '& .react-multiple-carousel__arrow--right': {
    right: 0,
  },
  '& .react-multiple-carousel__arrow--left::before, & .react-multiple-carousel__arrow--right::before':
    {
      color: '#fff',
    },
}));

const StyledBoxCentered = styled(Box)(() => ({
  [`& .${classes.button}`]: {
    borderRadius: 40,
  },
}));

const CourseSectionCarousel = ({courses, courseType = 'offline'}: any) => {
  const {messages} = useIntl();
  const MUKTOPATH_PRIFIX = 'mp-';
  return (
    <>
      <StyledCarouselBox>
        <CustomCarousel>
          {courses.map((item: any) => (
            <Box key={item.id} className={classes.boxItem}>
              {courseType === 'online' ? (
                <Link
                  href={`${LINK_FRONTEND_COURSE_DETAILS}${MUKTOPATH_PRIFIX}${item?.uuid}`}>
                  <CourseCardComponent course={item} />
                </Link>
              ) : (
                <Link href={`/course-details/${item.id}`}>
                  <CourseCardComponent course={item} />
                </Link>
              )}
            </Box>
          ))}
        </CustomCarousel>
      </StyledCarouselBox>
      <StyledBoxCentered display='flex' justifyContent='center'>
        <Link href={`/courses`}>
          <Button
            variant='outlined'
            size='large'
            endIcon={<ArrowRightAlt />}
            className={classes.button}>
            {messages['common.see_more']}
          </Button>
        </Link>
      </StyledBoxCentered>
    </>
  );
};

export default CourseSectionCarousel;
