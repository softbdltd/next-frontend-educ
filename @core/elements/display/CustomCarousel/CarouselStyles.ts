const CarouselStyles = {
  overflow: 'hidden',
  position: 'relative',
  padding: '0px 0px',

  '&.react-multi-carousel-list': {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  '& .react-multi-carousel-list img': {
    pointerEvents: 'none',
  },

  '& .react-multi-carousel-track': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    willChange: 'transform, transition',
    overflow: 'visible !important',
  },

  '& .react-multiple-carousel__arrow': {
    position: 'absolute',
    outline: 0,
    transition: 'all .5s',
    borderRadius: '35px',
    zIndex: 1000,
    border: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    minWidth: '43px',
    minHeight: '43px',
    opacity: 1,
    cursor: 'pointer',
    top: 'calc(50% - 22px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  '& .react-multiple-carousel__arrow:hover': {
    background: 'rgba(0, 0, 0, 0.8)',
  },

  '& .react-multiple-carousel__arrow::before': {
    fontSize: '20px',
    color: '#fff',
    display: 'inline-block',
    // fontFamily: 'revicons',
    textAlign: 'center',
    zIndex: 2,
    position: 'relative',
    borderTop: '2px solid #fff',
    borderLeft: '2px solid #fff',
    // border: '2px solid #fff',
    boxSizing: 'border-box',
    height: '12px',
    width: '12px',
  },

  '& .react-multiple-carousel__arrow:disabled': {
    cursor: 'default',
    background: 'rgba(0, 0, 0, 0.5)',
  },

  '& .react-multiple-carousel__arrow--left': {
    left: 'calc(4% + 1px)',
  },

  '& .react-multiple-carousel__arrow--left::before': {
    content: "''", //"'\\e824'",
    transform: 'rotate(-45deg) translate(1px, 1px)',
  },

  '& .react-multiple-carousel__arrow--right': {
    right: 'calc(4% + 1px)',
  },

  '& .react-multiple-carousel__arrow--right::before': {
    content: "''", //"'\\e825'",
    transform: 'rotate(135deg) translate(1px, 1px)',
  },

  '& .react-multi-carousel-dot-list': {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    left: 0,
    right: 0,
    justifyContent: 'center',
    // margin: 'auto',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    textAlign: 'center',
  },

  '& .react-multi-carousel-dot button': {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    opacity: 1,
    // padding: '5px 5px 5px 5px',
    boxShadow: 'none',
    transition: 'background .5s',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'grey',
    padding: 0,
    margin: 0,
    marginRight: '6px',
    outline: 0,
    cursor: 'pointer',
  },

  '& .react-multi-carousel-dot button:hover:active': {
    background: '#080808',
  },

  '& .react-multi-carousel-dot--active button': {
    background: '#080808',
  },

  '& .react-multi-carousel-item': {
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    flexShrink: '0 !important',
  },

  '& .react-multi-carousel-item--active:first-of-type': {
    paddingLeft: '1px',
  },

  /*'& @media all and (-ms-high-contrast: none),(-ms-high-contrast: active)': {
    '& .react-multi-carousel-item': {
      flexShrink: '0 !important',
    },

    '& .react-multi-carousel-track': {
      overflow: 'visible !important',
    },
  },*/
};

export default CarouselStyles;
