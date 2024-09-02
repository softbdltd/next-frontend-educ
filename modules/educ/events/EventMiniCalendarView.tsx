import {Box, Card, CardContent, Grid} from '@mui/material';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {momentLocalizer, View} from 'react-big-calendar';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../@core/utility/AppHooks';
import Calendar from '../../@core/calendar/Calendar';
import CancelButton from '../../@core/elements/button/CancelButton/CancelButton';
import {calendarService} from '../../services/CalendarService/CalendarService';
import {useFetchCalenderEvents} from '../../services/cmsManagement/hooks';
import {
  addStartEndPropsToList,
  eventsDateTimeMap,
  getNavigationFilter,
} from '../../services/global/globalService';
import {useFetchTrainingCenters} from '../../services/instituteManagement/hooks';
import {
  ICalendar,
  ICalendarQuery,
} from '../../shared/Interface/common.interface';
import CustomFilterableSelect from '../learner/training/components/CustomFilterableSelect';
import EventCalendarDetailsV2 from './EventCalendarDetailsV2';

const localizer = momentLocalizer(moment);

const EventMiniCalendarView = () => {
  const {messages} = useIntl();
  const authUser = useAuthUser();
  const [selectedItem, setSelectedItem] = useState<ICalendar>();
  const [viewFilters, setViewFilters] = useState<ICalendarQuery | null>(null);

  const [eventsList, setEventsList] = useState<Array<ICalendar>>([]);
  const [isOpenDetailsView, setIsOpenDetailsView] = useState(false);
  let {data: events} = useFetchCalenderEvents(viewFilters);

  const [trainingCenterFilters, setTrainingCenterFilters] = useState<any>(null);
  const {data: trainingCenters, isLoading: isLoadingTrainingCenter} =
    useFetchTrainingCenters(trainingCenterFilters);
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState<any>('');

  const handleChangeTrainingFilter = useCallback(
    (value: any) => {
      setSelectedTrainingCenter(value);
      setViewFilters((prev: any) => {
        return {...prev, training_center_id: value};
      });
    },
    [viewFilters],
  );

  useEffect(() => {
    if (authUser?.isTrainingCenterUser) {
      setViewFilters({
        type: 'month',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        training_center_id: authUser?.training_center_id,
      });
    } else if (authUser?.isInstituteUser) {
      setViewFilters({
        type: 'month',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setTrainingCenterFilters({});
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
  const intlOpt = useIntl();
  const calendarServiceOpt = calendarService(eventsList, intlOpt);
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {!authUser?.isTrainingCenterUser && (
            <Grid item xs={12} md={12}>
              <CustomFilterableSelect
                id='training_center_id'
                label={messages['common.training_center']}
                isLoading={isLoadingTrainingCenter}
                options={trainingCenters}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                defaultValue={selectedTrainingCenter}
                onChange={(value) => handleChangeTrainingFilter(value)}
              />
            </Grid>
          )}
          <Grid item xs={12} md={12}>
            {isOpenDetailsView ? (
              <div>
                <EventCalendarDetailsV2 itemData={selectedItem} />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Box style={{paddingTop: 20}}>
                    <CancelButton onClick={onClose} isLoading={false} />
                  </Box>
                </Box>
              </div>
            ) : (
              <Calendar
                events={eventsList || null}
                localizer={localizer}
                selectable={true}
                style={{height: 500}}
                startAccessor='start'
                endAccessor='end'
                defaultDate={moment().toDate()}
                views={['month']}
                onView={(view: View) =>
                  setViewFilters((prev) => {
                    return {
                      ...prev,
                      ...{type: view === 'agenda' ? 'schedule' : view},
                    };
                  })
                }
                onNavigate={onNavigateEvent}
                onSelectEvent={onSelectEvent}
                components={calendarServiceOpt.componentObject}
                formats={calendarServiceOpt.calendarFormatOption}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EventMiniCalendarView;
