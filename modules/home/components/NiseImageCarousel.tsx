import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';// DO NOT USE
import React, {ReactNode} from 'react';
import LandingBannerTemplateCenterBackground from './LandingBannerTemplateCenterBackground';
import LandingBannerTemplateRightLeft from './LandingBannerTemplateRightLeft';
import LandingBannerTemplateLeftRight from './LandingBannerTemplateLeftRight';
import {styled} from '@mui/material/styles';
import CarouselStyles from '../../../@core/elements/display/CustomCarousel/CarouselStyles';
import LandingBannerTemplateBackgroundImage from './LandingBannerTemplateBackgroundImage';

// @ts-ignore
const StyledCarousel = styled(Carousel)(() => ({...CarouselStyles}));

type Props = {
  children?: ReactNode;
  banners: Array<any>;
};

const EducImageCarousel = ({banners}: Props) => {
  return (
    <StyledCarousel
      additionalTransfrom={0}
      arrows
      autoPlay={true}
      autoPlaySpeed={10000}
      beforeChange={() => {}}
      centerMode={false}
      className=''
      containerClass='container'
      dotListClass=''
      draggable
      focusOnSelect={true}
      infinite
      itemClass=''
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={true}
      renderDotsOutside={false}
      responsive={{
        mobile: {
          breakpoint: {
            max: 99999999, //464,
            min: 0,
          },
          items: 1,
        },
      }}
      sliderClass=''
      slidesToSlide={1}
      swipeable>
      {banners &&
        banners?.length &&
        banners.map((banner: any, index) => {
          switch (banner?.banner_template_code) {
            case 'BT_CB':
              return (
                <LandingBannerTemplateCenterBackground
                  banner={banner}
                  key={index}
                />
              );
            case 'BT_RL':
              return (
                <LandingBannerTemplateRightLeft banner={banner} key={index} />
              );
            case 'BT_LR':
              return (
                <LandingBannerTemplateLeftRight banner={banner} key={index} />
              );
            case 'BT_OB':
              return (
                <LandingBannerTemplateBackgroundImage
                  banner={banner}
                  key={index}
                />
              );
            default:
              return (
                <LandingBannerTemplateCenterBackground
                  banner={banner}
                  key={index}
                />
              );
          }
        })}
    </StyledCarousel>
  );
};

export default React.memo(EducImageCarousel);
