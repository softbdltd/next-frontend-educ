import React, {useCallback, useContext, useEffect, useState} from 'react';
import moment from 'moment';
import {momentLocalizer, View} from 'react-big-calendar';
import Calendar from '../../../@core/calendar/Calendar';
import {useFetchCalenderEvents} from '../../../services/cmsManagement/hooks';
import CalendarAddEditPopup from './EventCalendarAddEditPopup';
import EventCalendarDetailsPopup from './EventCalendarDetailsPopupup';
import PageBlock from '../../../@core/utilities/PageBlock';
import {useIntl} from 'react-intl';
import {
  ICalendar,
  ICalendarQuery,
} from '../../../shared/Interface/common.interface';
import {
  addStartEndPropsToList,
  getNavigationFilter,
  getRangeChangeFilters,
} from '../../../services/global/globalService';
import {Event} from '@mui/icons-material';
import {calendarService} from '../../../services/CalendarService/CalendarService';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const {messages, formatDate} = useIntl();
  const intlOpt = useIntl();
  const {calender_event: calenderEventPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  let requestQuery: ICalendarQuery = {
    type: 'month',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  const [selectedView, setSelectedView] = useState<View>('month');
  const [selectedItemId, setSelectedItemId] = useState<number | null>();
  const [selectedStartDate, setSelectedStartDate] = useState<
    string | undefined
  >(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<string | undefined>(
    undefined,
  );
  const [viewFilters, setViewFilters] = useState<ICalendarQuery>(requestQuery);
  const [eventsList, setEventsList] = useState<Array<ICalendar>>([]);

  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedItemId(undefined);
  }, []);

  const openAddEditModal = useCallback((itemId: number | undefined) => {
    setIsOpenDetailsModal(false);
    setIsOpenAddEditModal(true);
    setSelectedItemId(itemId);
  }, []);

  const openDetailsModal = useCallback((itemId: number | undefined) => {
    setIsOpenDetailsModal(true);
    setSelectedItemId(itemId);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  let {data: events} = useFetchCalenderEvents(viewFilters);

  const refreshDataTable = useCallback(
    (event, item) => {
      if (item.start) {
        item.start = new Date(`${item.start}T${item.start_time}`);
      }
      if (item.end) {
        item.end = new Date(`${item.end}T${item.end_time}`);
      }
      switch (event) {
        case 'delete':
          const newList = eventsList.filter(
            (e) => e.id != item,
          ) as Array<ICalendar>;
          setEventsList(newList);
          break;
        case 'create':
          setEventsList([item, ...eventsList]);
          break;
        default:
        case 'update':
          const excludeItemFromList = eventsList.filter((e) => e.id != item.id);
          setEventsList([item, ...excludeItemFromList]);
          break;
      }
    },
    [eventsList],
  );

  useEffect(() => {
    if (events) {
      addStartEndPropsToList(events);
    }
  }, [events]);

  useEffect(() => {
    if (events) {
      // events = eventsDateTimeMap(events);
      events.map((e: ICalendar) => {
        let start = e.start_time
          ? `${e.start}T${e.start_time}`
          : `${e.start}T00:00:00`;
        let end = e.end_time ? `${e.end}T${e.end_time}` : `${e.end}T00:00:00`;
        e.start = new Date(start);
        e.end = new Date(end);
        return e;
      });
      setEventsList(events);
    }
  }, [events]);

  const onSelectSlot = (slotInfo: any) => {
    setSelectedStartDate(slotInfo.start as string);
    setSelectedEndDate(slotInfo.end as string);
    openAddEditModal(slotInfo.id);
    console.log(slotInfo);
  };
  const onSelectEvent = (e: any) => {
    openDetailsModal(e.id as number);
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
    <>
      <PageBlock
        title={
          <>
            <Event />
            {messages['menu.calendar']}
          </>
        }>
        <Calendar
          events={eventsList}
          // events={events1}
          selectable={true}
          localizer={localizer}
          style={{height: '100vh'}}
          startAccessor='start'
          endAccessor='end'
          defaultDate={moment().toDate()}
          onView={onViewEvent}
          onNavigate={onNavigateEvent}
          onSelectEvent={onSelectEvent}
          onRangeChange={onRangeChangeEvent}
          onSelectSlot={onSelectSlot}
          components={calendarServiceOpt.componentObject}
          formats={{
            monthHeaderFormat: (date, culture, localizer) => {
              return formatDate(date, {
                month: 'long',
                year: 'numeric',
              });
            },
          }}
        />

        {isOpenAddEditModal &&
          (calenderEventPermission.canCreate ||
            calenderEventPermission.canUpdate) && (
            <CalendarAddEditPopup
              key={1}
              onClose={closeAddEditModal}
              itemId={selectedItemId}
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              refreshDataTable={refreshDataTable}
            />
          )}
        {isOpenDetailsModal &&
          selectedItemId &&
          calenderEventPermission.canRead && (
            <EventCalendarDetailsPopup
              key={1}
              itemId={selectedItemId}
              onClose={closeDetailsModal}
              openEditModal={openAddEditModal}
              refreshDataTable={refreshDataTable}
            />
          )}
      </PageBlock>
    </>
  );
};

export default EventCalendar;
