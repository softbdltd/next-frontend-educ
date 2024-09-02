import moment from 'moment';
import {DATE_FORMAT, TIME_FORMAT} from '../../@core/utilities/DateTime';
import {
  catchBlockHandler,
  getMomentDateFormat,
} from '../../@core/utilities/helpers';
import {ICalendar} from '../../shared/Interface/common.interface';
import {View} from 'react-big-calendar';
import {apiGet, apiPost} from '../../@core/common/api';
import {
  API_PUBLIC_BD_MAP_DATA_STATISTICS,
  API_PUBLIC_DISTRICT_WISE_TOTAL_LEARNER,
  API_SYSTEM_USER_SEND_MESSAGE_TO_BULK_LEARNER,
} from '../../@core/common/apiRoutes';

export const addStartEndPropsToList = (events: ICalendar[]) => {
  try {
    if (events) {
      events.forEach((element: any) => {
        element['start'] = element.start_date;
        element['end'] = element.start_date;
      });
    }
  } catch (error) {
    catchBlockHandler(error);
  }
};
export const formatDateTime = (itemData: ICalendar) => {
  try {
    if (itemData) {
      itemData.start_date = moment(itemData.start).format(DATE_FORMAT);
      itemData.end_date = moment(itemData.end).format(DATE_FORMAT);
      itemData.start_time = moment(itemData.start).format(TIME_FORMAT);
      itemData.end_time = moment(itemData.end).format(TIME_FORMAT);
    }
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getNavigationFilter = (event: any, prev: any) => {
  const monthNumber = moment(event).month() + 1;
  const yearNumber = moment(event).year();
  if (prev.type === 'day') {
    return {
      ...prev,
      ...{
        month: monthNumber,
        date: moment(event).format('YYYY-MM-DD'),
        year: yearNumber,
      },
    };
  }
  return {
    ...prev,
    ...{
      month: monthNumber,
      year: yearNumber,
      from_date: null,
      to_date: null,
      date: null,
    },
  };
};

export const getRangeChangeFilters = (range: any, view: View, prev: any) => {
  if (view == 'day') {
    return {
      ...prev,
      type: view,
      date: getMomentDateFormat(new Date(range[0]), 'YYYY-MM-DD'),
      year: null,
      month: null,
      from_date: null,
      to_date: null,
    };
  } else if (view == 'week') {
    return {
      ...prev,
      type: view,
      date: getMomentDateFormat(new Date(range[1]), 'YYYY-MM-DD'),
      year: null,
      month: null,
      from_date: null,
      to_date: null,
    };
  } else if (view == 'month') {
    let date = new Date(range.start);
    date.setDate(date.getDate() + 8);
    return {
      ...prev,
      type: view,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: null,
      from_date: null,
      to_date: null,
    };
  } else if (view == 'agenda') {
    return {
      ...prev,
      type: 'schedule',
      from_date: getMomentDateFormat(new Date(range.start), 'YYYY-MM-DD'),
      to_date: getMomentDateFormat(new Date(range.end), 'YYYY-MM-DD'),
      date: null,
      year: null,
      month: null,
    };
  } else {
    return {...prev};
  }
};

export const eventsDateTimeMap = (events: ICalendar[]) => {
  return (events || []).map((e: any) => {
    const start = e?.start_time ? `${e?.start}T${e.start_time}` : `${e?.start}`;
    const end = e?.end_time ? `${e?.end}T${e.end_time}` : `${e?.end}`;
    try {
      e.start = new Date(start);
    } catch (e: any) {
      e.start = new Date();
    }
    try {
      e.end = new Date(end);
    } catch (e: any) {
      e.end = new Date();
    }
    return e;
  });
};

export const sendSystemUserMsgToBulkYouth = async (data: any) => {
  try {
    let response: any = await apiPost(
      API_SYSTEM_USER_SEND_MESSAGE_TO_BULK_LEARNER,
      data,
    );
    return response.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};

export const getMapDataStatistics = async (districtId: number) => {
  try {
    let response: any = await apiGet(
      API_PUBLIC_BD_MAP_DATA_STATISTICS + '/' + districtId,
    );
    return response.data.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
export const getDistrictWiseTotalYouth = async () => {
  try {
    let response: any = await apiGet(API_PUBLIC_DISTRICT_WISE_TOTAL_LEARNER);
    return response.data.data;
  } catch (error) {
    catchBlockHandler(error);
  }
};
