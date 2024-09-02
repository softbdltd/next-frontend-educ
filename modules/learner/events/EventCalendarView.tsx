import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {momentLocalizer, View} from 'react-big-calendar';
import Calendar from '../../../@core/calendar/Calendar';
import {useFetchCalenderEvents} from '../../../services/cmsManagement/hooks';
import {Box, Card, CardContent, CardHeader, Grid} from '@mui/material';
import EventCalendarDetails from './EventCalendarDetails';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {H1} from '../../../@core/elements/common';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
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
import {useCustomStyle} from '../../../@core/hooks/useCustomStyle';
import {calendarService} from '../../../services/CalendarService/CalendarService';

const localizer = momentLocalizer(moment);

const YouthEventCalendarView = () => {
  const intlOpt = useIntl();
  const authUser = useAuthUser<YouthAuthUser>();
  const result = useCustomStyle();

  const [selectedItem, setSelectedItem] = useState<ICalendar>();
  const [viewFilters, setViewFilters] = useState<ICalendarQuery | null>(null);
  const [eventsList, setEventsList] = useState<Array<ICalendar>>([]);
  const [selectedView, setSelectedView] = useState<View>('month');

  const [isOpenDetailsView, setIsOpenDetailsView] = useState(false);

  let {data: events} = useFetchCalenderEvents(viewFilters);

  useEffect(() => {
    if (authUser?.isYouthUser) {
      setViewFilters({
        type: 'month',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        learner_id: authUser?.learnerId,
      });
    }
  }, [authUser]);

  useEffect(() => {
    addStartEndPropsToList(events);
  }, [events]);

  useEffect(() => {
    if (events) {
      setEventsList(eventsDateTimeMap(events));
    }
  }, [events]);

  const onNavigateEvent = (e: any) => {
    setViewFilters((prev) => {
      return getNavigationFilter(e, prev);
    });
  };

  const onSelectEvent = (e: any) => {
    setIsOpenDetailsView(true);
    const item = eventsList.find((ev) => ev.id === e.id) as ICalendar;
    setSelectedItem(item);
  };
  const onClose = () => {
    setIsOpenDetailsView(false);
  };
  const onViewEvent = (view: View) => {
    setSelectedView(view);
  };

  const onRangeChangeEvent = (range: any, changedView: View | undefined) => {
    let view = changedView ?? selectedView;
    setViewFilters((prev: any) => {
      return getRangeChangeFilters(range, view, prev);
    });
    setSelectedView(view);
  };

  const calendarServiceOpt = calendarService(eventsList, intlOpt);
  return (
    <Card>
      {/*<CardHeader title={<H3>Calendar</H3>} />*/}
      <CardHeader
        title={<H1 sx={{...result.h3}}>{intlOpt.messages['menu.calendar']}</H1>}
      />
      <CardContent>
        <Grid item xs={12} md={12} style={{paddingTop: 20}}>
          {isOpenDetailsView ? (
            <div>
              <EventCalendarDetails itemData={selectedItem} />
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
  );
};

export default YouthEventCalendarView;
