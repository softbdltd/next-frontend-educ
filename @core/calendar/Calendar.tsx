import React from 'react';
import {Calendar, CalendarProps} from 'react-big-calendar';
// @ts-ignore
import ReactBigCalendarCSS from './ReactBigCalendarCSS';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';

const StyledWrapper = styled('div')(() => ({...ReactBigCalendarCSS}));

interface IMyCalendar extends CalendarProps {}

const MyCalendar = ({events, ...rest}: IMyCalendar) => {
  const {messages} = useIntl();
  const lang = {
    today: messages['calendar.today'],
    previous: messages['common.previous'],
    next: messages['common.next'],
    agenda: messages['calendar.schedule'],
    month: messages['calendar.month'],
    week: messages['calendar.week'],
    day: messages['calendar.day'],
  };

  return (
    <StyledWrapper>
      <Calendar
        events={events}
        // @ts-ignore
        messages={lang}
        startAccessor='start'
        endAccessor='end'
        {...rest}
      />
    </StyledWrapper>
  );
};

export default MyCalendar;
