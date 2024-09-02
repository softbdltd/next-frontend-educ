// NOTE: ":first-child" was replaced with ":first-of-type"

const ReactBigCalendarCSS = {
  '.rbc-btn': {
    color: 'inherit',
    font: 'inherit',
    margin: '0',
  },
  'button.rbc-btn': {
    overflow: 'visible',
    textTransform: 'none',
    appearance: 'button',
    cursor: 'pointer',
  },
  'button[disabled].rbc-btn': {
    cursor: 'not-allowed',
  },
  'button.rbc-input::-moz-focus-inner': {
    border: '0',
    padding: '0',
  },
  '.rbc-calendar': {
    boxSizing: 'border-box',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  '.rbc-calendar *, .rbc-calendar *:before,.rbc-calendar *:after': {
    boxSizing: 'inherit',
  },
  '.rbc-abs-full, .rbc-row-bg': {
    overflow: 'hidden',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
  },
  '.rbc-ellipsis, .rbc-event-label, .rbc-row-segment .rbc-event-content, .rbc-show-more':
    {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  '.rbc-rtl': {
    direction: 'rtl',
  },
  '.rbc-off-range': {
    color: '#999999',
  },
  '.rbc-off-range-bg': {
    background: '#e6e6e6',
  },
  '.rbc-header': {
    overflow: 'hidden',
    flex: '1 0 0%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 3px',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'bold',
    fontSize: '90%',
    minHeight: '0',
    borderBottom: '1px solid #DDD',
  },
  '.rbc-header + .rbc-header': {
    borderLeft: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-header + .rbc-header': {
    borderLeftWidth: '0',
    borderRight: '1px solid #DDD',
  },
  '.rbc-header > a, .rbc-header > a:active, .rbc-header > a:visited': {
    color: 'inherit',
    textDecoration: 'none',
  },
  '.rbc-row-content': {
    position: 'relative',
    userSelect: 'none',
    zIndex: '4',
  },
  '.rbc-row-content-scrollable': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  '.rbc-row-content-scrollable .rbc-row-content-scroll-container': {
    height: '100%',
    overflowY: 'scroll',
    /* Hide scrollbar for Chrome, Safari and Opera */
    msOverflowStyle: 'none',
    /* IE and Edge */
    scrollbarWidth: 'none',
    /* Firefox */
  },
  '.rbc-row-content-scrollable .rbc-row-content-scroll-container::-webkit-scrollbar':
    {
      display: 'none',
    },
  '.rbc-today': {
    backgroundColor: '#eaf6ff',
  },
  '.rbc-toolbar': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1rem',
  },
  '.rbc-toolbar .rbc-toolbar-label': {
    flexGrow: '1',
    padding: '0 10px',
    textAlign: 'center',
  },
  '.rbc-toolbar button': {
    color: '#373a3c',
    display: 'inline-block',
    margin: '0',
    textAlign: 'center',
    verticalAlign: 'middle',
    background: 'none',
    backgroundImage: 'none',
    border: '1px solid #ccc',
    padding: '.375rem 1rem',
    borderRadius: '4px',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
  },
  '.rbc-toolbar button:active, .rbc-toolbar button.rbc-active': {
    backgroundImage: 'none',
    boxShadow: 'inset 0 3px 5px rgba(0, 0, 0, 0.125)',
    backgroundColor: '#e6e6e6',
    borderColor: '#adadad',
  },
  '.rbc-toolbar button:active:hover, .rbc-toolbar button:active:focus, .rbc-toolbar button.rbc-active:hover, .rbc-toolbar button.rbc-active:focus':
    {
      color: '#373a3c',
      backgroundColor: '#d4d4d4',
      borderColor: '#8c8c8c',
    },
  '.rbc-toolbar button:focus': {
    color: '#373a3c',
    backgroundColor: '#e6e6e6',
    borderColor: '#adadad',
  },
  '.rbc-toolbar button:hover': {
    color: '#373a3c',
    backgroundColor: '#e6e6e6',
    borderColor: '#adadad',
  },
  '.rbc-btn-group': {
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  '.rbc-btn-group > button:first-of-type:not(:last-child)': {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  },
  '.rbc-btn-group > button:last-child:not(:first-of-type)': {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
  },
  '.rbc-rtl .rbc-btn-group > button:first-of-type:not(:last-child)': {
    borderRadius: '4px',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
  },
  '.rbc-rtl .rbc-btn-group > button:last-child:not(:first-of-type)': {
    borderRadius: '4px',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  },
  '.rbc-btn-group > button:not(:first-of-type):not(:last-child)': {
    borderRadius: '0',
  },
  '.rbc-btn-group button + button': {
    marginLeft: '-1px',
  },
  '.rbc-rtl .rbc-btn-group button + button': {
    marginLeft: '0',
    marginRight: '-1px',
  },
  '.rbc-btn-group + .rbc-btn-group, .rbc-btn-group + button': {
    marginLeft: '10px',
  },
  '.rbc-event, .rbc-day-slot .rbc-background-event': {
    border: 'none',
    boxSizing: 'border-box',
    boxShadow: 'none',
    margin: '0',
    padding: '2px 5px',
    backgroundColor: '#3174ad',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  '.rbc-slot-selecting .rbc-event, .rbc-slot-selecting .rbc-day-slot .rbc-background-event, .rbc-day-slot .rbc-slot-selecting .rbc-background-event':
    {
      cursor: 'inherit',
      pointerEvents: 'none',
    },
  '.rbc-event.rbc-selected, .rbc-day-slot .rbc-selected.rbc-background-event': {
    backgroundColor: '#265985',
  },
  '.rbc-event:focus, .rbc-day-slot .rbc-background-event:focus': {
    outline: '5px auto #3b99fc',
  },
  '.rbc-event-label': {
    fontSize: '80%',
  },
  '.rbc-event-overlaps': {
    boxShadow: '-1px 1px 5px 0px rgba(51, 51, 51, 0.5)',
  },
  '.rbc-event-continues-prior': {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
  },
  '.rbc-event-continues-after': {
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  },
  '.rbc-event-continues-earlier': {
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  '.rbc-event-continues-later': {
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  },
  '.rbc-row': {
    display: 'flex',
    flexDirection: 'row',
  },
  '.rbc-row-segment': {
    padding: '0 1px 1px 1px',
  },
  '.rbc-selected-cell': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  '.rbc-show-more': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: '4',
    fontWeight: 'bold',
    fontSize: '85%',
    height: 'auto',
    lineHeight: 'normal',
  },
  '.rbc-month-view': {
    position: 'relative',
    border: '1px solid #DDD',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 0',
    width: '100%',
    userSelect: 'none',
    height: '100%',
  },
  '.rbc-month-header': {
    display: 'flex',
    flexDirection: 'row',
  },
  '.rbc-month-row': {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    flex: '1 0 0',
    flexBasis: '0px',
    overflow: 'hidden',
    height: '100%',
  },
  '.rbc-month-row + .rbc-month-row': {
    borderTop: '1px solid #DDD',
  },
  '.rbc-date-cell': {
    flex: '1 1 0',
    minWidth: '0',
    paddingRight: '5px',
    textAlign: 'right',
    lineHeight: '1.1',
  },
  '.rbc-date-cell.rbc-now': {
    fontWeight: 'bold',
  },
  '.rbc-date-cell > a, .rbc-date-cell > a:active, .rbc-date-cell > a:visited': {
    color: 'inherit',
    textDecoration: 'none',
  },
  '.rbc-row-bg': {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 0 0',
    overflow: 'hidden',
  },
  '.rbc-day-bg': {
    flex: '1 0 0%',
  },
  '.rbc-day-bg + .rbc-day-bg': {
    borderLeft: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-day-bg + .rbc-day-bg': {
    borderLeftWidth: '0',
    borderRight: '1px solid #DDD',
  },
  '.rbc-overlay': {
    position: 'absolute',
    zIndex: '5',
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.25)',
    padding: '10px',
  },
  '.rbc-overlay > * + *': {
    marginTop: '1px',
  },
  '.rbc-overlay-header': {
    borderBottom: '1px solid #e5e5e5',
    margin: '-10px -10px 5px -10px',
    padding: '2px 10px',
  },
  '.rbc-agenda-view': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 0',
    overflow: 'auto',
  },
  '.rbc-agenda-view table.rbc-agenda-table': {
    width: '100%',
    border: '1px solid #DDD',
    borderSpacing: '0',
    borderCollapse: 'collapse',
  },
  '.rbc-agenda-view table.rbc-agenda-table tbody > tr > td': {
    padding: '5px 10px',
    verticalAlign: 'top',
  },
  '.rbc-agenda-view table.rbc-agenda-table .rbc-agenda-time-cell': {
    paddingLeft: '15px',
    paddingRight: '15px',
    textTransform: 'lowercase',
  },
  '.rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td': {
    borderLeft: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td': {
    borderLeftWidth: '0',
    borderRight: '1px solid #DDD',
  },
  '.rbc-agenda-view table.rbc-agenda-table tbody > tr + tr': {
    borderTop: '1px solid #DDD',
  },
  '.rbc-agenda-view table.rbc-agenda-table thead > tr > th': {
    padding: '3px 5px',
    textAlign: 'left',
    borderBottom: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-agenda-view table.rbc-agenda-table thead > tr > th': {
    textAlign: 'right',
  },
  '.rbc-agenda-time-cell': {
    textTransform: 'lowercase',
  },
  '.rbc-agenda-time-cell .rbc-continues-after:after': {
    content: "' »'",
  },
  '.rbc-agenda-time-cell .rbc-continues-prior:before': {
    content: "'« '",
  },
  '.rbc-agenda-date-cell, .rbc-agenda-time-cell': {
    whiteSpace: 'nowrap',
  },
  '.rbc-agenda-event-cell': {
    width: '100%',
  },
  '.rbc-time-column': {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  '.rbc-time-column .rbc-timeslot-group': {
    flex: '1',
  },
  '.rbc-timeslot-group': {
    borderBottom: '1px solid #DDD',
    minHeight: '40px',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  '.rbc-time-gutter, .rbc-header-gutter': {
    flex: 'none',
  },
  '.rbc-label': {
    padding: '0 5px',
  },
  '.rbc-day-slot': {
    position: 'relative',
  },
  '.rbc-day-slot .rbc-events-container': {
    bottom: '0',
    left: '0',
    position: 'absolute',
    right: '0',
    marginRight: '10px',
    top: '0',
  },
  '.rbc-day-slot .rbc-events-container.rbc-rtl': {
    left: '10px',
    right: '0',
  },
  '.rbc-day-slot .rbc-event, .rbc-day-slot .rbc-background-event': {
    border: '1px solid #265985',
    display: 'flex',
    maxHeight: '100%',
    minHeight: '20px',
    flexFlow: 'column wrap',
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'absolute',
  },
  '.rbc-day-slot .rbc-background-event': {
    opacity: '0.75',
  },
  '.rbc-day-slot .rbc-event-label': {
    flex: 'none',
    paddingRight: '5px',
    width: 'auto',
  },
  '.rbc-day-slot .rbc-event-content': {
    width: '100%',
    flex: '1 1 0',
    wordWrap: 'break-word',
    lineHeight: '1',
    height: '100%',
    minHeight: '1em',
  },
  '.rbc-day-slot .rbc-time-slot': {
    borderTop: '1px solid #f7f7f7',
  },
  '.rbc-time-view-resources .rbc-time-gutter, .rbc-time-view-resources .rbc-time-header-gutter':
    {
      position: 'sticky',
      left: '0',
      backgroundColor: 'white',
      borderRight: '1px solid #DDD',
      zIndex: '10',
      marginRight: '-1px',
    },
  '.rbc-time-view-resources .rbc-time-header': {
    overflow: 'hidden',
  },
  '.rbc-time-view-resources .rbc-time-header-content': {
    minWidth: 'auto',
    flex: '1 0 0',
    flexBasis: '0px',
  },
  '.rbc-time-view-resources .rbc-time-header-cell-single-day': {
    display: 'none',
  },
  '.rbc-time-view-resources .rbc-day-slot': {
    minWidth: '140px',
  },
  '.rbc-time-view-resources .rbc-header, .rbc-time-view-resources .rbc-day-bg':
    {
      width: '140px',
      flex: '1 1 0',
      flexBasis: '0 px',
    },
  '.rbc-time-header-content + .rbc-time-header-content': {
    marginLeft: '-1px',
  },
  '.rbc-time-slot': {
    flex: '1 0 0',
  },
  '.rbc-time-slot.rbc-now': {
    fontWeight: 'bold',
  },
  '.rbc-day-header': {
    textAlign: 'center',
  },
  '.rbc-slot-selection': {
    zIndex: '10',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: '75%',
    width: '100%',
    padding: '3px',
  },
  '.rbc-slot-selecting': {
    cursor: 'move',
  },
  '.rbc-time-view': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    width: '100%',
    border: '1px solid #DDD',
    minHeight: '0',
  },
  '.rbc-time-view .rbc-time-gutter': {
    whiteSpace: 'nowrap',
  },
  '.rbc-time-view .rbc-allday-cell': {
    boxSizing: 'content-box',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  '.rbc-time-view .rbc-allday-cell + .rbc-allday-cell': {
    borderLeft: '1px solid #DDD',
  },
  '.rbc-time-view .rbc-allday-events': {
    position: 'relative',
    zIndex: '4',
  },
  '.rbc-time-view .rbc-row': {
    boxSizing: 'border-box',
    minHeight: '20px',
  },
  '.rbc-time-header': {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'row',
  },
  '.rbc-time-header.rbc-overflowing': {
    borderRight: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-time-header.rbc-overflowing': {
    borderRightWidth: '0',
    borderLeft: '1px solid #DDD',
  },
  '.rbc-time-header > .rbc-row:first-of-type': {
    borderBottom: '1px solid #DDD',
  },
  '.rbc-time-header > .rbc-row.rbc-row-resource': {
    borderBottom: '1px solid #DDD',
  },
  '.rbc-time-header-cell-single-day': {
    display: 'none',
  },
  '.rbc-time-header-content': {
    flex: '1',
    display: 'flex',
    minWidth: '0',
    flexDirection: 'column',
    borderLeft: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-time-header-content': {
    borderLeftWidth: '0',
    borderRight: '1px solid #DDD',
  },
  '.rbc-time-header-content > .rbc-row.rbc-row-resource': {
    borderBottom: '1px solid #DDD',
    flexShrink: '0',
  },
  '.rbc-time-content': {
    display: 'flex',
    flex: '1 0 0%',
    alignItems: 'flex-start',
    width: '100%',
    borderTop: '2px solid #DDD',
    overflowY: 'auto',
    position: 'relative',
  },
  '.rbc-time-content > .rbc-time-gutter': {
    flex: 'none',
  },
  '.rbc-time-content > * + * > *': {
    borderLeft: '1px solid #DDD',
  },
  '.rbc-rtl .rbc-time-content > * + * > *': {
    borderLeftWidth: '0',
    borderRight: '1px solid #DDD',
  },
  '.rbc-time-content > .rbc-day-slot': {
    width: '100%',
    userSelect: 'none',
  },
  '.rbc-current-time-indicator': {
    position: 'absolute',
    zIndex: '3',
    left: '0',
    right: '0',
    height: '1px',
    backgroundColor: '#74ad31',
    pointerEvents: 'none',
  },
};

export default ReactBigCalendarCSS;
