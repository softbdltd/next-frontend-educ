import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {Container, Grid} from '@mui/material';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/system';
import React, {useState} from 'react';
import PromotionBanner from '../../shared/components/PromotionBanner';
import CoverSliders from './CoverSliders';
import GraphView from './GraphView';
import JobsSection from './JobsSection';
import NewsSection from './NewsSection';
import SkillsSection from './SkillsSection';
import StatisticsSection from './StatisticsSection';
import UpcomingEventsSection from './UpcomingEventsSection';
import GraphMapView from './GraphMapView';

const PREFIX = 'Home';

const classes = {
  playButton: `${PREFIX}-playButton`,
  resetIconStyle: `${PREFIX}-resetIconStyle`,
};

const StyledBox = styled(Box)(({theme}) => ({
  background: '#fff',
  paddingBottom: '80px',
  position: 'relative',
  [`& .${classes.playButton}`]: {
    width: '36px',
    height: '33px',
    position: 'absolute',
    border: '1px solid #048340',
    borderRadius: '6px',
    paddingLeft: '6.5px',
    paddingRight: '6.5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    [`& .${classes.resetIconStyle}`]: {
      fill: theme.palette.primary.main,
      fontSize: '1.8rem',
    },
    [`&:hover, &:focus`]: {
      backgroundColor: theme.palette.primary.main,
      [`& .${classes.resetIconStyle}`]: {
        fill: theme.palette.common.white,
      },
    },
  },
}));

const Home = () => {
  const [sliderAutoplay, setSliderAutoplay] = useState(false);

  return (
    <StyledBox>
      <Box sx={{background: '#EFF8F3'}}>
        <Container maxWidth={'lg'} sx={{pb: 3, pt: '12px'}}>
          <Box
            onClick={() => setSliderAutoplay((prev) => !prev)}
            tabIndex={0}
            role='button'
            aria-label={`${sliderAutoplay ? 'Slider Play' : 'Slider Pause'}`}
            className={classes.playButton}>
            {sliderAutoplay ? (
              <PauseIcon className={classes.resetIconStyle} />
            ) : (
              <PlayArrowIcon className={classes.resetIconStyle} />
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} mt={4}>
              <CoverSliders autoPlay={sliderAutoplay} />
            </Grid>
            <Hidden mdDown>
              <Grid item xs={12} md={7}>
                <GraphView autoPlay={sliderAutoplay} />
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth={'lg'}>
        <StatisticsSection />
        <GraphMapView />
        <JobsSection />
        <SkillsSection />
        <Grid container columnSpacing={5} sx={{borderTop: '1px solid #ddd'}}>
          <Grid item xs={12} md={5.7}>
            <NewsSection />
          </Grid>
          <Grid item md={0.2}>
            <Divider orientation='vertical' />
          </Grid>

          <Grid item xs={12} md={5.7}>
            <UpcomingEventsSection />
          </Grid>
        </Grid>
      </Container>
      <PromotionBanner />
    </StyledBox>
  );
};

export default Home;
