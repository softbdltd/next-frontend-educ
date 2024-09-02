import {createIntlCache} from '@formatjs/intl';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import moment from 'moment';
import React, {Children, useEffect, useState} from 'react';
import {Zoom} from 'react-awesome-reveal';
import {momentLocalizer, View} from 'react-big-calendar';
import {createIntl, useIntl} from 'react-intl';
import Calendar from '../../@core/calendar/Calendar';
import CancelButton from '../../@core/elements/button/CancelButton/CancelButton';
import {H4} from '../../@core/elements/common';
import UnderlinedHeading from '../../@core/elements/common/UnderlinedHeading';
import {useFetchPublicCalenderEvents} from '../../services/cmsManagement/hooks';
import {
  addStartEndPropsToList,
  eventsDateTimeMap,
} from '../../services/global/globalService';
import {
  ICalendar,
  ICalendarQuery,
} from '../../shared/Interface/common.interface';
import NoDataFoundComponent from '../learner/common/NoDataFoundComponent';
import EventCalendarDetailsV2 from './EventCalendarDetailsV2';

const localizer = momentLocalizer(moment);
const PREFIX = 'EventSection';

const classes = {
  boxItem: `${PREFIX}-boxItem`,
  button: `${PREFIX}-button`,
  dateHeader: `${PREFIX}-dateHeader`,
  gridContainer: `${PREFIX}-gridContainer`,
  eventList: `${PREFIX}-eventList`,
  listItem: `${PREFIX}-listItem`,
  listIcon: `${PREFIX}-listIcon`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  marginTop: '60px',
  [`& .${classes.boxItem}`]: {
    background: theme.palette.background.paper,
    borderRadius: 4 * parseInt(theme.shape.borderRadius.toString()),
    padding: '20px 15px 30px 15px',
    margin: 0,
    [theme.breakpoints.down('xl')]: {
      padding: '20px 10px 30px 10px',
    },
  },
  [`& .${classes.button}`]: {
    borderRadius: 40,
  },
  [`& .${classes.listIcon}`]: {
    transform: 'translateY(5px)',
    marginRight: '12px',
  },
  [`& .${classes.listItem}`]: {
    ['& .MuiListItemText-primary']: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
    },
  },
  [`& .${classes.gridContainer}`]: {
    borderRadius: 8,
    padding: '24px',
  },
  [`& .${classes.eventList}`]: {
    [`& .MuiListItem-root:hover`]: {
      background: '#ebebeb',
    },
    [`& .MuiListItem-root`]: {
      borderBottom: '1px solid #e7e7e7',
    },
  },
  [`& .${classes.dateHeader}`]: {
    borderRadius: 8,
    padding: '12px',
    paddingTop: '16px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '.rbc-month-row,.rbc-row-content,.rbc-row-content>.rbc-row,.rbc-date-cell': {
    padding: 0,
    position: 'relative',
    height: '100%',
  },
  '& .rbc-date-cell': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  '& .rbc-date-cell>a': {
    pointerEvents: 'none',
  },
  '& .rbc-toolbar .rbc-btn-group>button:first-of-type': {
    display: 'none',
  },
  '& .rbc-toolbar .rbc-btn-group>button:first-of-type+button': {
    borderBottomLeftRadius: '4px',
    borderTopLeftRadius: '4px',
  },
}));

const EventSection = () => {
  const {messages, formatDate, locale} = useIntl();
  const dateFormat = 'YYYY-MM-DD';
  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: locale,
      messages: {},
    },
    cache,
  );

  const [selectedItems, setSelectedItems] = useState<Array<ICalendar[]>>([]);
  const [isOpenDetailsView, setIsOpenDetailsView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalendar>();
  const [viewFilters, setViewFilters] = useState<ICalendarQuery>({
    type: 'month',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [eventsList, setEventsList] = useState<Array<ICalendar>>([]);
  const [currentDate, setCurrentDate] = useState<any>(
    moment(Date.now()).format(dateFormat),
  );
  const [pageIndex, setPageIndex] = useState(0);

  let {data: events} = useFetchPublicCalenderEvents(viewFilters);

  useEffect(() => {}, [currentDate]);

  useEffect(() => {
    addStartEndPropsToList(events);
    // setCurrentDate('2022-11-11');
  }, [events]);

  const setSelectedDateItems = (date: Date, evtList?: any) => {
    const list: Array<ICalendar> = Array.isArray(evtList)
      ? evtList
      : eventsList;
    const items = list.filter(
      (ev: ICalendar) =>
        moment(ev.start).format(dateFormat) === moment(date).format(dateFormat),
    );

    setPageIndex(0);
    let selectedItemsArray: any[] = [];
    let tempGroupItems: any[] = [];

    (items || [])?.map((item, index) => {
      if (index && index % 4 == 0) {
        selectedItemsArray.push(tempGroupItems);
        tempGroupItems = [];
      }
      tempGroupItems.push(item);
    });
    selectedItemsArray.push(tempGroupItems);
    setSelectedItems(selectedItemsArray);
  };

  useEffect(() => {
    if (events) {
      const evts = eventsDateTimeMap(events);
      setEventsList(evts);
      setSelectedDateItems(new Date(), evts);
    }
  }, [events]);

  const onSelectSlot = (e: any) => {
    setCurrentDate(moment(e.start).format(dateFormat));
    setSelectedDateItems(e.start);
  };

  const startDates = eventsList.map((e) =>
    moment(e.start).format(dateFormat),
  ) as string[];
  const hasEvent = (currentDate: string, allDates: string[]): boolean =>
    allDates.find((e) => e == currentDate) != undefined;
  const parsDate = (datevalue: any): string =>
    moment(datevalue).format(dateFormat);
  const eventsByDate = (currentDate: string, allDates: string[]): string[] =>
    allDates.filter((e) => e == currentDate);

  // example implementation of a wrapper
  const ColoredDateCellWrapper = (evnt: any) => {
    const {children, value} = evnt;
    const currentDate = parsDate(value);
    let _backgroundColor = '';
    if (hasEvent(currentDate, startDates)) {
      _backgroundColor = '#671688';
    }
    return React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        ...{
          backgroundColor: _backgroundColor,
        },
      },
    });
  };

  const customDateCellWrap = (e: any) => {
    const dateNumber = intl.formatNumber(e.label);
    const dateFontSize = {fontSize: '1.5rem'};
    const dateSpan = <span style={dateFontSize}>{dateNumber}</span>;
    return (
      <div>
        {hasEvent(parsDate(e.date), startDates) ? (
          <div style={{color: '#fff', position: 'relative'}}>
            {dateSpan}
            <div
              style={{
                fontSize: '0.8rem',
                position: 'absolute',
                backgroundColor: '#fff',
                color: '#671688',
                padding: '3px',
                borderRadius: '5px',
                marginLeft: '4px',
              }}>
              {intl.formatNumber(
                eventsByDate(parsDate(e.date), startDates).length,
              )}
            </div>
          </div>
        ) : (
          dateSpan
        )}
      </div>
    );
  };
  const componentObject = {
    dateCellWrapper: ColoredDateCellWrapper,
    month: {
      dateHeader: customDateCellWrap,
      header: (e: any) => {
        const lbl = messages[`calendar.${e.label}`];
        return <span>{lbl}</span>;
      },
    },
  };

  const handleSelectedEvent = (selectedItem: any) => {
    setIsOpenDetailsView(true);
    setSelectedEvent(selectedItem);
  };

  let nextBtn: any = '';
  if (selectedItems?.length - 1 > pageIndex) {
    nextBtn = (
      <Button
        onClick={() => setPageIndex((prev) => prev + 1)}
        variant={'contained'}
        color={'primary'}
        sx={{
          width: {xs: 'auto', md: '150px'},
          position: 'absolute',
          right: 0,
        }}>
        {messages['common.next']}
      </Button>
    );
  }

  let previousBtn: any = '';
  if (pageIndex > 0) {
    previousBtn = (
      <Button
        onClick={() => setPageIndex((prev) => prev - 1)}
        variant={'contained'}
        color={'primary'}
        sx={{width: {xs: 'auto', md: '150px'}, position: 'absolute', left: 0}}>
        {messages['common.previous']}
      </Button>
    );
  }

  const onClose = () => {
    setIsOpenDetailsView(false);
  };

  return (
    <StyledContainer maxWidth='lg'>
      <Zoom>
        <UnderlinedHeading>{messages['menu.events']}</UnderlinedHeading>
        <Card className={classes.gridContainer}>
          {isOpenDetailsView && (
            <div>
              {/*<EventCalendarDetails*/}
              {/*  itemData={selectedEvent}*/}
              {/*  isLoading={false}*/}
              {/*/>*/}
              <EventCalendarDetailsV2 itemData={selectedEvent} />
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Box style={{paddingTop: 20}}>
                  <CancelButton onClick={onClose} isLoading={false} />
                </Box>
              </Box>
            </div>
          )}

          <Grid
            container
            spacing={4}
            sx={{display: isOpenDetailsView ? 'none' : 'flex'}}>
            <Grid item xs={12} md={6}>
              <H4 centered className={classes.dateHeader}>
                {formatDate(currentDate, {dateStyle: 'full'})}
              </H4>
              {selectedItems[pageIndex] && selectedItems[pageIndex].length ? (
                <>
                  <List sx={{minHeight: '457px'}} className={classes.eventList}>
                    {selectedItems[pageIndex].map(
                      (selectedItem: any, i: number) => {
                        return (
                          <ListItem
                            className={classes.listItem}
                            key={i}
                            sx={{cursor: 'pointer'}}
                            onClick={() => handleSelectedEvent(selectedItem)}>
                            <ListItemText
                              primary={selectedItem.title}
                              secondary={
                                <>
                                  <DateRangeIcon className={classes.listIcon} />
                                  {formatDate(
                                    moment(selectedItem.start).format(
                                      dateFormat,
                                    ),
                                  )}
                                </>
                              }
                            />
                          </ListItem>
                        );
                      },
                    )}
                  </List>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      height: '40px',
                    }}>
                    {previousBtn}
                    {nextBtn}
                  </Box>
                </>
              ) : (
                <NoDataFoundComponent messageTextType={'h6'} />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              //
            >
              <Calendar
                getNow={() => currentDate}
                events={[]}
                localizer={localizer}
                selectable={true}
                style={{height: 578}}
                startAccessor='start'
                endAccessor='end'
                defaultDate={moment().toDate()}
                views={['month']}
                onView={(view: View) =>
                  setViewFilters((prev) => ({
                    ...prev,
                    ...{type: view === 'agenda' ? 'schedule' : view},
                  }))
                }
                onSelectSlot={onSelectSlot}
                onNavigate={(e: any) => {
                  const year = moment(e).year();
                  const month = moment(e).month() + 1;
                  setViewFilters((prev) => {
                    return {...prev, month, year};
                  });
                }}
                components={componentObject}
                formats={{
                  monthHeaderFormat: (date, culture, localizer) => {
                    return formatDate(date, {
                      month: 'long',
                      year: 'numeric',
                    });
                  },
                }}
              />
            </Grid>
          </Grid>
          {/*)}*/}
        </Card>
      </Zoom>
    </StyledContainer>
  );
};
export default EventSection;
