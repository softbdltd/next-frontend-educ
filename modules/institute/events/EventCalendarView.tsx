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
import Calendar from '../../../@core/calendar/Calendar';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {H1} from '../../../@core/elements/common';
import {calendarService} from '../../../services/CalendarService/CalendarService';
import {useFetchPublicCalenderEvents} from '../../../services/cmsManagement/hooks';
import {
  addStartEndPropsToList,
  eventsDateTimeMap,
  getNavigationFilter,
  getRangeChangeFilters,
} from '../../../services/global/globalService';
import {
  ICalendar,
  ICalendarQuery,
} from '../../../shared/Interface/common.interface';
import EventCalendarDetails from './EventCalendarDetails';

const localizer = momentLocalizer(moment);

const InstituteEventCalendarView = () => {
  const useIntlObj = useIntl();
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
    setIsOpenDetailsView(true);
    const item = eventsList.find((ev) => ev.id === e.id) as ICalendar;
    setSelectedItem(item);
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

  const calendarServiceOpt = calendarService(eventsList, useIntlObj);

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
              {useIntlObj.messages['menu.calendar']}
            </H1>
          }
        />
        <CardContent>
          <Grid item xs={12} md={12} style={{paddingTop: 20}}>
            {isOpenDetailsView ? (
              <div>
                <EventCalendarDetails
                  itemData={selectedItem}
                  isLoading={isLoading}
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Box style={{paddingTop: 20}}>
                    <CancelButton onClick={onClose} isLoading={false} />
                  </Box>
                </Box>
              </div>
            ) : (
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
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default InstituteEventCalendarView;
