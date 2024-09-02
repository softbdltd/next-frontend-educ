import Carousel from 'react-multi-carousel';
import {styled} from '@mui/material/styles';
// import 'react-multi-carousel/lib/styles.css';// DO NOT USE
import React, {ReactNode} from 'react';
import BannerTemplateCenterBackground from '../../../../modules/institute/Components/BannerTemplateCenterBackground';
import BannerTemplateLeftRight from '../../../../modules/institute/Components/BannerTemplateLeftRight';
import BannerTemplateRightLeft from '../../../../modules/institute/Components/BannerTemplateRightLeft';
import {rgba} from 'polished';
import CarouselStyles from '../CustomCarousel/CarouselStyles';
import BannerTemplateBackgroundImage from '../../../../modules/institute/Components/BannerTemplateBackgroundImage';

const PREFIX = 'ImageCarousel';

const classes = {
  imageBox: `${PREFIX}-imageBox`,
  image: `${PREFIX}-image`,
  heading: `${PREFIX}-heading`,
  customLeftArrow: `${PREFIX}-customLeftArrow`,
  reactMultipleCarousalArrow: `${PREFIX}-reactMultipleCarousalArrow`,
};

// @ts-ignore
const StyledCarousel = styled(Carousel)(({theme}) => ({
  ...CarouselStyles,
  [`& .${classes.imageBox}`]: {
    height: 500,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    display: 'flex',
  },

  [`& .${classes.image}`]: {
    zIndex: -1,
    position: 'absolute',
    objectFit: 'cover',
    height: '100%',
    width: '100%',
  },

  [`& .${classes.heading}`]: {
    color: theme.palette.background.paper,
    margin: '20px 40px',
    textAlign: 'center',
    flex: 1,
  },

  [`& .${classes.customLeftArrow}`]: {
    left: 'calc(8.5% +1px)',
  },

  [`& .${classes.reactMultipleCarousalArrow}`]: {
    position: 'absolute',
    outline: 0,
    transition: 'all .5s',
    borderRadius: '35px',
    zIndex: 1000,
    border: 0,
    background: rgba(0, 0, 0, 0.5),
    minWidth: '43px',
    minHeight: '43px',
    opacity: 1,
    cursor: 'pointer',
  },
}));

type Props = {
  children?: ReactNode;
  banners: Array<any>;
};

const ImageCarousel = ({banners}: Props) => {
  // const customLeftArrow = useCallback(() => {

  //
  //   return (
  //     <button
  //       aria-label='Go to previous slide'
  //       className={clsx(
  //         classes.reactMultipleCarousalArrow,
  //         classes.customLeftArrow,
  //       )}
  //       type='button'
  //     />
  //   );
  // }, []);

  return (
    <StyledCarousel
      additionalTransfrom={0}
      arrows
      autoPlay={true}
      autoPlaySpeed={3000}
      beforeChange={() => {
        //console.log('beforeChange');
      }}
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
      // customLeftArrow={customLeftArrow()}
      responsive={{
        // desktop: {
        //   breakpoint: {
        //     max: 3000,
        //     min: 1024,
        //   },
        //   items: 1,
        // },
        // tablet: {
        //   breakpoint: {
        //     max: 1024,
        //     min: 464,
        //   },
        //   items: 1,
        // },
        mobile: {
          breakpoint: {
            max: 99999999, //464,
            min: 0,
          },
          items: 1,
        },
      }}
      // showDots
      sliderClass=''
      slidesToSlide={1}
      swipeable>
      {banners &&
        banners?.length &&
        banners.map((banner: any, i) => {
          switch (banner?.banner_template_code) {
            case 'BT_CB':
              return <BannerTemplateCenterBackground key={i} banner={banner} />;
            case 'BT_RL':
              return <BannerTemplateRightLeft key={i} banner={banner} />;
            case 'BT_LR':
              return <BannerTemplateLeftRight key={i} banner={banner} />;
            case 'BT_OB':
              return <BannerTemplateBackgroundImage banner={banner} />;
            default:
              return <BannerTemplateCenterBackground key={i} banner={banner} />;
          }
        })}
    </StyledCarousel>
  );
};

export default React.memo(ImageCarousel);
