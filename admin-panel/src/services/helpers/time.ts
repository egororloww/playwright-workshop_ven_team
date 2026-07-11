/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DateTime } from 'luxon';
import moment from 'moment-timezone';

const TIME_ZONE = 'America/New_York';

export const getFullYearInEST = (): number => {
  const now: DateTime = DateTime.now().setZone('America/New_York');

  const fullYear: number = now.year;

  return fullYear;
};

export const DATE_FORMAT = 'MMM D, YYYY';
export const TIME_FORMAT = 'h:mm A';
export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const formatBookingShortDateMoment = (date: Date): string => {
  return moment(date).tz(TIME_ZONE).format('MMMM DD');
};
export const formatBookingDateMoment = (date: Date): string => {
  return moment(date).tz(TIME_ZONE).format(DATE_TIME_FORMAT);
};
export const formatBookingCreatedDateMoment = (date: Date): string => {
  return moment(date).tz(TIME_ZONE).format(DATE_TIME_FORMAT);
};
export const formatBookingCreatedAtDateMoment = (date: Date): string => {
  return moment(date).tz(TIME_ZONE).format(DATE_TIME_FORMAT);
};
export const formatTableDateMoment = (date: Date): string => {
  return moment(date).tz(TIME_ZONE).format(DATE_FORMAT);
};
export const formatTableTimeMoment = (date: Date): string => {
  return moment(date).tz(TIME_ZONE).format(TIME_FORMAT);
};
export const pickerDateESTToISOString = (date: Date | string): string => {
  return moment(date).parseZone().tz(TIME_ZONE, true).toISOString();
};

export const calculateDifferenceBetweenTwoDates = (startDate: Date, endDate: Date): number => {
  if (endDate && startDate) {
    const date1 = new Date(endDate);
    const date2 = new Date(startDate);

    date1.setSeconds(0);
    date1.setMilliseconds(0);
    date2.setSeconds(0);
    date2.setMilliseconds(0);

    const differenceMs = date1.getTime() - date2.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return differenceDays;
  } else {
    return 0;
  }
};

export const convertToPst = (isoString: string | undefined = undefined): Date => {
  const inputMoment = isoString ? moment(isoString) : moment();
  const newYorkMoment = moment.tz(TIME_ZONE);
  const offsetDiffMinutes = (newYorkMoment.utcOffset() - inputMoment.utcOffset()) * -1;
  const modifiedMoment = inputMoment.subtract(offsetDiffMinutes, 'minutes');
  const modifiedDate = modifiedMoment.toDate();

  return modifiedDate;
};

export const getDates = (startDate: string, endDate: string): string[] => {
  const dates = [];
  let currentDate = moment(startDate);
  const lastDate = moment(endDate);

  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString());
    currentDate = currentDate.clone().add(1, 'days');
    currentDate.utc().hour() === 3 ? currentDate.add(1, 'hour') : currentDate;
  }

  return dates;
};

export const convertDataToMainTimeZone = (date: Date | string): moment.Moment => {
  return moment(date).parseZone().tz(TIME_ZONE, true);
};

export const transformTimeZoneToLocal = (date: Date | string): Date => {
  return new Date(moment(date).tz('America/New_York').format(DATE_TIME_FORMAT));
};

export const getStartDateOf = (date: Date | string, type: moment.unitOfTime.StartOf = 'month'): moment.Moment => {
  return moment(date || undefined).startOf(type);
};
export const getEndDateOf = (date: Date | string, type: moment.unitOfTime.StartOf = 'month'): moment.Moment => {
  return moment(date || undefined).endOf(type);
};
