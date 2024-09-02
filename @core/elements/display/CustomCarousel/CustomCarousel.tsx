import Carousel from 'react-multi-carousel';
import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import CarouselStyles from './CarouselStyles';

// @ts-ignore
const StyledCarousel = styled(Carousel)(() => ({...CarouselStyles}));

type Props = {
  children?: ReactNode;
  itemsInDesktop?: number;
  [x: string]: any;
};

const CustomCarousel = ({children, itemsInDesktop = 4, ...props}: Props) => {
  return (
    <StyledCarousel
      additionalTransfrom={0}
      arrows
      autoPlay={true}
      autoPlaySpeed={5000}
      centerMode={false}
      className=''
      containerClass='container-with-dots'
      dotListClass=''
      draggable
      focusOnSelect={false}
      infinite
      itemClass=''
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024,
          },
          items: itemsInDesktop,
          partialVisibilityGutter: 40,
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
          partialVisibilityGutter: 30,
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: 2,
          partialVisibilityGutter: 30,
        },
      }}
      showDots={false}
      sliderClass=''
      slidesToSlide={1}
      swipeable
      {...props}>
      {children}
    </StyledCarousel>
  );
};

export default React.memo(CustomCarousel);
