const FilepondCoreCSS = {
  '.filepond--assistant': {
    position: 'absolute',
    overflow: 'hidden',
    height: '1px',
    width: '1px',
    padding: '0',
    border: '0',
    clip: 'rect(1px, 1px, 1px, 1px)',
    WebkitClipPath: 'inset(50%)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  '.filepond--browser.filepond--browser': {
    position: 'absolute',
    margin: '0',
    padding: '0',
    left: '1em',
    top: '1.75em',
    width: 'calc(100% - 2em)',
    opacity: 0,
    fontSize: '0',
  },
  '.filepond--data': {
    position: 'absolute',
    width: '0',
    height: '0',
    padding: '0',
    margin: '0',
    border: 'none',
    visibility: 'hidden',
    pointerEvents: 'none',
    contain: 'strict',
  },
  '.filepond--drip': {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflow: 'hidden',
    opacity: 0.1,
    pointerEvents: 'none',
    borderRadius: '.5em',
    background: 'rgba(0, 0, 0, .01)',
    zIndex: 3,
  },
  '.filepond--drip-blob': {
    WebkitTransformOrigin: 'center center',
    transformOrigin: 'center center',
    width: '8em',
    height: '8em',
    marginLeft: '-4em',
    marginTop: '-4em',
    background: '#292625',
    borderRadius: '50%',
  },
  '.filepond--drip-blob, .filepond--drop-label': {
    position: 'absolute',
    top: '0',
    left: '0',
    willChange: 'transform, opacity',
  },
  '.filepond--drop-label': {
    right: '0',
    margin: '0',
    color: '#4f4f4f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '0',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    zIndex: 5,
  },
  '.filepond--drop-label.filepond--drop-label label': {
    display: 'block',
    margin: '0',
    padding: '.5em',
  },
  '.filepond--drop-label label': {
    cursor: 'default',
    fontSize: '.875em',
    fontWeight: 400,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  '.filepond--label-action': {
    textDecoration: 'underline',
    WebkitTextDecorationSkip: 'ink',
    textDecorationSkipInk: 'auto',
    WebkitTextDecorationColor: '#a7a4a4',
    textDecorationColor: '#a7a4a4',
    cursor: 'pointer',
  },
  '.filepond--root[data-disabled] .filepond--drop-label label': {
    opacity: 0.5,
  },
  '.filepond--file-action-button.filepond--file-action-button': {
    fontSize: '1em',
    width: '1.625em',
    height: '1.625em',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    margin: '0',
    padding: '0',
    border: 'none',
    outline: 'none',
    willChange: 'transform, opacity',
  },
  '.filepond--file-action-button.filepond--file-action-button span': {
    position: 'absolute',
    overflow: 'hidden',
    height: '1px',
    width: '1px',
    padding: '0',
    border: '0',
    clip: 'rect(1px, 1px, 1px, 1px)',
    WebkitClipPath: 'inset(50%)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  '.filepond--file-action-button.filepond--file-action-button svg': {
    width: '100%',
    height: '100%',
  },
  '.filepond--file-action-button.filepond--file-action-button:after': {
    position: 'absolute',
    left: '-.75em',
    right: '-.75em',
    top: '-.75em',
    bottom: '-.75em',
    content: '""',
  },
  '.filepond--file-action-button': {
    cursor: 'auto',
    color: '#fff',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    backgroundImage: 'none',
    boxShadow: '0 0 0 0 hsla(0, 0%, 100%, 0)',
    transition: 'box-shadow .25s ease-in',
    zIndex: 102,
  },
  '.filepond--file-action-button:focus, .filepond--file-action-button:hover': {
    boxShadow: '0 0 0 .125em hsla(0, 0%, 100%, .9)',
  },
  '.filepond--file-action-button[disabled]': {
    color: 'hsla(0, 0%, 100%, .5)',
    backgroundColor: 'rgba(0, 0, 0, .25)',
  },
  '.filepond--file-action-button[hidden]': {display: 'none'},
  '.filepond--action-edit-item.filepond--action-edit-item': {
    width: '2em',
    height: '2em',
    padding: '.1875em',
  },
  '.filepond--action-edit-item.filepond--action-edit-item[data-align*=center]':
    {
      marginLeft: '-.1875em',
    },
  '.filepond--action-edit-item.filepond--action-edit-item[data-align*=bottom]':
    {
      marginBottom: '-.1875em',
    },
  '.filepond--action-edit-item-alt': {
    border: 'none',
    lineHeight: 'inherit',
    background: 'transparent',
    fontFamily: 'inherit',
    color: 'inherit',
    outline: 'none',
    padding: '0',
    margin: '0 0 0 .25em',
    pointerEvents: 'all',
    position: 'absolute',
  },
  '.filepond--action-edit-item-alt svg': {
    width: '1.3125em',
    height: '1.3125em',
  },
  '.filepond--action-edit-item-alt span': {fontSize: '0', opacity: 0},
  '.filepond--file-info': {
    position: 'static',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    margin: '0 .5em 0 0',
    minWidth: '0',
    willChange: 'transform, opacity',
    pointerEvents: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    zIndex: 100,
  },
  '.filepond--file-info *': {margin: '0'},
  '.filepond--file-info .filepond--file-info-main': {
    fontSize: '.75em',
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  '.filepond--file-info .filepond--file-info-sub': {
    fontSize: '.625em',
    opacity: 0.5,
    transition: 'opacity .25s ease-in-out',
    whiteSpace: 'nowrap',
  },
  '.filepond--file-info .filepond--file-info-sub:empty': {display: 'none'},
  '.filepond--file-status': {
    position: 'static',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexGrow: 0,
    flexShrink: 0,
    margin: '0',
    minWidth: '2.25em',
    textAlign: 'right',
    willChange: 'transform, opacity',
    pointerEvents: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    zIndex: 101,
  },
  '.filepond--file-status *': {margin: '0', whiteSpace: 'nowrap'},
  '.filepond--file-status .filepond--file-status-main': {
    fontSize: '.75em',
    lineHeight: 1.2,
  },
  '.filepond--file-status .filepond--file-status-sub': {
    fontSize: '.625em',
    opacity: 0.5,
    transition: 'opacity .25s ease-in-out',
  },
  '.filepond--file-wrapper.filepond--file-wrapper': {
    border: 'none',
    margin: '0',
    padding: '0',
    minWidth: '0',
    height: '100%',
  },
  '.filepond--file-wrapper.filepond--file-wrapper > legend': {
    position: 'absolute',
    overflow: 'hidden',
    height: '1px',
    width: '1px',
    padding: '0',
    border: '0',
    clip: 'rect(1px, 1px, 1px, 1px)',
    WebkitClipPath: 'inset(50%)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  '.filepond--file': {
    position: 'static',
    display: 'flex',
    height: '100%',
    alignItems: 'flex-start',
    padding: '.5625em',
    color: '#fff',
    borderRadius: '.5em',
  },
  '.filepond--file .filepond--file-status': {
    marginLeft: 'auto',
    marginRight: '2.25em',
  },
  '.filepond--file .filepond--processing-complete-indicator': {
    pointerEvents: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    zIndex: 3,
  },
  '.filepond--file .filepond--file-action-button, .filepond--file .filepond--processing-complete-indicator, .filepond--file .filepond--progress-indicator':
    {
      position: 'absolute',
    },
  '.filepond--file [data-align*=left]': {left: '.5625em'},
  '.filepond--file [data-align*=right]': {right: '.5625em'},
  '.filepond--file [data-align*=center]': {left: 'calc(50% - .8125em)'},
  '.filepond--file [data-align*=bottom]': {bottom: '1.125em'},
  '.filepond--file [data-align=center]': {top: 'calc(50% - .8125em)'},
  '.filepond--file .filepond--progress-indicator': {marginTop: '.1875em'},
  '.filepond--file .filepond--progress-indicator[data-align*=right]': {
    marginRight: '.1875em',
  },
  '.filepond--file .filepond--progress-indicator[data-align*=left]': {
    marginLeft: '.1875em',
  },
  '[data-filepond-item-state*=error] .filepond--file-info, [data-filepond-item-state*=invalid] .filepond--file-info, [data-filepond-item-state=cancelled] .filepond--file-info':
    {
      marginRight: '2.25em',
    },
  '[data-filepond-item-state~=processing] .filepond--file-status-sub': {
    opacity: 0,
  },
  '[data-filepond-item-state~=processing] .filepond--action-abort-item-processing ~ .filepond--file-status .filepond--file-status-sub':
    {
      opacity: 0.5,
    },
  '[data-filepond-item-state=processing-error] .filepond--file-status-sub': {
    opacity: 0,
  },
  '[data-filepond-item-state=processing-error] .filepond--action-retry-item-processing ~ .filepond--file-status .filepond--file-status-sub':
    {
      opacity: 0.5,
    },
  '[data-filepond-item-state=processing-complete] .filepond--action-revert-item-processing svg':
    {
      WebkitAnimation: 'fall .5s linear .125s both',
      animation: 'fall .5s linear .125s both',
    },
  '[data-filepond-item-state=processing-complete] .filepond--file-status-sub': {
    opacity: 0.5,
  },
  '[data-filepond-item-state=processing-complete] .filepond--file-info-sub, [data-filepond-item-state=processing-complete] .filepond--processing-complete-indicator:not([style*=hidden]) ~ .filepond--file-status .filepond--file-status-sub':
    {
      opacity: 0,
    },
  '[data-filepond-item-state=processing-complete] .filepond--action-revert-item-processing ~ .filepond--file-info .filepond--file-info-sub':
    {
      opacity: 0.5,
    },
  '[data-filepond-item-state*=error] .filepond--file-wrapper, [data-filepond-item-state*=error] .filepond--panel, [data-filepond-item-state*=invalid] .filepond--file-wrapper, [data-filepond-item-state*=invalid] .filepond--panel':
    {
      WebkitAnimation: 'shake .65s linear both',
      animation: 'shake .65s linear both',
    },
  '[data-filepond-item-state*=busy] .filepond--progress-indicator svg': {
    WebkitAnimation: 'spin 1s linear infinite',
    animation: 'spin 1s linear infinite',
  },
  '@-webkit-keyframes spin': {
    '0%': {WebkitTransform: 'rotate(0deg)', transform: 'rotate(0deg)'},
    to: {WebkitTransform: 'rotate(1turn)', transform: 'rotate(1turn)'},
  },
  '@keyframes spin': {
    '0%': {WebkitTransform: 'rotate(0deg)', transform: 'rotate(0deg)'},
    to: {WebkitTransform: 'rotate(1turn)', transform: 'rotate(1turn)'},
  },
  '@-webkit-keyframes shake': {
    '10%, 90%': {
      WebkitTransform: 'translateX(-.0625em)',
      transform: 'translateX(-.0625em)',
    },
    '20%, 80%': {
      WebkitTransform: 'translateX(.125em)',
      transform: 'translateX(.125em)',
    },
    '30%, 50%, 70%': {
      WebkitTransform: 'translateX(-.25em)',
      transform: 'translateX(-.25em)',
    },
    '40%, 60%': {
      WebkitTransform: 'translateX(.25em)',
      transform: 'translateX(.25em)',
    },
  },
  '@keyframes shake': {
    '10%, 90%': {
      WebkitTransform: 'translateX(-.0625em)',
      transform: 'translateX(-.0625em)',
    },
    '20%, 80%': {
      WebkitTransform: 'translateX(.125em)',
      transform: 'translateX(.125em)',
    },
    '30%, 50%, 70%': {
      WebkitTransform: 'translateX(-.25em)',
      transform: 'translateX(-.25em)',
    },
    '40%, 60%': {
      WebkitTransform: 'translateX(.25em)',
      transform: 'translateX(.25em)',
    },
  },
  '@-webkit-keyframes fall': {
    '0%': {
      opacity: 0,
      WebkitTransform: 'scale(.5)',
      transform: 'scale(.5)',
      WebkitAnimationTimingFunction: 'ease-out',
      animationTimingFunction: 'ease-out',
    },
    '70%': {
      opacity: 1,
      WebkitTransform: 'scale(1.1)',
      transform: 'scale(1.1)',
      WebkitAnimationTimingFunction: 'ease-in-out',
      animationTimingFunction: 'ease-in-out',
    },
    to: {
      WebkitTransform: 'scale(1)',
      transform: 'scale(1)',
      WebkitAnimationTimingFunction: 'ease-out',
      animationTimingFunction: 'ease-out',
    },
  },
  '@keyframes fall': {
    '0%': {
      opacity: 0,
      WebkitTransform: 'scale(.5)',
      transform: 'scale(.5)',
      WebkitAnimationTimingFunction: 'ease-out',
      animationTimingFunction: 'ease-out',
    },
    '70%': {
      opacity: 1,
      WebkitTransform: 'scale(1.1)',
      transform: 'scale(1.1)',
      WebkitAnimationTimingFunction: 'ease-in-out',
      animationTimingFunction: 'ease-in-out',
    },
    to: {
      WebkitTransform: 'scale(1)',
      transform: 'scale(1)',
      WebkitAnimationTimingFunction: 'ease-out',
      animationTimingFunction: 'ease-out',
    },
  },
  '.filepond--hopper[data-hopper-state=drag-over] > *': {
    pointerEvents: 'none',
  },
  '.filepond--hopper[data-hopper-state=drag-over]:after': {
    content: '""',
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    bottom: '0',
    zIndex: 100,
  },
  '.filepond--progress-indicator': {
    zIndex: 103,
    position: 'static',
    width: '1.25em',
    height: '1.25em',
    color: '#fff',
    margin: '0',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  },
  '.filepond--item': {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    zIndex: 1,
    padding: '0',
    margin: '.25em',
    willChange: 'transform, opacity',
  },
  '.filepond--item > .filepond--panel': {zIndex: -1},
  '.filepond--item > .filepond--panel .filepond--panel-bottom': {
    boxShadow: '0 .0625em .125em -.0625em rgba(0, 0, 0, .25)',
  },
  '.filepond--item > .filepond--file-wrapper, .filepond--item > .filepond--panel':
    {
      transition: 'opacity .15s ease-out',
    },
  '.filepond--item[data-drag-state]': {cursor: ['-webkit-grab', 'grab']},
  '.filepond--item[data-drag-state] > .filepond--panel': {
    transition: 'box-shadow .125s ease-in-out',
    boxShadow: '0 0 0 transparent',
  },
  '.filepond--item[data-drag-state=drag]': {
    cursor: ['-webkit-grabbing', 'grabbing'],
  },
  '.filepond--item[data-drag-state=drag] > .filepond--panel': {
    boxShadow: '0 .125em .3125em rgba(0, 0, 0, .325)',
  },
  '.filepond--item[data-drag-state]:not([data-drag-state=idle])': {zIndex: 2},
  '.filepond--item-panel': {
    backgroundColor: '#64605e',
    borderRadius: '.5em',
    transition: 'background-color .25s',
  },
  '[data-filepond-item-state=processing-complete] .filepond--item-panel': {
    backgroundColor: '#369763',
  },
  '[data-filepond-item-state*=error] .filepond--item-panel, [data-filepond-item-state*=invalid] .filepond--item-panel':
    {
      backgroundColor: '#c44e47',
    },
  '.filepond--list-scroller': {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    margin: '0',
    willChange: 'transform',
    zIndex: 6,
  },
  '.filepond--list-scroller[data-state=overflow] .filepond--list': {
    bottom: '0',
    right: '0',
  },
  '.filepond--list-scroller[data-state=overflow]': {
    overflowY: 'scroll',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    WebkitMask: 'linear-gradient(180deg, #000 calc(100% - .5em), transparent)',
    mask: 'linear-gradient(180deg, #000 calc(100% - .5em), transparent)',
  },
  '.filepond--list-scroller::-webkit-scrollbar': {background: 'transparent'},
  '.filepond--list-scroller::-webkit-scrollbar:vertical': {width: '1em'},
  '.filepond--list-scroller::-webkit-scrollbar:horizontal': {height: '0'},
  '.filepond--list-scroller::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderRadius: '99999px',
    border: '.3125em solid transparent',
    backgroundClip: 'content-box',
  },
  '.filepond--list.filepond--list': {
    position: 'absolute',
    top: '0',
    margin: '0',
    padding: '0',
    listStyleType: 'none',
    willChange: 'transform',
  },
  '.filepond--list': {left: '.75em', right: '.75em'},
  '.filepond--root[data-style-panel-layout~=integrated]': {
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    margin: '0',
  },
  '.filepond--root[data-style-panel-layout~=circle] .filepond--panel-root, .filepond--root[data-style-panel-layout~=integrated] .filepond--panel-root':
    {
      borderRadius: '0',
    },
  '.filepond--root[data-style-panel-layout~=circle] .filepond--panel-root > *, .filepond--root[data-style-panel-layout~=integrated] .filepond--panel-root > *':
    {
      display: 'none',
    },
  '.filepond--root[data-style-panel-layout~=circle] .filepond--drop-label, .filepond--root[data-style-panel-layout~=integrated] .filepond--drop-label':
    {
      bottom: '0',
      height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 7,
    },
  '.filepond--root[data-style-panel-layout~=circle] .filepond--item-panel, .filepond--root[data-style-panel-layout~=integrated] .filepond--item-panel':
    {
      display: 'none',
    },
  '.filepond--root[data-style-panel-layout~=compact] .filepond--list-scroller, .filepond--root[data-style-panel-layout~=integrated] .filepond--list-scroller':
    {
      overflow: 'hidden',
      height: '100%',
      marginTop: '0',
      marginBottom: '0',
    },
  '.filepond--root[data-style-panel-layout~=compact] .filepond--list, .filepond--root[data-style-panel-layout~=integrated] .filepond--list':
    {
      left: '0',
      right: '0',
      height: '100%',
    },
  '.filepond--root[data-style-panel-layout~=compact] .filepond--item, .filepond--root[data-style-panel-layout~=integrated] .filepond--item':
    {
      margin: '0',
    },
  '.filepond--root[data-style-panel-layout~=compact] .filepond--file-wrapper, .filepond--root[data-style-panel-layout~=integrated] .filepond--file-wrapper':
    {
      height: '100%',
    },
  '.filepond--root[data-style-panel-layout~=compact] .filepond--drop-label, .filepond--root[data-style-panel-layout~=integrated] .filepond--drop-label':
    {
      zIndex: 7,
    },
  '.filepond--root[data-style-panel-layout~=circle]': {
    borderRadius: '99999rem',
    overflow: 'hidden',
  },
  '.filepond--root[data-style-panel-layout~=circle] > .filepond--panel': {
    borderRadius: 'inherit',
  },
  '.filepond--root[data-style-panel-layout~=circle] > .filepond--panel > *': {
    display: 'none',
  },
  '.filepond--root[data-style-panel-layout~=circle] .filepond--file-info, .filepond--root[data-style-panel-layout~=circle] .filepond--file-status':
    {
      display: 'none',
    },
  '.filepond--root[data-style-panel-layout~=circle] .filepond--action-edit-item':
    {
      opacity: '1 !important',
      visibility: 'visible !important',
    },
  '@media not all and (min-resolution: 0.001dpcm)': {
    '@supports (-webkit-appearance:none) and (stroke-color:transparent)': {
      '.filepond--root[data-style-panel-layout~=circle]': {
        willChange: 'transform',
      },
    },
  },
  '.filepond--panel-root': {borderRadius: '.5em', backgroundColor: '#f1f0ef'},
  '.filepond--panel': {
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    margin: '0',
    height: '100% !important',
    pointerEvents: 'none',
  },
  '.filepond-panel:not([data-scalable=false])': {height: 'auto !important'},
  '.filepond--panel[data-scalable=false] > div': {display: 'none'},
  '.filepond--panel[data-scalable=true]': {
    WebkitTransformStyle: 'preserve-3d',
    transformStyle: 'preserve-3d',
    backgroundColor: 'transparent !important',
    border: 'none !important',
  },
  '.filepond--panel-bottom, .filepond--panel-center, .filepond--panel-top': {
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    margin: '0',
    padding: '0',
  },
  '.filepond--panel-bottom, .filepond--panel-top': {height: '.5em'},
  '.filepond--panel-top': {
    borderBottomLeftRadius: '0 !important',
    borderBottomRightRadius: '0 !important',
    borderBottom: 'none !important',
  },
  '.filepond--panel-top:after': {
    content: '""',
    position: 'absolute',
    height: '2px',
    left: '0',
    right: '0',
    bottom: '-1px',
    backgroundColor: 'inherit',
  },
  '.filepond--panel-bottom, .filepond--panel-center': {
    willChange: 'transform',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    WebkitTransformOrigin: 'left top',
    transformOrigin: 'left top',
    WebkitTransform: 'translate3d(0, .5em, 0)',
    transform: 'translate3d(0, .5em, 0)',
  },
  '.filepond--panel-bottom': {
    borderTopLeftRadius: '0 !important',
    borderTopRightRadius: '0 !important',
    borderTop: 'none !important',
  },
  '.filepond--panel-bottom:before': {
    content: '""',
    position: 'absolute',
    height: '2px',
    left: '0',
    right: '0',
    top: '-1px',
    backgroundColor: 'inherit',
  },
  '.filepond--panel-center': {
    height: '100px !important',
    borderTop: 'none !important',
    borderBottom: 'none !important',
    borderRadius: '0 !important',
  },
  '.filepond--panel-center:not([style])': {visibility: 'hidden'},
  '.filepond--progress-indicator svg': {
    width: '100%',
    height: '100%',
    verticalAlign: 'top',
    transformBox: 'fill-box',
  },
  '.filepond--progress-indicator path': {
    fill: 'none',
    stroke: 'currentColor',
  },
  '.filepond--root > .filepond--panel': {zIndex: 2},
  '.filepond--browser': {zIndex: 1},
  '.filepond--root': {
    boxSizing: 'border-box',
    position: 'relative',
    marginBottom: '1em',
    fontSize: '1rem',
    lineHeight: 'normal',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
    fontWeight: 450,
    textAlign: 'left',
    textRendering: 'optimizeLegibility',
    direction: 'ltr',
    contain: 'layout style size',
  },
  '.filepond--root *': {boxSizing: 'inherit', lineHeight: 'inherit'},
  '.filepond--root :not(text)': {fontSize: 'inherit'},
  '.filepond--root[data-disabled]': {pointerEvents: 'none'},
  '.filepond--root[data-disabled] .filepond--list-scroller': {
    pointerEvents: 'all',
  },
  '.filepond--root[data-disabled] .filepond--list': {pointerEvents: 'none'},
  '.filepond--root .filepond--drop-label': {minHeight: '4.75em'},
  '.filepond--root .filepond--list-scroller': {
    marginTop: '1em',
    marginBottom: '1em',
  },
  '.filepond--root .filepond--credits': {
    position: 'absolute',
    right: '0',
    opacity: 0.175,
    lineHeight: 0.85,
    fontSize: '11px',
    color: 'inherit',
    textDecoration: 'none',
    zIndex: 3,
    bottom: '-14px',
  },
  '.filepond--root .filepond--credits[style]': {
    top: '0',
    bottom: 'auto',
    marginTop: '14px',
  },
};

const FilepondImagePreviewCSS = {
  '.filepond--image-preview-markup': {
    position: 'absolute',
    left: '0',
    top: '0',
  },
  '.filepond--image-preview-wrapper': {
    zIndex: '2',
    /* no interaction */
    userSelect: 'none',

    /* have preview fill up all available space */
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    height: '100%',
    margin: '0',

    /* radius is .05em less to prevent the panel background color from shining through */
    borderRadius: '0.45em',
    overflow: 'hidden',

    /* this seems to prevent Chrome from redrawing this layer constantly */
    background: 'rgba(0, 0, 0, 0.01)',
  },
  '.filepond--image-preview-overlay': {
    display: 'block',
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    minHeight: '5rem',
    maxHeight: '7rem',
    margin: '0',
    opacity: '0',
    zIndex: '2',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  '.filepond--image-preview-overlay svg': {
    width: '100%',
    height: 'auto',
    color: 'inherit',
    maxHeight: 'inherit',
  },
  '.filepond--image-preview-overlay-idle': {
    mixBlendMode: 'multiply',
    color: 'rgba(40, 40, 40, 0.85)',
  },
  '.filepond--image-preview-overlay-success': {
    mixBlendMode: 'normal',
    color: 'rgba(54, 151, 99, 1)',
  },
  '.filepond--image-preview-overlay-failure': {
    mixBlendMode: 'normal',
    color: 'rgba(196, 78, 71, 1)',
  },
  /* disable for Safari as mix-blend-mode causes the overflow:hidden of the parent container to not work */
  '@supports (-webkit-marquee-repetition: infinite) and ((-o-object-fit: fill) or (object-fit: fill))':
    {
      '.filepond--image-preview-overlay-idle': {
        mixBlendMode: 'normal',
      },
    },
  '.filepond--image-preview': {
    position: 'absolute',
    left: '0',
    top: '0',
    zIndex: '1',
    display:
      'flex' /* this aligns the graphic vertically if the panel is higher than the image */,
    alignItems: 'center',
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    background: '#222',

    /* will be animated */
    willChange: 'transform, opacity',
  },
  '.filepond--image-clip': {
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto',

    /* transparency indicator (currently only supports grid or basic color) */
  },
  ".filepond--image-clip[data-transparency-indicator='grid'] img, .filepond--image-clip[data-transparency-indicator='grid'] canvas":
    {
      backgroundColor: '#fff',
      backgroundImage:
        "url('data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' fill='%23eee'%3E%3Cpath d='M0 0 H50 V50 H0'/%3E%3Cpath d='M50 50 H100 V100 H50'/%3E%3C/svg%3E')",
      backgroundSize: '1.25em 1.25em',
    },
  '.filepond--image-bitmap .filepond--image-vector': {
    position: 'absolute',
    left: '0',
    top: '0',
    willChange: 'transform',
  },
  ".filepond--root[data-style-panel-layout~='integrated'] .filepond--image-preview-wrapper":
    {
      borderRadius: '0',
    },
  ".filepond--root[data-style-panel-layout~='integrated'] .filepond--image-preview":
    {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--image-preview-wrapper":
    {
      borderRadius: '99999rem',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--image-preview-overlay":
    {
      top: 'auto',
      bottom: '0',
      transform: 'scaleY(-1)',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--file .filepond--file-action-button[data-align*='bottom']:not([data-align*='center'])":
    {
      marginBottom: '0.325em',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--file [data-align*='left']":
    {
      left: 'calc(50% - 3em)',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--file [data-align*='right']":
    {
      right: 'calc(50% - 3em)',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--progress-indicator[data-align*='bottom'][data-align*='left'], .filepond--root[data-style-panel-layout~='circle'] .filepond--progress-indicator[data-align*='bottom'][data-align*='right']":
    {
      marginBottom: 'calc(0.325em + 0.1875em)',
    },
  ".filepond--root[data-style-panel-layout~='circle'] .filepond--progress-indicator[data-align*='bottom'][data-align*='center']":
    {
      marginTop: '0',
      marginBottom: '0.1875em',
      marginLeft: '0.1875em',
    },
  '.multi-upload .filepond--file-action-button.filepond--action-revert-item-processing':
    {
      display: 'block',
    },
  '.multi-upload .filepond--file > button': {
    display: 'block',
  },
  '.multi-upload .filepond--file > .filepond--file-status': {
    marginRight: '0px',
  },
};

export default {...FilepondCoreCSS, ...FilepondImagePreviewCSS};
