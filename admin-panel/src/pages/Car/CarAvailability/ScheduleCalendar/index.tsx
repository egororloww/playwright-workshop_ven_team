import { ReactNode, useState } from 'react';
import moment from 'moment-timezone';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CarAvailabilityScheduleType } from '@/services/types/cars';
import { getEndDateOf, getStartDateOf, transformTimeZoneToLocal } from '@/services/helpers/time';
import { UnavailableReasonEnum } from '@/services/enums';
import { Typography } from '@/components';
import classes from './index.module.scss';
import BookingDetailsDrawer from '@components/common/BookingDetailsDrawer';

type PropsType = {
  availabilitySchedule: CarAvailabilityScheduleType[];
  startDate: Date | null;
};

type EventType = {
  id: number | null;
  title: UnavailableReasonEnum;
  start: Date;
  end: Date;
  comment?: string;
};

export const ScheduleCalendar = ({ availabilitySchedule, startDate }: PropsType): ReactNode => {
  const localizer = momentLocalizer(moment);
  const selectedMinDate = new Date(getStartDateOf(startDate || '', 'day').format('MMMM DD, YYYY, hh:mm A'));
  const selectedMaxDate = new Date(getEndDateOf(startDate || '', 'day').format('MMMM DD, YYYY, hh:mm A'));
  const [bookingId, setBookingId] = useState<number | null>(null);

  const handleSelectEvent = ({ title, id }: EventType): void => {
    if (title === UnavailableReasonEnum.booking) {
      setBookingId(id);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Calendar
        className={classes.calendar}
        view="day"
        onSelectEvent={handleSelectEvent}
        localizer={localizer}
        events={availabilitySchedule.map((event) => {
          const dateFrom = transformTimeZoneToLocal(event.dateFrom);
          const dateTo = transformTimeZoneToLocal(event.dateTo);
          const start = dateFrom < selectedMinDate ? selectedMinDate : dateFrom;
          const end = dateTo > selectedMaxDate ? selectedMaxDate : dateTo;

          return {
            id: event.id,
            title: event.type,
            start,
            end,
            comment: event.comment,
          };
        })}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: EventComponent,
        }}
        date={selectedMinDate}
      />

      <BookingDetailsDrawer bookingId={bookingId} onClose={() => setBookingId(null)} />
    </div>
  );
};

const sliceComment = (event: EventType): string | undefined => {
  const linesQty = Math.abs(moment(event.start).diff(moment(event.end), 'minute')) / 30;
  const maxChars = linesQty * 24;

  if (event.comment && event.comment.length > maxChars) {
    return `${event.comment.slice(0, maxChars - 3)}...`;
  }

  return event.comment;
};

const EventComponent = ({ event }: { event: EventType }): ReactNode => {
  return (
    <div className={`${classes.event} ${classes['event__' + event.title]}`}>
      {UnavailableReasonEnum.unavailableHours === event.title ? <Typography>{sliceComment(event)}</Typography> : null}
      {UnavailableReasonEnum.booking === event.title ? <Typography>Booking #{event.id}</Typography> : null}
      {UnavailableReasonEnum.buffer === event.title ? <Typography>Buffer time</Typography> : null}
    </div>
  );
};
