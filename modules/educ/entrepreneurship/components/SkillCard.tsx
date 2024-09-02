import {Link, Rating} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Box, styled} from '@mui/system';
import Image from 'next/image';
import React from 'react';
import {useIntl} from 'react-intl';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../../@core/common/apiRoutes';
import {LINK_FRONTEND_COURSE_DETAILS} from '../../../../@core/common/appLinks';
import {Body1} from '../../../../@core/elements/common';

interface IProps {
  course: any;
}

const StyledCard = styled(Card)({
  padding: '20px',
  position: 'relative',
  height: '100%',
  borderRadius: '8px',
  [`.logo-image`]: {
    // objectFit: 'contain',
  },
  [`.price_position`]: {
    position: 'absolute',
    top: 30,
    left: 40,
    padding: '2px 12px',
    background: 'white',
    color: '#126E64',
    borderRadius: '5px',
    fontWeight: '700',
  },
  [`& .btn`]: {
    textDecoration: 'underline',
    textDecorationColor: '#126e64',
  },
  [`&:hover, &:focus`]: {
    // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    background: '#671688',
    color: 'white',
    [`& .RatingColor`]: {
      color: 'white',
    },
    ['& .btn']: {
      // padding: '4px 12px',
      background: 'white',
      textDecoration: 'underline',
      textDecorationColor: '#126e64',
      transition:
        'text-decoration 0.2s ease-in-out, text-decoration-color 0.2s ease-in-out',
    },
  },
});

const SkillCard = ({course}: IProps) => {
  const {messages} = useIntl();
  const [value] = React.useState(4);
  const absoluteImageUrl = course?.cover_image
    ? FILE_SERVER_FILE_VIEW_ENDPOINT + course?.cover_image
    : '/images/blank_image.png';
  // const absoluteImageUrl = course?.cover_image;

  // const CourseFee = () => {
  //   return course?.course_fee ? (
  //     <Stack alignItems={'center'} direction={'row'} gap={'8px'}>
  //       <img src={'/images/bdt-icon.png'} /> {formatNumber(course?.course_fee)}
  //     </Stack>
  //   ) : (
  //     messages['common.free']
  //   );
  // };

  const RenderInstituteLogo = () => {
    // course.stakeholder_id = 1;
    let instituteLogo;
    if (course?.stakeholder_id == 1) {
      instituteLogo = '/images/stakeholder/undp_logo.png';
    } else if (course?.stakeholder_id == 2) {
      instituteLogo = '/images/stakeholder/ilo-logo.png';
    } else if (course?.stakeholder_id == 3) {
      instituteLogo = '/images/stakeholder/brac-logo.png';
    } else {
      instituteLogo = '/images/blank_image.png';
    }
    const calculateWidth = () => {
      return course?.stakeholder_id == 1 || course?.stakeholder_id == 2
        ? 30
        : 55;
    };
    const calculateHeight = () => {
      return course?.stakeholder_id == 1
        ? 50
        : course?.stakeholder_id == 2
        ? 60
        : 30;
    };
    return (
      <Box>
        <Image
          className={'logo-image'}
          src={instituteLogo}
          width={calculateWidth()}
          height={calculateHeight()}
          alt={'skill-provider-logo'}
        />
      </Box>
    );
  };

  return (
    <Link
      href={LINK_FRONTEND_COURSE_DETAILS + course?.id}
      style={{textDecoration: 'none'}}>
      <StyledCard>
        <CardMedia
          sx={{height: 140, borderRadius: '20px'}}
          image={absoluteImageUrl}
          title='green iguana'
        />

        <CardContent>
          <RenderInstituteLogo />
          <Body1>{course?.institute_title}</Body1>

          <Typography
            sx={{
              fontSize: '24px !important',
              fontWeight: '700',
              mb: '12px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}>
            {course?.title}
          </Typography>
          <Box sx={{display: 'flex'}}>
            <Rating
              className='RatingColor'
              name='read-only'
              value={value}
              readOnly
            />
            <Typography>({course?.rating_count || 15})</Typography>
          </Box>

          {/*<Typography*/}
          {/*  className='price_position'*/}
          {/*  gutterBottom*/}
          {/*  variant='h6'*/}
          {/*  component='div'>*/}
          {/*  {CourseFee()}*/}
          {/*</Typography>*/}
        </CardContent>
        <CardActions>
          <Button
            disableElevation
            disableFocusRipple
            disableRipple
            className='btn'>
            {messages['common.apply_now']}
          </Button>
        </CardActions>
      </StyledCard>
    </Link>
  );
};

export default SkillCard;
