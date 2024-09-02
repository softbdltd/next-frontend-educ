import React from 'react';
import CoverArea from './CoverArea';
import InfoCardSection from './InfoCardSection';
import CoursesSection from './CoursesSection';
import GallerySection from './GallerySection';
import AboutSection from './AboutSection';
import EventSection from '../events/EventSection';
import PromotionBanner from '../../shared/components/PromotionBanner';
//import PopEducLanding from '../home/PopEducLanding';

// 'sidcht.educ.com'
// 'sidcht.educ.asm'
//const INSTITUTE_HOST = 'sidcht.educ.com';

const Institute = () => {
  //let host = window?.location?.host;

  return (
    <>
      <CoverArea />
      <AboutSection />
      <InfoCardSection />
      <CoursesSection />
      <EventSection />
      <GallerySection />

      <PromotionBanner />

      {/*{host == INSTITUTE_HOST && <PopEducLanding />}*/}
    </>
  );
};

export default Institute;
