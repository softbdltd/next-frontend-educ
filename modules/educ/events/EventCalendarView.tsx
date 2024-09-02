import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
} from '@mui/material';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {momentLocalizer, View} from 'react-big-calendar';
import {useIntl} from 'react-intl';
import Calendar from '../../@core/calendar/Calendar';
import CancelButton from '../../@core/elements/button/CancelButton/CancelButton';
import {H1} from '../../@core/elements/common';
import {calendarService} from '../../services/CalendarService/CalendarService';
import {useFetchPublicCalenderEvents} from '../../services/cmsManagement/hooks';
import {
  addStartEndPropsToList,
  eventsDateTimeMap,
  getNavigationFilter,
  getRangeChangeFilters,
} from '../../services/global/globalService';
import {
  ICalendar,
  ICalendarQuery,
} from '../../shared/Interface/common.interface';
import EventCalendarDetailsV2 from './EventCalendarDetailsV2';

const localizer = momentLocalizer(moment);

const EventCalendarView = () => {
  const intlOpt = useIntl();

  let requestQuery: ICalendarQuery = {
    type: 'month',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  const [selectedView, setSelectedView] = useState<View>('month');
  const [selectedItem, setSelectedItem] = useState<ICalendar>();
  const [viewFilters, setViewFilters] = useState<ICalendarQuery>(requestQuery);
  const [eventsList, setEventsList] = useState<Array<ICalendar>>([]);

  const [isOpenDetailsView, setIsOpenDetailsView] = useState(false);

  let {data: events, isLoading} = useFetchPublicCalenderEvents(viewFilters);

  useEffect(() => {
    addStartEndPropsToList(events);
  }, [events]);

  useEffect(() => {
    if (events) {
      setEventsList(eventsDateTimeMap(events));
    }
  }, [events]);

  const onSelectEvent = (e: any) => {
    const item = eventsList.find(
      (ev: ICalendar) => ev.id === e.id,
    ) as ICalendar;
    setSelectedItem(item);
    setIsOpenDetailsView(true);
    // console.log(item);
  };
  const onClose = () => {
    setIsOpenDetailsView(false);
  };

  const onNavigateEvent = (e: any) => {
    setViewFilters((prev) => {
      return getNavigationFilter(e, prev);
    });
  };
  const onViewEvent = (view: View) => {
    setSelectedView(view);
  };

  const calendarServiceOpt = calendarService(eventsList, intlOpt);

  const onRangeChangeEvent = (range: any, changedView: View | undefined) => {
    let view = changedView ?? selectedView;
    setViewFilters((prev: any) => {
      return getRangeChangeFilters(range, view, prev);
    });
    setSelectedView(view);
  };

  return (
    <Container maxWidth={'lg'} sx={{mt: 5, mb: 5}}>
      <Card>
        <CardHeader
          title={
            <H1 style={{fontSize: '2.25rem'}}>
              {intlOpt.messages['menu.calendar']}
            </H1>
          }
        />
        <CardContent>
          <Grid item xs={12} md={12} style={{paddingTop: 20}}>
            {isOpenDetailsView && (
              <div>
                <EventCalendarDetailsV2
                  itemData={selectedItem}
                  isLoading={isLoading}
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Box style={{paddingTop: 20}}>
                    <CancelButton onClick={onClose} isLoading={false} />
                  </Box>
                </Box>
              </div>
            )}
            <Box sx={{display: isOpenDetailsView ? 'none' : 'block'}}>
              <Calendar
                events={eventsList}
                localizer={localizer}
                selectable={true}
                style={{height: '100vh'}}
                startAccessor='start'
                endAccessor='end'
                defaultDate={moment().toDate()}
                onView={onViewEvent}
                onNavigate={onNavigateEvent}
                onSelectEvent={onSelectEvent}
                onRangeChange={onRangeChangeEvent}
                components={calendarServiceOpt.componentObject}
                formats={calendarServiceOpt.calendarFormatOption}
              />
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EventCalendarView;
