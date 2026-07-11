/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { User } from '../types/user';
import moment from 'moment-timezone';

export const DATE_FORMAT = 'MMMM D, yyyy h:mm A';
export const DATE_FORMAT_SHORT = 'MMMM D, yyyy';

export const formatCurrency = (number: number): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  const hasCents = number % 1 !== 0;

  if (hasCents) {
    options.minimumFractionDigits = 2;
  }

  return new Intl.NumberFormat('en-US', options).format(number);
};

export const parseJwt = (token: string): User => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  const user = JSON.parse(jsonPayload) as User;

  return user;
};

export const formatDate = (date: Date): string => {
  return moment(date).tz('America/New_York').format(DATE_FORMAT);
};

const addPrefix = (number: string) => {
  return `${number.slice(0, 1) === '+' ? '' : '+'}${number}`;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  const isValidPhoneNumber = cleaned.length === 11;

  if (!isValidPhoneNumber) {
    return addPrefix(phoneNumber);
  }

  const formatted = `+${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  return addPrefix(formatted);
};

export const calculateDifferenceBetweenTwoDates = (startDate: Date | string, endDate: Date | string): number => {
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

export const formatBookingShortDateMoment = (date: Date): string => {
  return moment(date).tz('America/New_York').format(DATE_FORMAT_SHORT);
};
export const formatBookingDateMoment = (date: Date): string => {
  return moment(date).tz('America/New_York').format(DATE_FORMAT);
};
export const formatBookingCreatedDateMoment = (date: Date): string => {
  return moment(date).format(DATE_FORMAT);
};

export const pickerDateESTToISOString = (date: Date | string): string => {
  return moment.tz(moment(date).format('YYYY-MM-DD HH:mm'), 'America/New_York').utc().format();
};

export const convertToPst = (isoString: string | undefined = undefined): Date => {
  const inputMoment = isoString ? moment(isoString) : moment();
  const newYorkMoment = moment.tz('America/New_York');
  const offsetDiffMinutes = (newYorkMoment.utcOffset() - inputMoment.utcOffset()) * -1;
  const modifiedMoment = inputMoment.subtract(offsetDiffMinutes, 'minutes');
  const modifiedDate = modifiedMoment.toDate();

  return modifiedDate;
};
