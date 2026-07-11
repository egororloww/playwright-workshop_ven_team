import moment from 'moment-timezone';
import { pickerDateESTToISOString } from './helpers';

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_REGEX = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?`~[\]\\|]).{8,}$/;

export const defaultPickupDate: string = pickerDateESTToISOString(moment().hours(9).minutes(0).seconds(0).toDate());
export const defaultReturnDate: string = pickerDateESTToISOString(moment(defaultPickupDate).add(3, 'days').hours(9).minutes(0).seconds(0).toDate());
